import Budget from "../models/budget.model.js";

export const getBudget = async (req, reply) => {
  const userId = req.user.id;

  const budget = await Budget.findOne({userId});
  // console.log(userId);

  if (!budget) return reply.code(400).send({ message: "Budget not found" });

  reply.code(200).send({ success: true, budget });
};

export const addBudget = async (req, reply) => {
  const data = req.body;

  const budgetExist = await Budget.findOne({
    userId: req.user.id,
  });

  if (budgetExist)
    return reply.code(400).send({ message: "Budget is already added" });

  const budget = new Budget({
    ...data,
    userId: req.user.id,
  });
  await budget.save();

  reply.code(201).send({ message: "Budget added successfully" });
};

export const updateBudget = async (req, reply) => {
  const { eid } = req.params;

  const data = req.body;

  const budget = await Budget.findByIdAndUpdate(eid, data, { new: true });

  if (!budget) {
    return reply.code(400).send({ message: "Budget not found" });
  }

  return reply.code(200).send({ message: "Budget updated successfully" });
};

export const deleteBudget = async (req, reply) => {
  const { eid } = req.params;

  const budget = await Budget.findByIdAndDelete(eid);

  if (!budget) {
    return reply.code(400).send({ message: "Budget not found" });
  }

  return reply.code(200).send({ message: "Budget deleted successfully" });
};
