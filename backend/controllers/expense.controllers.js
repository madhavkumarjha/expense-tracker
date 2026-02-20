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

  const expense = await Expense.findByIdAndUpdate(id, data, { new: true });

  if (!expense) return reply.code(400).send({ message: "Expense not found" });

  reply.code(200).send({ message: "Expense updated successfully" });
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
