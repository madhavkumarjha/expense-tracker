import { Schema, model } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["monthly", "weekly"],
      default: "monthly",
    },
    alertFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },
  },
  { timestamps: true },
);

const Budget = model("Budget", budgetSchema);
export default Budget;
