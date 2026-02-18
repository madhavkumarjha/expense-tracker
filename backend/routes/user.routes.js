import { updateUser,deactivateAccount } from "../controllers/user.controllers.js";

async function userRoutes(fastify,options){
    fastify.patch("/:uid",updateUser);
    fastify.patch("/:uid/deactivate",deactivateAccount);
}

export default userRoutes;