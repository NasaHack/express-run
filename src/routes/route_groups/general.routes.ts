import { IRouter, Router } from "express";
import Controllers from "@/controllers";
import { validator, upload, isAuth } from "@/middleware";
/*.........XXX.............*/

class general_routes {
  protected router: IRouter;

  constructor() {
    this.router = Router();
  }

  get Auth() {
    this.router.post(
      "/signup",
      upload.single("avatar"),
      validator.Auth.signup,
      Controllers.Auth.signup
    );

    this.router.post("/login", validator.Auth.login, Controllers.Auth.login);

    this.router.delete("/logout", Controllers.Auth.logout);

    this.router.get(
      "/reset-password-otp",
      validator.Auth.resetPasswordOTP,
      Controllers.Auth.resetPasswordOTP
    );

    this.router.get(
      "/reset-password",
      validator.Auth.resetPassword,
      Controllers.Auth.resetPasswrod
    );

    this.router.get(
      "/account-verification-otp",
      isAuth,
      Controllers.Auth.accountVerificationOTP
    );

    this.router.post(
      "/account-verification",
      isAuth,
      validator.Auth.verifyAccount,
      Controllers.Auth.verifyAccount
    );

    return this.router;
  }

  get User() {
    this.router.get("/me", isAuth, Controllers.User.me);
    return this.router;
  }
}

export default new general_routes();
