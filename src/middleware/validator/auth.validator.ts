import Base from "./base.validator";

class AuthValidator extends Base {
  signup = [this.name, this.email, this.password];
  login = [this.email, this.password];
  resetPasswordOTP = [this.email];
  resetPassword = [this.email, this.password, this.opt(8)];
  verifyAccount = [this.opt(8)];
}

export default new AuthValidator();
