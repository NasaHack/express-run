import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";

class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) => `${timestamp} ${level} ${message}`
        )
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: "combined.log" }),
      ],
    });
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(`${message}`, ...args);
  }

  info(message: string, ...args: any[]) {
    this.logger.info(`${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(`${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(`${message}`, ...args);
  }
}

export const log = new Logger();
