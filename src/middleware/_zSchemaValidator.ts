import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const zSchemaValidator = (schema: AnyZodObject) => {
  return (req: Request, $: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
