import { register,login,getMe, refreshToken } from "../controllers/auth.controllers.js";
import { authentication } from "../middlewares/auth.middleware.js";


async function authRoutes(fastify,options){

    fastify.post("/register",register);
    fastify.post("/login",login);
    fastify.get("/me", { preValidation: [authentication] }, getMe);
    fastify.post("/refresh",refreshToken)
}

export default authRoutes;