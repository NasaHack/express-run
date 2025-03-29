import { JWT_SECRET } from "@/shared";
import { userId } from "@/types";
import { Request, Response, CookieOptions } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtConfig {
  refresh_token_expires: number;
  access_token_expires: number;
  refresh_token_key: string;
  access_token_key: string;
  at_prefix: string;
}

class JWTServices {
  private cookieOptions: CookieOptions;
  private refresh_token_jwt_expres?: number;
  private access_token_jwt_expres?: number;

  constructor(private config: JwtConfig) {
    this.cookieOptions = {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    };
    this.refresh_token_jwt_expres = this.config.refresh_token_expires;
    this.access_token_jwt_expres = this.config.access_token_expires;
  }

  private _send_access_token = (res: Response, userId: userId) => {
    const token = `${this.config.at_prefix} ${jwt.sign(
      { userId },
      JWT_SECRET.ACCESS_KEY,
      {
        expiresIn: this.access_token_jwt_expres,
      }
    )}`;

    res.cookie(this.config.access_token_key, token, {
      ...this.cookieOptions,
      maxAge: this.config.access_token_expires,
    });
  };

  private _send_refresh_token = (res: Response, userId: userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET.REFRESH_KEY, {
      expiresIn: this.refresh_token_jwt_expres,
    });

    res.cookie(this.config.refresh_token_key, token, {
      ...this.cookieOptions,
      maxAge: this.config.refresh_token_expires,
    });
  };

  // Serve Session Methods
  public createSession = (res: Response, userId: userId) => {
    this._send_access_token(res, userId);
    this._send_refresh_token(res, userId);
  };

  public retriveSession = (
    req: Request,
    res: Response
  ): { userId: userId | null } => {
    let access_token: string | undefined =
      req.cookies[this.config.access_token_key];
    let refresh_token: string | undefined =
      req.cookies[this.config.refresh_token_key];

    let userId: userId | null;

    try {
      if (access_token) {
        const at_parts = access_token.split(" ");

        if (at_parts.length === 2 && at_parts[0] === this.config.at_prefix) {
          access_token = at_parts[1];
        } else {
          access_token = "";
        }

        userId = (
          jwt.verify(access_token, JWT_SECRET.ACCESS_KEY) as JwtPayload & {
            userId: userId;
          }
        ).userId;
      } else if (refresh_token) {
        userId = (
          jwt.verify(refresh_token, JWT_SECRET.REFRESH_KEY) as JwtPayload & {
            userId: userId;
          }
        ).userId;

        this._send_access_token(res, userId);
      } else {
        userId = null;
      }
    } catch (error) {
      console.log(error instanceof Error && `jwt_services:\n ${error.message}`);
      userId = null;
    }

    return { userId };
  };

  public destroySession = (res: Response) => {
    res.cookie(this.config.access_token_key, "", {
      ...this.cookieOptions,
      maxAge: 0,
    });

    res.cookie(this.config.refresh_token_key, "", {
      ...this.cookieOptions,
      maxAge: 0,
    });
  };
}

/*.......*/
const jwt_services = new JWTServices({
  access_token_expires: 1000 * 60 * 5,
  refresh_token_expires: 1000 * 60 * 60 * 24 * 15,
  access_token_key: "access_token",
  refresh_token_key: "refresh_token",
  at_prefix: "Bearer",
});

export { jwt_services, JWTServices };
