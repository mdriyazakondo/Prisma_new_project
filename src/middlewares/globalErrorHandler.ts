import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: err.message,
    error: err.stack,
  });
};
