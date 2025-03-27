export * from "./auth/isAuth";
export * from "./common/multer";
export * from "./common/underconstructon";
export * from "./common/securityGuards";

import Auth from "./validator/auth.validator";
export const validator = {
  Auth,
};
