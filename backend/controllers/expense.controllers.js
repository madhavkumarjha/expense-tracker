import Expense from "../models/expense.model.js";
import mongoose from "mongoose";
import { formatCleanResponse } from "../utils/formatter.js";

export const getAllExpenses = async (req, reply) => {
  const userId = req.user.id;

  // 1. Normal query lagakar user ko populate karo (space separated fields ke sath)
  const expenses = await Expense.find({ userId }).populate({
    path: "userId",
    select: "name email", // No commas, only space
  });

  // 2. Apne simple utility helper ko data pass karo
  const formattedResult = formatCleanResponse(expenses);

  // 3. Response bhej do jahan user data top par hoga aur niche clean list
  return reply.code(200).send({
    success: true,
    user: formattedResult.user,
    expenses: formattedResult.data,
  });
};

export const getMonthlyExpenses = async (req, reply) => {
  const userId = req.user.id;
  const now = new Date();
  const monthInput = req.query.month !== undefined ? Number(req.query.month) : undefined;
  const month = monthInput !== undefined ? monthInput - 1 : now.getMonth();
  const year =
    req.query.year !== undefined ? Number(req.query.year) : now.getFullYear();

  if (Number.isNaN(month) || Number.isNaN(year) || month < 0 || month > 11) {
    return reply.code(400).send({ message: "Invalid month or year" });
  }

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const expenses = await Expense.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).sort({ date: -1 });

  reply.code(200).send({ success: true, month, year, expenses });
};

export const getExpenseById = async (req, reply) => {
  const { eid } = req.params;
  const expense = await Expense.findById(eid);

  if (!expense) {
    reply.code(400).send({ message: "Expense not found" });
  }

  reply.code(200).send({ expense });
};

export const addExpense = async (req, reply) => {
  const data = req.body;

  const expense = new Expense({
    ...data,
    userId: req.user.id,
  });
  await expense.save();

  reply.code(201).send({ message: "Expense added successfully" });
};

export const updateExpense = async (req, reply) => {
  const { eid } = req.params;
  const data = req.body;

  const expense = await Expense.findById(eid);
  if (!expense) return reply.code(404).send({ message: "Expense not found" });

  // Update fields
  Object.assign(expense, data);

  // This triggers the .pre("save") hook and checks the budget!
  await expense.save();

  reply.code(200).send({ message: "Expense updated and budget verified!" });
};

export const deleteExpense = async (req, reply) => {
  const { eid } = req.params;

  const expense = await Expense.findByIdAndDelete(eid);

  if (!expense) return reply.code(400).send({ message: "Expense not found" });

  reply.code(200).send({ message: "Expense deleted successfully" });
};

export const multiDeleteExpense = async (req, reply) => {
  // 1. Destructure the key out of the body object
  const { idsToDelete } = req.body;

  // 2. Validate that the property exists and is a valid array
  if (!idsToDelete || !Array.isArray(idsToDelete)) {
    return reply
      .code(400)
      .send({
        success: false,
        message: "Request body must contain an array under 'idsToDelete'",
      });
  }

  // 3. Deduplicate elements cleanly
  let uniqueIds = [...new Set(idsToDelete)];

  // 4. Filter and sanitize ObjectIDs to prevent database parsing errors
  uniqueIds = uniqueIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (uniqueIds.length === 0) {
    return reply
      .code(400)
      .send({ success: false, message: "No valid object IDs provided." });
  }

  // 5. Execute deletion block
  const result = await Expense.deleteMany({ _id: { $in: idsToDelete } });

  if (result.deletedCount === 0) {
    return reply.code(400).send({ message: "No matching expenses found" });
  }

  return reply
    .code(200)
    .send({ message: `${result.deletedCount} expenses deleted` });
};
