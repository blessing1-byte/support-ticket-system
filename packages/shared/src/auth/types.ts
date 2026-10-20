// define the user role and jwt payload
export type userRole = "CUSTOMER" | "AGENT" | "ADMIN";
export type JwtPayload = {
  userId: string;
  role: userRole;
};
