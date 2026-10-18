//the main middleware that performs the error message operation oassed to the response
//collects expected error: app error and unexpected error
import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { logger } from "../logger/logger";
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  //known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // Log unexpected/non-operational errors for debugging
  logger.error(err);

  //unknown errors
  return res
    .status(500)
    .json({ success: false, message: "internal server error" });
}
