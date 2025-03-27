import { IUser } from "@/types";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}

export type SuccessResponse = (
  status: number,
  message: string,
  data?: unknown,
  meta?: Record<string, unknown>
) => {
  status: number;
  success: boolean;
  message: string;
  data?: any;
  meta?: any;
};

export type FailedResponse = (
  status: number,
  message: string,
  stack?: unknown
) => {
  status: number;
  success: boolean;
  message: string;
  stack?: unknown;
};
