import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth.middleware";
import { CommentController } from "./comment.controller";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  CommentController.createComment,
);

router.get("/author/:authorId", CommentController.getCommentByAuthorId);

router.get("/:commentId", CommentController.getCommentByCommentId);

router.patch(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  CommentController.updateComment,
);

router.delete(
  "/:commentId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  CommentController.deleteComment,
);

router.put(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  CommentController.moderateComment,
);

export const commentRoutes = router;
