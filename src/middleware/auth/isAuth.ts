import { UserModel } from "@/models";
import { jwt_services } from "@/shared";
import { failed, TryCatch } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const isAuth = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = jwt_services.retriveSession(req, res);
    if (!userId) return res.status(401).json(failed(401, "Unauthorized!"));

    const user = await UserModel.findById(userId);
    if (!user) return res.status(401).json(failed(401, "Unauthorized!"));

    req.user = user;
    return next();
  }
);
