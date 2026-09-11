import type{ Request, Response, NextFunction, RequestHandler } from 'express';

// this function is called basically in my controller to replace repeating try..catch everywhere
// Promise.resolve(value) is a function that takes any value and guarantees you get back a Promise, 
// no matter what you gave it.
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


