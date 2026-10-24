import { UserRole } from "shared";
// define public route
export const PublicRoute = [
  { method: "POST", path: "/api/auth/register" },
  { method: "POST", path: "/api/auth/login" },
] as const;
//define rbac rule type
export type RbacRule = {
  method: string;
  path: string;
  role: UserRole[];
};

//define the role based access routes
const roleBasedRoutes: RbacRule[] = [
  {
    method: "POST",
    path: "/api/auth/create-agent",
    role: ["ADMIN"],
  },
  {
    method: "GET",
    path: "/api/auth/me",
    role: ["CUSTOMER", "ADMIN"],
  },
  {
    method: "PATCH",
    path: "/api/auth/me/update",
    role: ["CUSTOMER"],
  },

  //ticket routes

  {
    method: "POST",
    path: "/api/ticket/create-ticket",
    role: ["CUSTOMER"],
  },
];

//helper function
//match path against a pattern
// matchPath purely as a routing gatekeeper (e.g., to decide if a URL pattern requires a specific role like "admin" or "user")
export function matchPath(pathPattern: string, actualPath: string): boolean {
  if (pathPattern == actualPath) {
    return true;
  }

  //split paths into parts according to i5t slashes and loop to check if each element in the array match
  const patternParts = pathPattern.split("/");
  const actualPathParts = actualPath.split("/");

  if (actualPathParts.length !== patternParts.length) {
    return false;
  }

  return patternParts.every(
    (part, index) => part.startsWith(":") || part === actualPathParts[index],
  );
}
// the two main functions
//1. checks the public route
//2. checks the roleBasedRoute

// check if path is public
export function isPublicRoute(method: string, path: string): boolean {
  return PublicRoute.some(
    (route) => route.method === method && matchPath(route.path, path),
  );
}

//check allowed roles for a particular path
//find the path that matches the roleBasedRoute and then extract the role

export function getAllowedRoles(
  method: string,
  path: string,
): UserRole[] | null {
  const route = roleBasedRoutes.find(
    (currentRoute) =>
      currentRoute.method === method && matchPath(currentRoute.path, path),
  );

  return route?.role ?? null;
}
