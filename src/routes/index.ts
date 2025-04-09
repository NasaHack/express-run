import { wh_routes, test_rotues } from "@/segments/barrel.routes";
import { Router } from "express";

const api_routes = Router();

const servicesGroup = [
  {
    path: "/test",
    routes: test_rotues,
  },
];

servicesGroup.forEach((route) => {
  return api_routes.use(route.path, route.routes);
});

export { api_routes, wh_routes };
