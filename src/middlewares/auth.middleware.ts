import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import HttpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRoles: Role[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authError = (message: string, statusCode: number) =>
      Object.assign(new Error(message), { statusCode });
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw authError(
        "You are not logged in. Please login to access this resource.",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifyToken.success) {
      throw authError(verifyToken.error, HttpStatus.UNAUTHORIZED);
    }

    const { name, email, role, id } = verifyToken.verifyToken as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw authError(
        "Forbidden. You don't have permission to access this resource",
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await prisma.user.findUnique({
      where: { id, name, email, role },
    });

    if (!user) {
      throw authError(
        "User not found. Please log in again",
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.activeStatus === "BLOCKED") {
      throw authError(
        "Your account has been blocked. Please contact support.",
        HttpStatus.FORBIDDEN,
      );
    }

    req.user = {
      id,
      name,
      email,
      role,
    };
    next();
  });
