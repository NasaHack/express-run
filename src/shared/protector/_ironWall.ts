import mongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import { IRouter, Router } from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { IIronWallConfig, sendResponse, config as RootConfig } from "@/shared";

const config: IIronWallConfig = {
  cors: {
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allowed?: boolean) => void
    ) => {
      if (
        RootConfig.white_list_origin.split(",").indexOf(origin ?? "") !== -1 ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        // Change the sources aoccording to your reqiremnt
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.example.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://cdn.example.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: "deny" },
    xssFilter: true,
    hidePoweredBy: true,
    referrerPolicy: { policy: "strict-origin" },
  },
  hpp: {
    checkQuery: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    handler: (_, res) =>
      sendResponse(res, {
        success: false,
        status: 429,
        message: "Too many requests. Please try again later",
      }),
  },
  mongoSanitize: {
    replaceWith: "_",
    allowDots: false,
  },
};

export const ironWall = (router: IRouter): IRouter =>
  Router()
    .use(cors(config.cors))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(rateLimit(config.rateLimit))
    .use(helmet(config.helmet))
    .use(hpp(config.hpp))
    .use(mongoSanitize(config.mongoSanitize))
    .use(router);
