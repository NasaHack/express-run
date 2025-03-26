import mongoose, { MongooseError } from "mongoose";
import { DB } from "./env.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB.URI as string, {
      dbName: DB.NAME,
      pass: DB.PASS,
      user: DB.USER,
    });
    console.log("Databse Connected ✅");
    return true;
  } catch (error: unknown) {
    console.log(
      `Database Connection failed ❌\n`,
      error instanceof MongooseError ? error : error
    );
    return false;
  }
};
