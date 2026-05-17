import Budget from "../models/budget.model.js";
import { formatCleanResponse } from "../utils/formatter.js";
import { validateAndComputeBudgetTimeline } from "../utils/budgetValidator.js";

// Helper to convert inputs securely
const parseAndValidateDate = (monthInput, yearInput) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // Handle month (Convert human 1-12 to JS 0-11 if provided)
  let budgetMonth =
    monthInput !== undefined ? Number(monthInput) - 1 : currentMonth;
  let budgetYear = yearInput !== undefined ? Number(yearInput) : currentYear;

  return { budgetMonth, budgetYear, currentMonth, currentYear };
};

export const saveBudget = async (req, reply) => {
  const userId = req.user.id;
  // 1. Extract year from body in case the client sends it, otherwise let helper fallback
  const { limit, period, alertFrequency, month } = req.body;

  // 2. Run all timeline math, window boundaries, and collision checks at once
  const timeline = await validateAndComputeBudgetTimeline(month, userId);
  if (!timeline.valid) {
    return reply
      .code(timeline.status)
      .send({ success: false, message: timeline.message });
  }

  // 4. Create budget with fully validated data fields
  const budget = await Budget.create({
    userId,
    limit,
    month: timeline.budgetMonth,
    year: timeline.budgetYear,
    period,
    alertFrequency,
  });

  return reply.code(201).send({
    success: true,
    message: "New budget added successfully",
    budget,
  });
};

// 2. GET CURRENT MONTH BUDGET
export const getBudget = async (req, reply) => {
  const userId = req.user.id;

  // Align query parsing with 1-12 human format
  const parsedMonth =
    req.query.month !== undefined ? Number(req.query.month) : undefined;
  const parsedYear =
    req.query.year !== undefined ? Number(req.query.year) : undefined;

  const now = new Date();
  const currentMonth =
    parsedMonth !== undefined ? Number(req.query.month) : now.getMonth();
  const currentYear =
    parsedYear !== undefined ? Number(req.query.year) : now.getFullYear();

  // Match fallback calculation rules for standard retrieval matching
  if (now.getMonth() === 0 && currentMonth === 11)
    currentYear = now.getFullYear() - 1;
  if (now.getMonth() === 11 && currentMonth === 0)
    currentYear = now.getFullYear() + 1;

  if (Number.isNaN(currentMonth) || Number.isNaN(currentYear)) {
    return reply
      .code(400)
      .send({ message: "Invalid month or year parameters" });
  }

  let budget = await Budget.findOne({
    userId,
    month: currentMonth,
    year: currentYear,
  });

  if (!budget) {
    // Fallback to the latest historical budget configuration
    budget = await Budget.findOne({ userId }).sort({
      year: -1,
      month: -1,
      createdAt: -1,
    });
    if (!budget) return reply.code(404).send({ message: "No budget history" });

    return reply.code(200).send({
      success: true,
      budget,
      isHistorical: true,
      message:
        "Displaying your most recent operational budget profile configuration.",
    });
  }

  reply.code(200).send({ success: true, budget });
};

// 3. GET ALL BUDGETS LIST (Deduplicated response for dashboard)
export const getBudgets = async (req, reply) => {
  const userId = req.user.id;
  const budgets = await Budget.find({ userId })
    .populate({
      path: "userId",
      select: "name email",
    })
    .sort({
      year: -1,
      month: -1,
      createdAt: -1,
    });

  // Running the clean utils helper to avoid data repetition
  const formattedResult = formatCleanResponse(budgets, "userId");

  return reply.code(200).send({
    success: true,
    user: formattedResult.user,
    budgets: formattedResult.data,
  });
};

// 4. UPDATE BUDGET CONFIGURATIONS (Month/Year parameters locked down entirely)
export const updateBudget = async (req, reply) => {
  const { eid } = req.params;
  const userId = req.user.id;
  const { limit, period, alertFrequency } = req.body;

  const budget = await Budget.findOne({ _id: eid, userId });

  if (!budget) {
    return reply.code(400).send({ message: "Budget record not found" });
  }

  budget.limit = limit ?? budget.limit;
  budget.period = period ?? budget.period;
  budget.alertFrequency = alertFrequency ?? budget.alertFrequency;

  await budget.save();

  return reply.code(200).send({
    success: true,
    message: "Budget parameters saved securely.",
    budget,
  });
};

// 5. MOVE BUDGET CALENDAR CELL (Isolated specialized handler for typo patches)
export const moveBudget = async (req, reply) => {
  const { eid } = req.params;
  const userId = req.user.id;
  const { month } = req.body; // Expects ONLY a clean month reassignment value (1-12)

  if (!month) {
    return reply.code(400).send({ success: false, message: "Target placement month is required." });
  }

  const budget = await Budget.findOne({ _id: eid, userId });
  if (!budget) {
    return reply.code(404).send({ success: false, message: "Budget target not found." });
  }

  // Re-run timelines securely passing the item ID to prevent self-collision flags
  const timeline = await validateAndComputeBudgetTimeline(month, userId, eid);
  if (!timeline.valid) {
    return reply.code(timeline.status).send({ success: false, message: timeline.message });
  }

  budget.month = timeline.budgetMonth;
  budget.year = timeline.budgetYear;
  await budget.save();

  return reply.code(200).send({
    success: true,
    message: "Budget period shifted seamlessly.",
    budget,
  });
};

export const deleteBudget = async (req, reply) => {
  const { eid } = req.params;
  const userId = req.user.id;

  const budget = await Budget.findOneAndDelete({ _id: eid, userId });

  if (!budget) {
    return reply.code(400).send({ message: "Budget not found" });
  }

  return reply.code(200).send({ message: "Budget deleted successfully" });
};
