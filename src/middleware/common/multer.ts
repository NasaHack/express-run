import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const type = ["image/png", "image/webp", "image/jpeg", "image/jpg"];

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const { mimetype } = file;
    if (!type.includes(mimetype)) {
      cb(new Error("Invalid Image Type"));
    } else {
      cb(null, true);
    }
  },
});
