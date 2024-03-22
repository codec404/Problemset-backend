import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    problemName: {
      type: String,
      required: [true, "Problem name is required!!!"],
    },
    problemStatement: {
      type: String,
      required: [true, "Problem Statement Required!!!"],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty Required!!!"],
    },
    constraints: {
      type: String,
      required: [true, "Constraints Required!!!"],
    },
    inputFormat: {
      type: String,
    },
    outputFormat: {
      type: String,
    },
    sampleTestCase: {
      type: String,
      required: [true, "Sample Test Case Requiured"],
    },
    problemTags: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
