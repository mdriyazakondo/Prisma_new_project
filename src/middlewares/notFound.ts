import { NextFunction, Request, Response } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    path: req.originalUrl,
    date: Date(),
  });
};
