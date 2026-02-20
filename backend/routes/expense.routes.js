import { addExpense,updateExpense,deleteExpense, getExpense, getAllExpenses, multiDeleteExpense } from "../controllers/expense.controllers.js"
import { authentication } from "../middlewares/auth.middleware.js";

const expenseRoutes = async (fastify) => {
  fastify.addHook("preHandler", authentication);
  fastify.post("/add",addExpense);
  fastify.get("/:eid",getExpense);
  fastify.get("/all",getAllExpenses);
  fastify.patch("/:id",updateExpense);
  fastify.delete("/:eid",deleteExpense);
  fastify.delete("/multi",multiDeleteExpense);

};

export default expenseRoutes;

