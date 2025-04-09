export class AppError extends Error {
  public status: number;
  constructor(status: number, message: string, stack: any = "") {
    super(message);

    this.status = status;
    this.name = "AppError";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
