import type{ AccountType } from "../generated/prisma/enums.js";
import AppError from "../errorHandlers/appError.js";
import type { AuthRequest } from "../types/express.js";
import type {Request,Response, NextFunction } from "express";

export const restrictTo = (...allowedRoles:AccountType[]) => {
  return (req: AuthRequest,res:Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("You are not logged in", 401));
      return;
    }
    if (!allowedRoles.includes(req.user.accountType as AccountType)) {
      next(
        new AppError("You do not have permission to perform this action", 403),
      );
      return;
    }
    next();
  };
};
