// import Budget from "../models/budget.model.js";
import Expense from "../models/expense.model.js";
// import User from "../models/user.model.js";

export const addExpense = async (req,reply)=>{
    try {
        const data = req.body;

        const expense = new Expense({
            ...data,
            userId:req.user.id
        });
        await expense.save();

        reply.code(201).send({message:"Expense added successfully"});
    } catch (error) {
        reply.code(500).send({ message: error.message });
    }
}

export const updateExpense = async (req,reply)=>{
    try {
        const {eid} = req.params;
        const data = req.body;

        const expense = await Expense.findById(eid);
        if(!expense) return reply.code(400).send({message:"Expense not found"});

        expense.updateOne(data);
        await expense.save();

        reply.code(200).send({message:"Expense updated successfully"});
    } catch (error) {
        reply.code(500).send({message:error.message});
    }
}