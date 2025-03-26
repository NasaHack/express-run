import { NextFunction, Request, Response } from "express";
import { failed } from "./response";
import { MulterError } from "multer";
import { validationResult } from "express-validator";

export const TryCatch =
  (handler: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array()[0];
      if (errors) return res.status(400).json(failed(400, errors.msg));

      return await handler(req, res, next);
    } catch (error) {
      console.log(error);
      if (error instanceof MulterError) {
        return res.status(400).json(failed(400, error.message));
      }
      return res
        .status(500)
        .json(
          failed(
            500,
            error instanceof Error ? error.message : "Server Side Error"
          )
        );
    }
  };
