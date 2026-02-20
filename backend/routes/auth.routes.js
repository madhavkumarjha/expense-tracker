import { register,login } from "../controllers/auth.controllers.js";


async function authRoutes(fastify,options){

    fastify.post("/register",register);
    fastify.post("/login",login);
}

export default authRoutes;