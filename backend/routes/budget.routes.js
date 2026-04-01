import { saveBudget,getBudget,getBudgets,updateBudget,deleteBudget } from "../controllers/budget.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

async function budgetRoutes(fastify) {
  fastify.addHook("preHandler", authentication);
  fastify.get("/all", getBudgets);
  fastify.post("/", saveBudget);
  fastify.get("/get", getBudget);
  fastify.patch("/:eid", updateBudget);
  fastify.delete("/:eid", deleteBudget);
}

export default budgetRoutes;
