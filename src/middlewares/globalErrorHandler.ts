import { ErrorRequestHandler } from "express";
import HttpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  console.error(err);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
    error: err,
  });
};
