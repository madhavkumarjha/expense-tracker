import Budget from "../models/budget.model.js";

export const getBudget = async (req, reply) => {
  const userId = req.user.id;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const budget = await Budget.findOne({
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
  const data = req.body;
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

const budget = await Budget.findOneAndUpdate(
      { userId, month, year },
      { limit, period, alertFrequency },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    );
  reply.code(201).send({ success: true, message: "Budget added successfully", budget });
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
