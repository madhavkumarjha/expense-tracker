import { updateUser,deactivateAccount, getUser } from "../controllers/user.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";

async function userRoutes(fastify,options){
    fastify.addHook("preHandler", authentication);
    fastify.patch("/profile",getUser);
    fastify.patch("/update",updateUser);
    fastify.patch("/deactivate",deactivateAccount);
    // fastify.patch("/activate",activateAccount);
}

export default userRoutes;