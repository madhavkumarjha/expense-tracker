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
    console.log("Middleware Attached User:", req.user);
  } catch (error) {
    return reply.code(403).send({ message: "Invalid or expired token" });
  }
};

/**
 * Fastify Rule: Middleware hamesha Auth Token decode hone ke BAAD execute hona chahiye,
 * jisse 'req.user' object runtime par available rahe.
 */

// 1. ADMIN ONLY GUARD
export const isAdmin = async (req, reply) => {
  if (!req.user) {
    return reply.code(401).send({ success: false, message: "Unauthorized: Token identification metadata missing." });
  }

  // Schema verification value verification hook
  if (req.user.role !== "admin") {
    return reply.code(403).send({ 
      success: false, 
      message: "Access Denied: Admin privileges required to access this resource." 
    });
  }
};

// 2. STANDARD USER ONLY GUARD
export const isUser = async (req, reply) => {
  if (!req.user) {
    return reply.code(401).send({ success: false, message: "Unauthorized: Token identification metadata missing." });
  }

  if (req.user.role !== "user") {
    return reply.code(403).send({ 
      success: false, 
      message: "Access Denied: Standard user account required for this transaction." 
    });
  }
};

