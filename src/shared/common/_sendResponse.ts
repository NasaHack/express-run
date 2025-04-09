import { ISendResponseOptions } from "@/shared";
import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  { status, success, message, meta, data }: ISendResponseOptions<T>
): Response => {
  return res.status(status).json({
    status,
    success,
    message,
    meta,
    data,
  });
};
