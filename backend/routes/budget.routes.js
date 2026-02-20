import { addBudget,getBudget,updateBudget,deleteBudget } from "../controllers/budget.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

async function budgetRoutes(fastify) {
  fastify.addHook("preHandler", authentication);
  fastify.post("/add", addBudget);
  fastify.get("/get", getBudget);
  fastify.patch("/:eid", updateBudget);
  fastify.delete("/:eid", deleteBudget);
}

export default budgetRoutes;
