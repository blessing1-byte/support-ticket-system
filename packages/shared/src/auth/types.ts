// define the user role and jwt payload
export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";
export type JwtPayload = {
  userId: string;
  role: UserRole;
};
