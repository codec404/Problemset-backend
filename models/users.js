import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Required Field"],
    },
    username: {
      type: String,
      required: [true, "Required Field"],
    },
    password: {
      type: String,
      required: [true, "Required Field"],
    },
    location: {
      type: String,
    },
    affiliation: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
    },
    adminPin: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
