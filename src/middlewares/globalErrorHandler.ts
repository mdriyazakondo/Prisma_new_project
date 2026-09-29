import { ErrorRequestHandler } from "express";
import HttpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  console.error(err);

  const statusCode = err.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong",
    error: err,
  });
};
