import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = HttpStatus.BAD_REQUEST;
    errorMessage =
      err.message ||
      "You have provided incorrect field type or missing required field";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = HttpStatus.BAD_REQUEST;
      errorMessage = "Duplicate key Error";
    } else if (err.code === "F2003") {
      statusCode = HttpStatus.NOT_FOUND;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = HttpStatus.NOT_FOUND;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = HttpStatus.UNAUTHORIZED;
      errorMessage =
        "Authentication failed. Please check your database credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorMessage =
        "Database server is not available. Please check your database server.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "An unknown error occurred while processing the request.";
  }

  res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    name: errName,
    message: errorMessage,
    error: err.stack,
  });
};
