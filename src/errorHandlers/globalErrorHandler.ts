import AppError from "./appError.js";
import type {Request,Response,NextFunction} from "express"
import { logger } from "../utils/logger.js";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong!";

  // Only log unexpected errors here
  if (!err.isOperational) {
    logger.error(`${err.message}\n${err.stack}`);
  }

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
    return;
  }

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};