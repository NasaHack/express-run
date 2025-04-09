import { Router } from "express";
import { WebHook } from "./wh.controller";

export const wh_routes = Router();

// Serve All Web Hook from here
wh_routes.get("/test-wh", WebHook.someExternelServices);
