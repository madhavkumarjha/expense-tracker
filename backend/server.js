import Fastify from "fastify";
import connectDB from "./config/db.js";
import config from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import reactiveUsersJob from "./jobs/reactiveUsers.js";
import agenda from "./agenda.js";
import checkBudgetJob from "./jobs/checkBudget.js";
import Budget from "./models/budget.model.js";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.routes.js";

const fastify = Fastify({ logger: true });

// Connect to MongoDB
connectDB();

fastify.register(authRoutes, { prefix: "api/auth" });
fastify.register(userRoutes, { prefix: "api/users" });
fastify.register(expenseRoutes, { prefix: "api/expenses" });
fastify.register(budgetRoutes, { prefix: "api/budgets" });

// register jobs
reactiveUsersJob(agenda);
checkBudgetJob(agenda);


(async function () {
  await agenda.start();
  await agenda.every("1 day", "reactivate users");

  const budgets = await Budget.find({});
  for (const budget of budgets) {
    if (budget.alertFrequency === "daily") {
      await agenda.every("1 day", "budget alert", { userId: budget.userId });
    } else if (budget.alertFrequency === "weekly") {
      await agenda.every("1 week", "budget alert", { userId: budget.userId });
    } else if (budget.alertFrequency === "monthly") {
      await agenda.every("1 month", "budget alert", { userId: budget.userId });
    }
  }
  
})();

fastify.setErrorHandler((error, req, reply) => {
  // Log useful context
  fastify.log.error({
    method: req.method,
    url: req.url,
    userId: req.user?.id, // if authentication added user info
    message: error.message,
    stack: error.stack
  });

  // Send clean response
  reply.code(500).send({
    success: false,
    message: "Internal Server Error",
    details: error.message // optional, hide in production
  });
});




fastify
  .listen({ port: config.port })
  .then(() => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
