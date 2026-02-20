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
  await user.save();

  const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ id: user._id }, config.refreshSecret, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await User.save();

  reply.code(200).send({
    accessToken,
    refreshToken,
  });

  reply.code(201).send({ message: "User registered successfully" });
};
