export interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ResetPasswordOTP {
  email: string;
}

export interface ResetPassword {
  email: string;
  password: string;
  otp: string;
}

export interface AccountVerifyBody {
  otp: string;
}
