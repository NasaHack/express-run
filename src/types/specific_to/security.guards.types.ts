import { HelmetOptions } from "helmet";
import { Options as HppOptions } from "hpp";
import { Options as RateLimitOPtions } from "express-rate-limit";
import { CorsOptions } from "cors";

export interface SecurityGuardsConfig {
  cors: CorsOptions;
  helmet: HelmetOptions;
  hpp: HppOptions;
  rateLimit: Partial<RateLimitOPtions>;
}
