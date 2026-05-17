import { addExpense,updateExpense,deleteExpense, getExpenseById, getAllExpenses, multiDeleteExpense, getMonthlyExpenses } from "../controllers/expense.controllers.js"
import { authentication } from "../middlewares/auth.middleware.js";

const expenseRoutes = async (fastify) => {
  fastify.addHook("preHandler", authentication);
  fastify.post("/add",addExpense);
  fastify.get("/all",getAllExpenses);
  fastify.get("/",getMonthlyExpenses);
  fastify.get("/:eid",getExpenseById);
  fastify.patch("/:eid",updateExpense);
  fastify.delete("/:eid",deleteExpense);
  fastify.delete("/multi",multiDeleteExpense);

};

export default expenseRoutes;

