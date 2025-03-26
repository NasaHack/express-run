import { randomInt } from "crypto";

export const genOTP = (length: number = 4) => {
  let otp: string = "";
  for (let i = 0; i < length; i++, otp += randomInt(10));
  return otp;
};
