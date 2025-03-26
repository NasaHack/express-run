import e from "express";
import { Document, ObjectId } from "mongoose";

export type Collections = "User" | "Otp";
export type userId = ObjectId | string | null;
export type Role = "user" | "admin";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: {
    secure_url: string;
    public_id: string;
  };
  isVerified: boolean;
  role: Role;
}

export interface IOtp extends Document {
  user: ObjectId;
  otp: string;
  createdAt: Date;
}
