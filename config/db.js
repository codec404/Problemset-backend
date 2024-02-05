// MONGO DB Database

import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongo db")
  } catch (error) {
    console.log(error);
  }
};
