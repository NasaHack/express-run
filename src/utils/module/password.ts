import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export class Password {
  static hash = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };
  static isValid = (password: string, encriptedPasswrod: string) => {
    return bcrypt.compareSync(password, encriptedPasswrod);
  };
  static random = () => {
    const randomPasswrod = randomBytes(10).toString("base64");
    return bcrypt.hash(randomPasswrod, bcrypt.genSaltSync(10));
  };
}
