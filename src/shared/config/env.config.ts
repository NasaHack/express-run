import { join } from "path";
import dotenv from "dotenv";

export const APP_MODE = process.env.NODE_ENV as "development" | "production";

switch (APP_MODE) {
  case "production":
    dotenv.config({
      path: join(process.cwd(), ".env"),
    });
    break;
  case "development":
    dotenv.config({
      path: join(process.cwd(), ".env.dev"),
    });
    break;
  default:
    throw Error(
      "APP_MODE is missing or Invalid APP_MODE provided in run scripts"
    );
}

// All Secrets
export const IS_DEV = APP_MODE === "development";

export const PORT = process.env.PORT as string;

export const WHITE_LIST_ORIGIN = process.env.WHITE_LIST_ORIGIN as string;

export const DB: Readonly<{
  NAME: string;
  URI: string;
  USER: string;
  PASS: string;
}> = {
  NAME: process.env.DB_NAME as string,
  URI: process.env.DB_URI as string,
  USER: process.env.DB_USER as string,
  PASS: process.env.DB_PASS as string,
};

export const JWT_SECRET: Readonly<{
  ACCESS_KEY: string;
  REFRESH_KEY: string;
}> = {
  ACCESS_KEY: process.env.JWT_ACCESS_KEY as string,
  REFRESH_KEY: process.env.JWT_REFRESH_KEY as string,
};

export const CLOUDINARY: Readonly<{
  CLOUDNAME: string;
  API_KEY: string;
  API_SECRET: string;
}> = {
  CLOUDNAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  API_KEY: process.env.CLOUDINARY_API_KEY as string,
  API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};

export const LSA: Readonly<{
  USER: string;
  PASS: string;
}> = {
  USER: process.env.LES_SECURE_APP_USER as string,
  PASS: process.env.LES_SECURE_APP_PASS as string,
};
