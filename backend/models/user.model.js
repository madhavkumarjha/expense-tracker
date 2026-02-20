import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Email format wrong"],
    },
    password: {
      type: String,
      minlength: [5, "Password minimum 5 characters"],
      validate: {
        validator: function (v) {
          return /[A-Z]/.test(v); // must contain at least one uppercase letter
        },
        message: "Password must contain at least one uppercase letter",
      },
    },
    isActive: { type: Boolean, default: true },
    deactivatedAt:{type:Date},
    avatar: {
      type: String,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateIfActive = async function (data) {
  if (!this.isActive) throw new Error("Account inactive");
  Object.assign(this, data);
  return this.save();
};


userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const User = mongoose.model("User", userSchema);

export default User;
