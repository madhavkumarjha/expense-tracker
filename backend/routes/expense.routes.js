import { addExpense } from "../controllers/expense.controllers.js"
import { authentication } from "../middlewares/auth.middleware.js";

const expenseRoutes = async (fastify) => {
  fastify.post("/add", {
    preHandler: authentication,   // middleware
    handler: addExpense           // controller
  });
};

export default expenseRoutes;

