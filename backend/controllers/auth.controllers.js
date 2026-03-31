import User from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

// login controller
export const login = async (req, reply) => {
  const { email, password } = req.body;

  // ✅ static method
  const user = await User.findByEmail(email);
  if (!user) return reply.code(400).send({ message: "User not found" });

  if (!user.isActive) {
    return reply
      .code(400)
      .send({ message: "Your account is blocked/deactivated" });
  }

  // ✅ instance method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return reply.code(400).send({ message: "Invalid password" });

  const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ id: user._id }, config.refreshSecret, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await user.save();

  reply.code(200).send({ accessToken, refreshToken });
};

export const getMe = async (req, reply) => {
  if (!req.user || !req.user.id) {
    return reply.code(401).send({
      message: req.user ? "Invalid token payload" : "Authentication required",
    });
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return reply.code(404).send({ message: "User not found in database" });
  }

  return reply.code(200).send(user);
};

export const register = async (req, reply) => {
  const { name, email, password } = req.body;

  // check user exist or not
  const existingUser = await User.findByEmail(email);
  if (existingUser)
    return reply.code(400).send({
      message: "User already registered",
    });

  // create new user
  const user = new User({
    name,
    email,
    password,
  });

  const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ id: user._id }, config.refreshSecret, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await User.save();

  reply.code(200).send({
    message: "User registered successfully",
    accessToken,
    refreshToken,
  });

  reply.code(201).send({ message: "User registered successfully" });
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.code(400).send({ message: "Refresh token is required" });
  }

  const decoded = jwt.verify(refreshToken, config.refreshSecret);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return reply.code(403).send({ message: "Invalid refresh token" });
  }

  const newAccessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "30m",
  });

  reply.code(200).send({ accessToken: newAccessToken });
};
