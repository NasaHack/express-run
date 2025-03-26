import { COLLECTIONS } from "@/constants";
import { IOtp } from "@/types";
import { Schema, model } from "mongoose";

const otpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USER,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  { timestamps: true }
);

export const OtpModel = model<IOtp>(COLLECTIONS.OTP, otpSchema);
