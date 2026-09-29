import { Router } from "express";
import { userController } from "./user.controller";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth.middleware";

const router = Router();



router.post("/register", userController.createUser);
router.get("/users", userController.userFind);

router.get(
  "/me",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

export const userRouter = router;
