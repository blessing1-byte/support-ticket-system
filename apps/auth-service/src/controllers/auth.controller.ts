import { Request, Response, NextFunction } from "express";
import * as userService from "../services/auth.service";
import { requireIdentity, successResponse } from "shared";
import * as adminService from "../services/admin.service";

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

//find by id
export async function findUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);

    const user = await userService.findUserById(userId, role);
    successResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
}

//update password
export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);

    const updated = await userService.updatePassword(req.body, userId, role);
    successResponse(res, 204, { message: "password updated successfully" });
  } catch (error) {
    next(error);
  }
}

//agent controller
export async function createAgent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const agent = await adminService.createAgent(req.body);
    return successResponse(res, 201, { agent });
  } catch (error) {
    return next(error);
  }
}
