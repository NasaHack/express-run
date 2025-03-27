import { Application } from "express";
import cors from "cors";
import xssClean from "xss-clean";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { SecurityGuardsConfig } from "@/types";
import { WHITE_LIST_ORIGIN } from "@/shared";
/*.................XXX........................*/

const config: SecurityGuardsConfig = {
  cors: {
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allowed?: boolean) => void
    ) => {
      if (WHITE_LIST_ORIGIN.indexOf(origin ?? "") !== -1 || !origin) {
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
    handler: (_, res) => {
      res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    },
  },
};

export const securityGuards = (app: Application): Application => {
  app.use(cors(config.cors));
  app.use(xssClean());
  app.use(helmet(config.helmet));
  app.use(hpp(config.hpp));
  app.use(rateLimit(config.rateLimit));
  return app;
};
