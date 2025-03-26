import { Request, Response, NextFunction } from "express";
import { IS_DEV } from "@/shared";
import { failed, success } from "@/utils";

export default class Common {
  static rootResponse = (req: Request, res: Response): void => {
    res
      .status(200)
      .json(
        success(200, "If you see status code 200 that means my health is good!")
      );
  };

  static notFound = (req: Request, res: Response): void => {
    res.status(404).json(failed(404, "Requested Data will not found!"));
  };

  static defaultError = (err: any, req: Request, res: Response): void => {
    IS_DEV ? console.log(err) : null;
    res
      .status(500)
      .json(failed(500, err && IS_DEV ? err.message : "Server Side Error"));
  };

  static serverDown = (req: Request, res: Response): void => {
    res.status(500).json(failed(500, "Server Has been Down"));
  };
}
