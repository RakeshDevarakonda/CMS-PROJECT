import mongoose from "mongoose";

export const mongoosedatabse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    console.error(error);
  }
};
