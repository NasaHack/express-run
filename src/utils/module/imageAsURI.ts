import { extname } from "path";
import DataURIParser from "datauri/parser";

export const imageAsURI = (
  file: Express.Multer.File
): { content: string | undefined } => {
  const { originalname, buffer } = file;
  const ext = extname(originalname);

  const parser = new DataURIParser();
  const fileName = `${Math.random().toString().split(".")[1]}${ext}`;
  const { content } = parser.format(fileName, buffer);
  return { content };
};
