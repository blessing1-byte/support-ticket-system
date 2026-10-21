import { getPool } from "shared";
import { User, UserRole } from "../types/types";

const pool = getPool();
export async function createAdmin(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users(name, email, password_hash, role )
        VALUES( $1, $2, $3, 'ADMIN')
        RETURNING id, name, email,role, is_active, created_at,updated_at `,
    [input.name, input.email, input.password],
  );
  return result.rows[0];
}

//find user by role
export async function findAdmin(): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, name, email,password_hash, role, is_active, created_at,updated_at from users WHERE role = 'ADMIN'
    `,
  );
  return result.rows[0] ?? null;
}

//AGENT REPO

//createAgent()
export async function createAgent(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users(name, email, password_hash, role)
        VALUES( $1, $2, $3, 'AGENT')
        RETURNING id, name, email,role, is_active, created_at,updated_at `,
    [input.name, input.email, input.password],
  );
  return result.rows[0];
}

//findAgent by email
export async function findAgentByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    `SELECT id, name, email, password_hash, role, is_active, created_at,updated_at from users WHERE email = $1 AND role = 'AGENT'
    `,
    [email],
  );
  return result.rows[0] ?? null;
}
