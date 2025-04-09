import { join } from "path";
import dotEnv from "dotenv";
import { Config } from "@/shared";

const appMode: "development" | "production" =
  process.env.NODE_ENV === "production" ? "production" : "development";

switch (appMode) {
  case "development":
    dotEnv.config({
      path: join(process.cwd(), ".env.dev"),
    });
    break;
  case "production":
    dotEnv.config({
      path: join(process.cwd(), ".env"),
    });
    break;
  default:
    throw Error(`Invalid mode '${appMode}' for app`);
}

export const config: Config = {
  appMode,
  port: parseInt(process.env.PORT as string) || 8080,
  white_list_origin: process.env.WHITE_LIST_ORIGIN as string,
  db: {
    uri: process.env.DB_URI as string,
    pass: process.env.DB_PASS as string,
    user: process.env.DB_USER as string,
    name: process.env.DB_NAME as string,
  },
  jwt: {
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    access_token_expires:
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRES) || 1000 * 60 * 5,
    refresh_token_expires:
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRES) || 1000 * 60 * 60 * 24 * 15,
  },
};
