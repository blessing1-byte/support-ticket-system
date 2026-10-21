import { Request, Response, NextFunction } from "express";
import { AppError } from "../src";

export function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-role");

  if (!userId || !role) {
    throw new AppError(401, "missing user identity");
  }

  return {
    userId: userId,
    role: role,
  };
}
