import { Request, Response, Router } from "express";
import bodyParser from "body-parser";

const web_hook_routes = Router();
web_hook_routes.use(bodyParser.raw({ type: "application/json" }));

// All Web Hook controllers from here

export default web_hook_routes;
