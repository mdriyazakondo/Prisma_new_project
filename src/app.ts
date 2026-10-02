import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFoundMiddleware } from "./middlewares/notFound";
import HttpStatus from "http-status";
import { subcriptionRoute } from "./modules/subcription/subcription.route";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world", success: true });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subcription", subcriptionRoute);

// app.use(globalErrorHandler);
app.use(notFoundMiddleware);

app.use(globalErrorHandler);

export default app;
