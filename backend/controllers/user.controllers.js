import User from "../models/user.model.js";

export const getUser = async (req, reply) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  if (!user) return reply.code(400).send({ message: "User not found" });
  reply.code(200).send({ success: true, user });
};

export const updateUser = async (req, reply) => {
  const user = await User.findById(req.user.id);
  await user.updateIfActive(req.body);

  reply.code(200).send({ message: "User updated successfully", user });
};

export const deactivateAccount = async (req, reply) => {
  const uid = req.user.id;

  const user = await User.findById(uid);
  if (!user) return reply.code(400).send({ message: "User not found" });

  if (!user.isActive) {
    return reply.code(400).send({ message: "Account already deactivated" });
  }

  user.isActive = false;
  user.deactivatedAt = new Date(Date.now());
  await user.save();

  reply.send({ message: "Account deactivated successfully" });
};

// export const activateAccount = async (req, reply) => {
//   const uid = req.user.id;

//   const user = await User.findById(uid);
//   if (!user) return reply.code(400).send({ message: "User not found" });

//   user.isActive = true;
//   user.deactivatedAt = null;
//   await user.save();

//   reply.send({ message: "Account activated successfully" });
// };
