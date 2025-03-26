import { CLOUDINARY_FOLDER } from "@/constants";
import { OtpModel, UserModel } from "@/models";

import { cloudinary, jwt_services, sendMail } from "@/shared";
import {
  AccountVerifyBody,
  IOtp,
  IUser,
  LoginBody,
  ResetPassword,
  ResetPasswordOTP,
  SignupBody,
} from "@/types";
import {
  failed,
  genOTP,
  imageAsURI,
  Password,
  success,
  TryCatch,
} from "@/utils";
import { Request, Response } from "express";
import { UpdateResult } from "mongoose";
/*................XXXX......................*/

export default class Auth {
  static signup = TryCatch(
    async (req: Request<{}, {}, SignupBody>, res: Response) => {
      const { name, email, password } = req.body;
      const avatar = req.file as Express.Multer.File;

      let user: IUser | null = await UserModel.findOne({ email });

      if (user)
        return res
          .status(400)
          .json(failed(400, "User already exist with this email"));

      const createUser = await UserModel.create({
        name,
        email,
        password: Password.hash(password),
        avatar: {
          secure_url: "",
          public_id: "",
        },
      });

      if (!createUser)
        return res.status(500).json(failed(500, "failed to signup"));

      if (avatar) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          imageAsURI(avatar).content as string,
          {
            folder: CLOUDINARY_FOLDER.avatar,
          }
        );

        createUser.avatar = { secure_url, public_id };
        await createUser.save();
      }

      if (!createUser)
        return res.status(500).json(failed(500, "failed to signup"));

      jwt_services.createSession(res, createUser._id);
      return res.status(200).json(success(200, "Signup successful!"));
    }
  );

  static login = TryCatch(
    async (req: Request<{}, {}, LoginBody>, res: Response) => {
      const { email, password } = req.body;

      let user: IUser | null = await UserModel.findOne({ email });

      if (!user)
        return res.status(400).json(failed(400, "Invalid Email or password"));

      if (!Password.isValid(password, user.password))
        return res.status(400).json(failed(400, "Invalid Email or password"));

      jwt_services.createSession(res, user._id);
      return res.status(200).json(success(200, "Login successful!"));
    }
  );

  static logout = TryCatch(async (req: Request, res: Response) => {
    jwt_services.destroySession(res);
    return res.status(200).json(success(200, "Logout successful!"));
  });

  static resetPasswordOTP = TryCatch(
    async (req: Request<{}, {}, ResetPasswordOTP>, res: Response) => {
      const { email } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json(failed(404, "User not exist"));

      const newOtp = genOTP(8);

      let otp: IOtp | null = await OtpModel.findOne({ user: user._id });

      if (otp) {
        otp.otp = newOtp;
        await otp.save();
      } else {
        otp = await OtpModel.create({ otp: newOtp, user: user._id });
      }

      const { accepted } = await sendMail(
        user.email,
        "Reset Passwrod code",
        `<h1>${newOtp}</h1/>`
      );

      if (!accepted?.includes(user.email))
        return res.status(500).json(failed(500, "failed to send OTP"));

      return res
        .status(200)
        .json(success(200, "Reset Password OTP has been Sended!"));
    }
  );

  static resetPasswrod = TryCatch(
    async (req: Request<{}, {}, ResetPassword>, res: Response) => {
      const { email, otp: OtpFromClient, password } = req.body;

      let user: IUser | null = await UserModel.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json(failed(400, "User not exist with this email"));

      let otp: IOtp | null = await OtpModel.findOne({ user: user._id });

      if (!otp)
        return res.status(400).json(failed(400, "OTP has been expired!"));

      if (otp.otp !== OtpFromClient)
        return res.status(400).json(failed(400, "OTP does not match!"));

      let updateUser = (await user.updateOne({
        $set: {
          password: Password.hash(password),
        },
      })) as UpdateResult;

      if (updateUser.modifiedCount === 0)
        return res.status(500).json(failed(500, "failed to reset password"));

      await otp.deleteOne();

      jwt_services.createSession(res, user._id);
      return res.status(200).json(success(200, "Password has been reset!"));
    }
  );

  static accountVerificationOTP = TryCatch(
    async (req: Request, res: Response) => {
      let otp: IOtp | null = await OtpModel.findOne({
        user: req.user?._id,
      });

      const newOtp = genOTP(8);
      if (!otp) {
        otp = await OtpModel.create({
          user: req.user?._id,
          otp: newOtp,
        });
      } else {
        await otp.updateOne({
          $set: { otp: newOtp },
        });

        otp = await OtpModel.findOne({
          user: req.user?._id,
        });
      }

      if (!otp)
        return res
          .status(500)
          .json(failed(500, "There was an serverside problem!"));

      const { accepted } = await sendMail(
        req.user?.email as string,
        "Account Verification OTP",
        `<h1>${otp.otp}</h1>`
      );

      if (!accepted?.includes(req.user?.email as string))
        return res.status(500).json(failed(500, "failed to send OTP"));

      return res
        .status(200)
        .json(success(200, "Account verification code has been sended!"));
    }
  );

  static verifyAccount = TryCatch(
    async (req: Request<{}, {}, AccountVerifyBody>, res: Response) => {
      const { otp: OTPfromClient } = req.body;

      if (req.user?.isVerified)
        return res.status(400).json(failed(400, "Account already verified!"));

      let opt = await OtpModel.findOne({ user: req.user?._id });

      if (!opt)
        return res.status(400).json(failed(400, "Otp has been expired!"));

      if (opt.otp !== OTPfromClient)
        return res.status(400).json(failed(400, "OTP does not match"));

      const user = await UserModel.findByIdAndUpdate(req.user?._id, {
        $set: {
          isVerified: true,
        },
      });

      if (!user)
        return res.status(500).json(failed(500, "failed to verify Account"));

      await opt.deleteOne();

      jwt_services.createSession(res, user._id);

      return res
        .status(200)
        .json(success(200, "account verification successful!"));
    }
  );
}
