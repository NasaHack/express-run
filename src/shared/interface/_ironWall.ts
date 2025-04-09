import { HelmetOptions } from "helmet";
import { Options as HppOptions } from "hpp";
import { Options as RateLimitOPtions } from "express-rate-limit";
import { CorsOptions } from "cors";
import { Options as MongoSanitize } from "express-mongo-sanitize";

export interface IIronWallConfig {
  cors?: CorsOptions;
  helmet?: HelmetOptions;
  hpp?: HppOptions;
  rateLimit?: Partial<RateLimitOPtions>;
  mongoSanitize?: MongoSanitize;
}
