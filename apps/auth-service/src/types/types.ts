//defines types for role, response shape,
export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

//strict rules that every output should follow
