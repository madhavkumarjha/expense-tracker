import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";

export const addBudget = async (req, reply) => {
  try {
    const { uid } = req.params;
    const { limit, period, alertFrequency } = req.body;

    const user = await User.findById(uid);
    if (!user) return reply.code(400).send({ message: "User not found" });

    const budgetExist = await Budget.findOne({
      userId: uid,
    });

    if (budgetExist)
      return reply.code(400).send({ message: "Budget is already added" });

    const budget = new Budget({
      limit,
      period,
      alertFrequency,
      userId: uid,
    });
    await budget.save();

    reply.code(201).send({ message: "Budget added successfully" });
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};
