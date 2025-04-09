import { join } from "path";
import express, { Application, static as static_ } from "express";
import { defaultError, notFound, rootResponse } from "@/segments/common";
import { ironWall, webHookWall } from "@/shared";
import { api_routes, wh_routes } from "@/routes";

const app: Application = express();

const appBootstrap = () => {
  app.set("json spaces", 2);
  app.use(static_(join(process.cwd(), "public")));
  app.get("/", rootResponse);
  app.use("/api", ironWall(api_routes));
  app.use("/web-hook", webHookWall(wh_routes));
  app.use(notFound);
  app.use(defaultError);
};

export { appBootstrap, app };
