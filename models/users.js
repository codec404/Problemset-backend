import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Required Field"],
    },
    email: {
      type: String,
      required: [true, "Required Field"],
    },
    phone: {
      type: String,
      required: [true, "Required Field"],
    },
    location: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Required Field"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
