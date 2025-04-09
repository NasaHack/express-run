import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface ISendResponseOptions<T> {
  status: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null | undefined;
}

export interface IErrorSource {
  path: (string | number)[] | string;
  message: string;
}

export interface IPrettyError {
  success: boolean;
  status: number;
  message: string;
  sources?: IErrorSource[];
  stack?: any;
}

export interface JwtSessionConfig {
  refresh_token_expires_in_ms: number;
  access_token_expires_in_ms: number;
  access_token_secret: string;
  refresh_token_secret: string;
  access_token_key: string;
  refresh_token_key: string;
  at_prefix: string;
}

export interface SessionPayload extends JwtPayload {
  _id: Types.ObjectId;
}
