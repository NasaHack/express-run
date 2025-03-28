import { Router } from "express";
import bodyParser from "body-parser";
import generalRoutes from "./route_groups/general.routes";
import roleBasedRoutes from "./route_groups/role_based.routes";
import { atuhorized } from "@/middleware/auth/authorized";
import { isAuth } from "@/middleware";

/*.........XXX.............*/

const api_routes = Router();

api_routes.use(bodyParser.urlencoded({ extended: true }));
api_routes.use(bodyParser.json());

// General Routes
api_routes.use("/auth", generalRoutes.Auth);
api_routes.use("/user", isAuth, generalRoutes.User);

// Role Based
api_routes.use(
  "/admin",
  isAuth,
  atuhorized({ role: "admin", isVerified: false }),
  roleBasedRoutes.Admin
);

export default api_routes;
