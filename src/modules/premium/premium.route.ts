import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth.middleware";
import { Role, SubcriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { premiumContent } from "../../middlewares/premiu.";

const router = Router();
router.get(
  "/",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  premiumContent(),
  premiumController.premiumControllerDB,
);

export const premiumRoute = router;
