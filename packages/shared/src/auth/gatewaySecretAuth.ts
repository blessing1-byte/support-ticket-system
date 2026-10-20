import { config } from "dotenv";
import { resolve } from "node:path";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
config({ path: resolve(process.cwd(), "../../../../.env") });

export function requireGatewaySecret(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const expectedSecret = process.env.GATEWAY_SECRET;
  if (!expectedSecret) {
    return next(new AppError(500, "gateway secret was not set"));
  }

  const incomingSecret = req.header("x-gateway-secret");
  if (!incomingSecret || incomingSecret != expectedSecret) {
    return next(new AppError(403, "forbidden"));
  }
  next();
}
