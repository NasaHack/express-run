import { Collections, Role } from "@/types";

export const COLLECTIONS: Readonly<{
  USER: Collections;
  OTP: Collections;
}> = {
  USER: "User",
  OTP: "Otp",
};

export const ROLE: Readonly<{
  USER: Role;
  ADMIN: Role;
}> = {
  USER: "user",
  ADMIN: "admin",
};

export const CLOUDINARY_FOLDER: Readonly<{
  root: string;
  avatar: string;
}> = {
  root: "ex-starter",
  get avatar() {
    return `${this.root}/avatar`;
  },
};

export const INPUT_FIELDS: Readonly<{
  name: string;
  email: string;
  password: string;
  avatar: string;
  otp: string;
}> = {
  name: "name",
  email: "email",
  password: "password",
  avatar: "avatar",
  otp: "otp",
};
