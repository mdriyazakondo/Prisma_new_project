import { Router } from "express";
import { subcriptionController } from "./subcription.controller";
import { auth } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subcriptionController.createCheckoutSession,
);
export const subcriptionRoute = router;
