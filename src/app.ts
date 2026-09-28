import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.routes";

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
app.use("/api/user", userRouter);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "hello world", success: true });
});

export default app;
