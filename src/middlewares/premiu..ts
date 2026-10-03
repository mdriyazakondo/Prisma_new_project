import { NextFunction, Request, Response } from "express";
import { SubcriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const premiumContent = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const subscription = await prisma.subcription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error(
        "Please subscrption again to get access to premium contents",
      );
    }

    if (subscription?.status !== SubcriptionStatus.ACTIVE) {
      throw new Error(
        "Please subscrption again to get access to premium contents",
      );
    }

    next();
  });
};
