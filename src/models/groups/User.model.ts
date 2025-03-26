import { COLLECTIONS } from "@/constants";
import { IUser } from "@/types";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: { type: String, required: true },
  avatar: {
    secure_url: String,
    public_id: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

export const UserModel = model<IUser>(COLLECTIONS.USER, userSchema);
