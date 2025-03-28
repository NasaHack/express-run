import { join } from "path";
import { static as static_ } from "express";
import Controllers from "@/controllers";
import api_routes from "@/routes/api.routes";
import { securityGuards } from "@/middleware";
import web_hook_routes from "./routes/web-hook.routes";
/*...............XXX.........................*/

const { app, appForWebHook } = securityGuards;

const readyToServe = () => {
  app.set("json spaces", 2);
  app.get("/", Controllers.Common.rootResponse);
  app.use(static_(join(process.cwd(), "public")));
  app.use("/web-hook", appForWebHook.use(web_hook_routes));
  app.use("/api", api_routes);
  app.use("*", Controllers.Common.notFound);
  app.use(Controllers.Common.defaultError);
};

export { app, readyToServe };
