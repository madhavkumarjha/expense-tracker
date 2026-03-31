import mongoose from "mongoose";
import Budget from "./budget.model.js";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["food", "transport", "shopping", "utilities", "other"],
      default: "other",
      // required: true,
    },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

expenseSchema.pre("save", async function () {
  const expense = this;
  const expenseDate = new Date(expense.date);
  const month = expenseDate.getMonth();
  const year = expenseDate.getFullYear();

  const budget = await Budget.findOne({
    userId: expense.userId,
    month,
    year,
  });

  if (!budget) {
    // No budget defined → block expense creation
    throw new Error(
      `No budget set for ${expenseDate.toLocaleString("default", { month: "long" })} ${year}.`,
    );
  }

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const totalSpent = await mongoose
    .model("Expense")
    .aggregate([
      {
        $match: {
          userId: expense.userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          _id: { $ne: expense._id },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

  const spent = totalSpent[0]?.total || 0;

  if (spent + expense.amount > budget.limit) {
    throw new Error(`Expense exceeds your ${budget.limit} limit for this month. Current total: ${spent}`);
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
