//sign token - expiration time, secret key, payload.
//verify token

import { resolve } from "node:path";
import { JwtPayload } from "./types";
import { config } from "dotenv";
import { AppError } from "../errors/AppError";
import jwt from "jsonwebtoken";

config({ path: resolve(process.cwd(), "../../../.env") });

function extractSecret() {
  const accessSecret = process.env.ACCESS_SECRET;
  if (!accessSecret) {
    throw new AppError(404, "access secret was not set");
  }
  return accessSecret;
}

export function signToken(payload: JwtPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  return jwt.sign(payload, extractSecret(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  const allowedRoles = ["CUSTOMER", "AGENT", "ADMIN"];

  const decodeToken = jwt.verify(token, extractSecret());

  //if token is not returned as an object or is null or id is not string, or role does not include any from the allowed roles
  if (
    decodeToken === null ||
    typeof decodeToken !== "object" ||
    typeof decodeToken.userId !== "string" ||
    !allowedRoles.includes(decodeToken.role)
  ) {
    throw new Error("invalid auth token");
  }

  return {
    userId: decodeToken.userId,
    role: decodeToken.role,
  };
}
