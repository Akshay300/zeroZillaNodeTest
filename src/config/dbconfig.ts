import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dbconnect() {
  const mongodbConnectionUrl = process.env.MONGODB_CONNECTION_URL;

  if (!mongodbConnectionUrl) {
    throw new Error("MongoDB connection URL is not defined.");
  }

  try {
    await mongoose.connect(mongodbConnectionUrl);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error while connecting mongodb------->>>>", error);

    throw error;
  }
}

export { dbconnect };
