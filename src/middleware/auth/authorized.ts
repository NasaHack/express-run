import { failed, TryCatch } from "@/utils";
import { Role } from "@/types";
import { NextFunction, Request, Response } from "express";
import { ROLE } from "@/constants";

const validateAuthorized = ({
  flyPath,
  role,
}: {
  role: Role;
  flyPath?: string;
}) => {
  if (Array.isArray(role) && flyPath)
    throw Error(`To use flyPath consider chaining authorized middleware`);

  if (Array.isArray(role)) {
    role.forEach((r) => {
      if (!Object.values(ROLE).includes(r)) throw Error(`Invalid role: ${r}`);
    });
  }
};

export const atuhorized = ({
  role,
  flyPath,
  isVerified,
}: {
  role: Role;
  flyPath?: string;
  isVerified: boolean;
}) => {
  return TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    validateAuthorized({ flyPath, role });

    if (!req.user) return res.status(401).json(failed(401, "Unauthorized!"));

    if (isVerified && !req.user.isVerified)
      return res
        .status(400)
        .json(failed(400, "Please verify your account first"));

    if (flyPath && req.path === flyPath) return next();

    if (
      (Array.isArray(role) && !role.every((role) => req.user?.role === role)) ||
      role !== req.user?.role
    )
      return res
        .status(403)
        .json(failed(403, "You are not allowed to access this API"));

    return next();
  });
};
