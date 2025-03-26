import { INPUT_FIELDS } from "@/constants";
import { check } from "express-validator";

export default class Base {
  protected email = check(INPUT_FIELDS.email)
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Must be a valid email address");
  protected password = check(INPUT_FIELDS.password)
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long");
  protected name = check(INPUT_FIELDS.name)
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .not()
    .matches(/\d/)
    .withMessage("Name can not contain numeric values");
  protected opt = (length: number) => {
    return check(INPUT_FIELDS.otp)
      .trim()
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: length, max: length })
      .withMessage(`OTP lenght must be ${length}`);
  };
}
