import { IRouter, Router } from "express";
import bodyParser from "body-parser";

export const webHookWall = (router: IRouter): IRouter =>
  Router()
    .use(bodyParser.raw({ type: "application/json" }))
    .use(router);
