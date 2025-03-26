import { IUser } from "./specific_to/collections.types";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}
