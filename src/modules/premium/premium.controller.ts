import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { premiumService } from "./premium.service";

const premiumControllerDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await premiumService.getPremiumContent();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Premum content retrived successfully",
      data: result,
    });
  },
);

export const premiumController = { premiumControllerDB };
