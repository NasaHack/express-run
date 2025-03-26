import { v2 } from "cloudinary";
import { CLOUDINARY } from "./env.config";

v2.config({
  cloud_name: CLOUDINARY.CLOUDNAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const cloudinary = v2;
