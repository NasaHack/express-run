import { success, TryCatch } from "@/utils";
import { Request, Response } from "express";

export default class Admin {
  static test = TryCatch(async (req: Request, res: Response) => {
    return res.status(200).json(success(200, "I am only available for Admin"));
  });
}
