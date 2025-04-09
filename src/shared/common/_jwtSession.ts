import jsonWebToken from "jsonwebtoken";
import { CookieOptions, Request, Response } from "express";
import { JwtSessionConfig, SessionPayload, config, log } from "@/shared";

class JwtSession {
  private cookieOptions: CookieOptions;

  constructor(private config: JwtSessionConfig) {
    this.cookieOptions = {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    };
  }

  private _serve_access_token = (res: Response, payload: SessionPayload) => {
    const access_token = jsonWebToken.sign(
      payload,
      this.config.access_token_secret,
      { expiresIn: this.config.access_token_expires_in_ms / 1000 }
    );

    res.cookie(
      this.config.access_token_key,
      `${this.config.at_prefix} ${access_token}`,
      { maxAge: this.config.access_token_expires_in_ms, ...this.cookieOptions }
    );
  };

  private _serve_refresh_token = (res: Response, payload: SessionPayload) => {
    const refresh_token = jsonWebToken.sign(
      payload,
      this.config.refresh_token_secret,
      { expiresIn: this.config.refresh_token_expires_in_ms / 1000 }
    );

    res.cookie(this.config.refresh_token_key, `${refresh_token}`, {
      maxAge: this.config.refresh_token_expires_in_ms,
      ...this.cookieOptions,
    });
  };

  public create = (res: Response, payload: SessionPayload): void => {
    this._serve_access_token(res, payload);
    this._serve_refresh_token(res, payload);
  };

  public retrieve = (req: Request, res: Response): SessionPayload | null => {
    let payLoad: SessionPayload | null = null;

    try {
      const [access_token, refresh_token]: [string, string] = [
        req.cookies[this.config.access_token_key],
        req.cookies[this.config.refresh_token_key],
      ];

      if (!access_token && !refresh_token) return null;

      if (access_token && !access_token.startsWith(this.config.at_prefix))
        return null;

      if (access_token) {
        payLoad = jsonWebToken.verify(
          access_token?.split(`${this.config.at_prefix} `)[1],
          this.config.access_token_secret
        ) as SessionPayload;
      } else {
        payLoad = jsonWebToken.verify(
          refresh_token,
          this.config.refresh_token_secret
        ) as SessionPayload;

        this._serve_access_token(res, payLoad);
      }

      return payLoad;
    } catch (error) {
      payLoad = null;
      if (error instanceof Error) log.error(error.message);
    }

    return payLoad;
  };

  public destroy = (res: Response) => {
    res.clearCookie(this.config.access_token_key, this.cookieOptions);
    res.clearCookie(this.config.refresh_token_key, this.cookieOptions);
  };
}

export const session = new JwtSession({
  access_token_secret: config.jwt.access_token_secret,
  access_token_expires_in_ms: config.jwt.access_token_expires,
  access_token_key: "access_token",
  refresh_token_secret: config.jwt.refresh_token_secret,
  refresh_token_expires_in_ms: config.jwt.refresh_token_expires,
  refresh_token_key: "refresh_token",
  at_prefix: "Bearer",
});
