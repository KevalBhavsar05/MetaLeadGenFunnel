import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected successfully");
      // console.log("Database Host:", mongoose.connection.host);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
