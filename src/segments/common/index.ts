import { AppError, config, IPrettyError } from "@/shared";
import { sendResponse } from "@/shared";
import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";

export const rootResponse: RequestHandler = (req, res) => {
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Server running",
  });
};

export const serverDownResponse: RequestHandler = (req, res) => {
  sendResponse(res, {
    status: 503,
    success: false,
    message: "The server is currently down, please try again later.",
  });
};

export const notFound: RequestHandler = (req, res) => {
  sendResponse(res, {
    status: 404,
    success: false,
    message: "Requested data was not found!",
  });
};

export const defaultError: ErrorRequestHandler = (err, req, res, next) => {
  const defaultValues: IPrettyError = {
    success: false,
    status: 500,
    message: "There was a server-side Error",
    sources: undefined,
    stack: undefined,
  };

  let { status, message, success, stack, sources } = defaultValues;

  if (err instanceof ZodError) {
    sources = err.issues.map(({ message, path }: ZodIssue) => ({
      message,
      path: path.join("."),
    }));
    status = 400;
    message = "Zod Validation Error!";
    stack = err.stack;
  }

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
    stack = err.stack;
  }

  console.log(err);

  if (stack && typeof stack === "string")
    stack = config.appMode === "development" ? stack?.split("\n  ") : undefined;

  res
    .status(status)
    .json({ success, status, message, sources, stack } as IPrettyError);
};
