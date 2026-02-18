// import agenda from "../agenda";

import Budget from "../models/budget.model.js";
import Expense from "../models/expense.model.js";
import sendMail from "../utils/mailer.js";

export default (agenda) => {
  agenda.define("budget alert!", async (job) => {
    const { userId } = job.attrs.data;
    const budget = await Budget.findOne({ userId });
    if (!budget) return;

    const now = new Date();
    const startDate =
      budget.period === "monthly"
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : new Date(now.setDate(now.getDate() - 7));

    const totalSpent = await Expense.aggregate([
      {$match: { userId, date: { $gte: startDate } }},
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = totalSpent[0]?.total||0;

    if(spent>= budget.limit){
        await sendMail(userId,"Budget Alert","You have exceeded your budget!");
    }else if(spent>=budget.limit*0.8){
        await sendMail(userId,"Budget Warning","You've spent 80% of your budget");
    }
  });
};
