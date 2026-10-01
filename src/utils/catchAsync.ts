import { NextFunction, Request, RequestHandler, Response } from "express";
import HttpStatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // res.status(HttpStatus.BAD_REQUEST).json({
      //   success: false,
      //   statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //   message:
      //     error instanceof Error ? error.message : "Something went wrong",
      //   error: (error as Error).message,
      // });
      next(error);
    }
  };
};
