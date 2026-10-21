import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

//the headers
const IDENTITY_HEADERS = ["x-userId", "x-role", "x-gateway-secret"] as const;

//strip identity headers
function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

//set gateway secret header
function attachGatewaySecret(req: Request) {
  const gatewaySecret = process.env.GATEWAY_SECRET;

  if (!gatewaySecret) {
    throw new Error("gateway secret was not set");
  }

  req.headers["x-gateway-secret"] = gatewaySecret;
}
//path normalization.: requestPath
function NormalizeRequestPath(req: Request) {
  const combinedPath = `${req.baseUrl}${req.path}`;
  // if combined path actually exist, using length check for a string and if it also ends with a trailing slash, slice the trailing slash off
  if (combinedPath.length > 1 && combinedPath.endsWith("/")) {
    return combinedPath.slice(0, -1);
  }
  return combinedPath || "/";
}

//attach headers
function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-userId"] = userId;
  req.headers["x-role"] = role;
}
export function gatewayAuth(req: Request, res: Response, next: NextFunction) {
  try {
    stripIdentityHeaders(req);
    attachGatewaySecret(req);

    //check if its public route
    const normalizedPath = NormalizeRequestPath(req);

    //debugger check
    console.log(
      `[Gateway] Method: ${req.method}, Path: ${normalizedPath}, IsPublic: ${isPublicRoute(req.method, normalizedPath)}`,
    );
    if (isPublicRoute(req.method, normalizedPath)) {
      return next();
    }

    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "missing or Invalid authentication header");
    }

    //slice out the bearer text to extract the token
    const token = authHeader.slice(7);

    //verifying a token returns the payload
    const payload = verifyToken(token);

    //check for allowed roles
    const allowedRoles = getAllowedRoles(req.method, normalizedPath);

    if (!allowedRoles) {
      throw new AppError(401, "role not found");
    }

    //check if the role returned by allowed role matches the one from the payload
    if (!allowedRoles.includes(payload.role)) {
      throw new AppError(
        403,
        "you do not have permission to access this route",
      );
    }

    attachUserHeaders(req, payload.userId, payload.role);

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, "invalid or expired Token"));
  }
}

// low level logic flow:
//strip the identity headers
//attach gateway secret
//normalize the path from request

//confirm the path to know if the route is public path using the isPublicRoute fn from the rbac setup

//if public then end process by passing to the next fn

//if private, get thr authHeader, header: authorization
//perform necessary checks on the authHeader before using it to verify the token

//once token is verified,
//it returns a payload. from the returned result, take the role from the token and check the allowed roles

//if role is right, attach the user headers: userId and role.

// high level logic flow:
//api gateway is the first thing that runs, then runs this middleware to authenticate the user, the middleware does the job of adding the gateway secret from the env into the header, that hold it first and then run the rbac check on the user and the path, then when its about to enter into the protected route, it now runs the function of verifyGatewaySecret thats why the entryPoint to the individual service route hold the verifyGatewaySecret as a checker against the gateway secret set by this middleware, so it verifies the gateway secret that was added by the middleware, ie. incomingSecret against the expectedSecret in the .env

/*
The Gateway Boundary:  API Gateway acts as the only entry point from the outside world. It handles heavy lifting like JWT verification and RBAC.

Internal Trust: Downstream microservices don't need to re-verify user passwords or tokens; they simply trust that if the request made it past the gateway with a valid x-gateway-secret, it is safe to process.

Service Protection:  verifyGatewaySecret checker on the individual microservices ensures that malicious actors cannot bypass your gateway and hit your internal services directly.
*/
