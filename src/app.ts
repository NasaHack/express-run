import { join } from "path";
import express, { static as static_ } from "express";
import cors from "cors";
import { corsOptions } from "./shared";
import Controllers from "./controllers";
import api_routes from "./routes/api.routes";
/*...................XXX............................*/

const app = express();

const readyToServe = () => {
  app.use(cors({ ...corsOptions, credentials: true }));
  app.use(static_(join(process.cwd(), "public")));
  app.set("json spaces", 2);
  app.get("/", Controllers.Common.rootResponse);
  app.use("/api", api_routes);

  app.use("*", Controllers.Common.notFound);
  app.use(Controllers.Common.defaultError);
};

export { app, readyToServe };
