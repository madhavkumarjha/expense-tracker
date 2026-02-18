import User from "../models/user.model.js";

export const updateUser = async (req, reply) => {
  try {
    const { uid } = req.params;
    const data = req.body;

    const user = await User.findByIdAndUpdate(uid, data, { new: true });
    if (!user) {
      return reply.code(400).send({ message: "User not found" });
    }

    reply.send({ message: "User updated successfully", user });
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

export const deactivateAccount =async(req,reply)=>{
    try {
        const {uid} = req.params;

        const user = await User.findById(uid);
        if(!user) return reply.code(400).send({message:"User not found"});

        user.isActive=false;
        user.deactivatedAt=new Date(Date.now());
        await user.save();

        reply.send({message:"Account deactivated successfully"});

    } catch (error) {
        reply.code(500).send({message:error.message})
    }
}


