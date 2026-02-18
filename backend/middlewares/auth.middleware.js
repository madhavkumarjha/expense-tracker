import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authentication = async (req, reply) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return reply.code(401).send({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // attach user info
  } catch (error) {
    return reply.code(403).send({ message: "Invalid or expired token" });
  }
};
