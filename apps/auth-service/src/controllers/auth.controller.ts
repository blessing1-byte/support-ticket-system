import { Request, Response, NextFunction } from "express";
import * as userService from "../services/auth.service";
import { successResponse } from "shared";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await userService.register(req.body);
    successResponse(res, 201, { user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.login(req.body);
    successResponse(res, 201, { user });
  } catch (error) {
    next(error);
  }
}
