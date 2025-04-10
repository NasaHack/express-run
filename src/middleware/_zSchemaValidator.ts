import { AppError } from "@/shared";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const isUrlEncodedOrMultipart = (req: Request) => {
  const contentType = req.headers["content-type"];

  return (
    contentType &&
    (contentType.startsWith("application/x-www-form-urlencoded") ||
      contentType.startsWith("multipart/form-data"))
  );
};

export const zSchemaValidator = (schema: AnyZodObject) => {
  return (req: Request, $: Response, next: NextFunction) => {
    if (isUrlEncodedOrMultipart(req)) {
      req.body = { body: { ...req.body } };
    }

    try {
      const parsedBody =
        schema.shape.body && schema.shape.body.safeParse
          ? schema.shape.body.safeParse(req.body.body)
          : { success: true };

      const parsedQuery =
        schema.shape.query && schema.shape.query.safeParse
          ? schema.shape.query.safeParse(req.query)
          : { success: true };

      const parsedParams =
        schema.shape.params && schema.shape.params.safeParse
          ? schema.shape.params.safeParse(req.params)
          : { success: true };

      if (
        !parsedBody.success ||
        !parsedQuery.success ||
        !parsedParams.success
      ) {
        const sources = [
          ...(parsedBody.success ? [] : parsedBody.error.issues),
          ...(parsedQuery.success ? [] : parsedQuery.error.issues),
          ...(parsedParams.success ? [] : parsedParams.error.issues),
        ];

        throw new AppError(400, "Zod Validation Error!", sources);
      }

      if (parsedBody.success) req.body = parsedBody.data;
      if (parsedQuery.success) req.query = parsedQuery.data;
      if (parsedParams.success) req.params = parsedParams.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
