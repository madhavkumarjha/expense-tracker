import Expense from "../models/expense.model.js";
import mongoose from "mongoose"

export const getAllExpenses = async (req, reply) => {
  const userId = req.user.id;
  const expenses = await Expense.find({ userId }).populate("userId");

  if (!expenses) {
    reply.code(400).send({ message: "Expenses not found" });
  }
  reply.code(200).send({ success: true, expenses: expenses });
};

export const getMonthlyExpenses = async (req, reply) => {
  const userId = req.user.id;
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth();
  const year = parseInt(req.query.year) || now.getFullYear();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const expenses = await Expense.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  }).sort({ date: -1 });

  reply.code(200).send({ success: true, month, year, expenses });
};

export const getExpense = async (req, reply) => {
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
  const { id } = req.params;
  const data = req.body;

  const expense = await Expense.findById(id);
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
  let idsToDelete = req.body; // expecting direct array
  if (!Array.isArray(idsToDelete)) {
    return reply
      .code(400)
      .send({ message: "Request body must be an array of IDs" });
  } 
  // remove duplicates
  idsToDelete = [...new Set(idsToDelete)]; 

  idsToDelete = idsToDelete.filter((id) => mongoose.Types.ObjectId.isValid(id));

  const result = await Expense.deleteMany({ _id: { $in: idsToDelete } });
  if (result.deletedCount === 0) {
    return reply.code(400).send({ message: "No matching expenses found" });
  }
  return reply
    .code(200)
    .send({ message: `${result.deletedCount} expenses deleted` });
};
