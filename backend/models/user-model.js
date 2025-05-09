import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["admin", "creator", "moderator"],
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({
  role: -1,
});

const User = mongoose.model("User", userSchema);
export default User;
