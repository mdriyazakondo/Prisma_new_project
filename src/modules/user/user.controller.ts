import HttpStatus from "http-status";
import { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const user = await userService.userCreate(req.body);

  res.status(HttpStatus.CREATED).json({
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
};

export const userController = {
  createUser,
};
