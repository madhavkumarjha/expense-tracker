import Budget from "../models/budget.model.js";

export const getBudgets = async (req, reply) => {
  const userId = req.user.id;
  const budgets = await Budget.find({ userId }).sort({ year: -1, month: -1, createdAt: -1 });

  return reply.code(200).send({ success: true, budgets });
};

export const getBudget = async (req, reply) => {
  const userId = req.user.id;
  const now = new Date();
  const currentMonth = Number(req.query.month ?? now.getMonth());
  const currentYear = Number(req.query.year ?? now.getFullYear());

  let budget = await Budget.findOne({
    userId,
    month: currentMonth,
    year: currentYear,
  });
  // console.log(userId);
  if (!budget) {
    budget = await Budget.findOne({ userId }).sort({ createdAt: -1 });
    if (!budget)
      return reply
        .code(400)
        .send({ message: "No budget found for the current month and year" });

    return reply
      .code(200)
      .send({
        success: true,
        budget,
        isHistorical: true,
        message: "Showing last set budget",
      });
  }

  reply.code(200).send({ success: true, budget });
};

export const saveBudget = async (req, reply) => {
  const userId = req.user.id;
  const { limit, period, alertFrequency, month, year } = req.body;
  const budgetMonth = Number(month);
  const budgetYear = Number(year);
  const existingBudget = await Budget.findOne({
    userId,
    month: budgetMonth,
    year: budgetYear,
  });

  if (existingBudget) {
    return reply.code(409).send({
      success: false,
      message: "Budget already exists for the selected month and year",
    });
  }

  const budget = await Budget.create({
    userId,
    limit,
    month: budgetMonth,
    year: budgetYear,
    period,
    alertFrequency,
  });

  return reply.code(201).send({
    success: true,
    message: "New budget added successfully",
    budget,
  });
};

export const updateBudget = async (req, reply) => {
  const { eid } = req.params;
  const userId = req.user.id;
  const { limit, period, alertFrequency, month, year } = req.body;
  const budgetMonth = Number(month);
  const budgetYear = Number(year);

  const budget = await Budget.findOne({ _id: eid, userId });

  if (!budget) {
    return reply.code(400).send({ message: "Budget not found" });
  }

  const conflictingBudget = await Budget.findOne({
    userId,
    month: budgetMonth,
    year: budgetYear,
    _id: { $ne: eid },
  });

  if (conflictingBudget) {
    return reply.code(409).send({
      success: false,
      message: "Another budget already exists for the selected month and year",
    });
  }

  budget.limit = limit;
  budget.period = period;
  budget.alertFrequency = alertFrequency;
  budget.month = budgetMonth;
  budget.year = budgetYear;
  await budget.save();

  return reply.code(200).send({
    success: true,
    message: "Budget updated successfully",
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
