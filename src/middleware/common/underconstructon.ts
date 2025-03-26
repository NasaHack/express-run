import { failed } from "@/utils";
import { Response } from "express";

export const underConstruction = ({ ucMessage }: { ucMessage: string }) => {
  return (_: any, res: Response) =>
    res.status(503).json(failed(503, ucMessage));
};
