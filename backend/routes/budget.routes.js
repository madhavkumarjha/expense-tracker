import { addBudget } from "../controllers/budget.controllers.js";

async function budgetRoutes(fastify) {
    fastify.post("/add/:uid",addBudget);    
}

export default budgetRoutes;