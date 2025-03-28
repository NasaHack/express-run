import express, { Application } from "express";
import cors from "cors";
import xssClean from "xss-clean";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { SecurityGuardsConfig } from "@/types";
import { WHITE_LIST_ORIGIN } from "@/shared";
import { failed } from "@/utils";
import cookieParser from "cookie-parser";
/*.................XXX........................*/

// Configure the security settings as needed
const config: SecurityGuardsConfig = {
  cors: {
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allowed?: boolean) => void
    ) => {
      if (
        WHITE_LIST_ORIGIN.split(",").indexOf(origin ?? "") !== -1 ||
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
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "cdn.example.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
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
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    handler: (_, res) =>
      res
        .status(429)
        .json(failed(429, "Too many requests. Please try again later.")),
  },
  mongoSanitize: {
    replaceWith: "_",
    allowDots: false,
  },
};

export const securityGuards = ((
  expressModule: typeof express
): { app: Application; appForWebHook: Application } => {
  let secureApp = expressModule(),
    appForWebHook = expressModule();

  // Apply security middlewares for secureApp
  secureApp.use(cookieParser());
  secureApp.use(cors(config.cors));
  secureApp.use(xssClean());
  secureApp.use(helmet(config.helmet));
  secureApp.use(hpp(config.hpp));
  secureApp.use(rateLimit(config.rateLimit));
  secureApp.use(mongoSanitize(config.mongoSanitize));

  // Apply CORS middleware for web hook app
  appForWebHook.use(cors(config.cors));

  return { app: secureApp, appForWebHook };
})(express);
