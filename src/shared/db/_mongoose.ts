import { config, log } from "@/shared";
import mongoose, { MongooseError } from "mongoose";

export const connectMongoDB = async () => {
  const { uri, name, pass, user } = config.db;
  try {
    await mongoose.connect(uri, {
      dbName: name,
      pass,
      user,
    });
    log.info("Databse Connected");
    return true;
  } catch (error: unknown) {
    log.error(
      `Database Connection failed\n ${
        error instanceof MongooseError ? error : error
      }`
    );
    return false;
  }
};
