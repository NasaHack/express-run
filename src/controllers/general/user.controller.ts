import { UserModel } from "@/models";
import { IUser } from "@/types";
import { success, TryCatch } from "@/utils";
import { Request, Response } from "express";

export default class User {
  static me = TryCatch(async (req: Request, res: Response) => {
    const user = (await UserModel.findById(req.user?._id).select(
      "-password"
    )) as IUser;

    return res.status(200).json(success(200, "User Data", { user }));
  });
}
