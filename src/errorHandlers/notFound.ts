import type { Request,Response,NextFunction } from "express";
import AppError from "./appError.js";

export const notFoundHandler = (req:Request, res:Response, next:NextFunction) :void => {
  const err = new AppError(`Can't find ${req.originalUrl}`, 404);
  next(err);
};