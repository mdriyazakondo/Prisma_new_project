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

export const subcriptionController = {
  createCheckoutSession,
};
