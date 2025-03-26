import Controllers from "@/controllers";
import { Router, IRouter } from "express";

class role_based_rotues {
  protected router: IRouter;
  constructor() {
    this.router = Router();
  }

  get Admin() {
    this.router.get("/test", Controllers.Admin.test);
    return this.router;
  }
}

export default new role_based_rotues();
