import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { subcriptionService } from "./subcription.service";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const session = await subcriptionService.createCheckoutSession(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Checkout completed successfully",
    data: session,
  });
});
const stripeWebhookHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let event = req.body as Buffer;
    let signature = req.headers["stripe-signature"] as string;

    console.log("signature", signature);

    await subcriptionService.stripeWebhookHandler(event, signature);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook handled successfully",
    });
  },
);

const subscripitonStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await subcriptionService.getSubscription(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Subscription status retrived successfully",
      data: result,
    });
  },
);

export const subcriptionController = {
  createCheckoutSession,
  stripeWebhookHandler,
  subscripitonStatus,
};
