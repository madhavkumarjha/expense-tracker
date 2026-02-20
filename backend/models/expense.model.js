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

  const budget = await Budget.findOne({
    userId: expense.userId,
  });

  if (!budget) {
    // No budget defined → block expense creation
    throw new Error(
      "Budget not set. Please create a budget before adding expenses.",
    );
  }

  const now = new Date();
  const startDate =
    budget.period === "monthly"
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.setDate(now.getDate() - 7));

  const totalSpent = await mongoose
    .model("Expense")
    .aggregate([
      { $match: { userId: expense.userId, date: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

  const spent = totalSpent[0]?.total || 0;

  if (spent + expense.amount > budget.limit) {
    throw new Error("Expense exceeds budget limit");
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
