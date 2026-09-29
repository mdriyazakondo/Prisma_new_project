import HttpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.userCreate(payload);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "User created successfully",
      data: { user },
    });
  },
);

const userFind = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.userAllFind();
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Users retrieved successfully",
      data: user,
    });
  },
);
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifyResult = await userService.getMyProfileDB(
      req.user?.id as string,
    );
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: verifyResult,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;

    const userProfile = await userService.updateMyProfileDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User Profile updated successfully",
      data: { userProfile },
    });
  },
);
export const userController = {
  createUser,
  userFind,
  getMyProfile,
  updateMyProfile,
};
