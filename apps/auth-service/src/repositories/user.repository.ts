import { UserRole, User } from "../types/types";
import { getPool } from "shared";

const pool = getPool();

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users(name, email, password_hash)
        VALUES( $1, $2, $3)
        RETURNING id, name, email,role, is_active, created_at,updated_at `,
    [input.name, input.email, input.password],
  );
  return result.rows[0];
}

//find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, name, email, role, is_active, created_at,updated_at from users WHERE email= $1
    `,
    [email],
  );
  return result.rows[0] ?? null;
}
