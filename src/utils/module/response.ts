import { FailedResponse, SuccessResponse } from "@/types";

export const success: SuccessResponse = (status, message, data, meta) => ({
  status,
  success: true,
  message,
  meta,
  data,
});

export const failed: FailedResponse = (status, message, stack) => ({
  status,
  success: false,
  message,
  stack:
    stack instanceof Error
      ? stack
          .toString()
          .split("\n")
          .map((line) => line.replace(/[\s] /gi, ""))
      : stack
      ? [stack.toString()]
      : undefined,
});
