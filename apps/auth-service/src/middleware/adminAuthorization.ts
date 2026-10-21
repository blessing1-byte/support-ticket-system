import { Request, Response, NextFunction } from "express";
import { AppError, requireIdentity } from "shared";
export function requireAdmin(req: Request, Res: Response, next: NextFunction) {
  try {
    const { userId, role } = requireIdentity(req);

    if (!userId || role !== "ADMIN") {
      throw new AppError(403, "only administrator can create agents");
    }
    next();
  } catch (error) {
    next();
  }
}
