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
    `SELECT id, name, email, role, is_active,password_hash,created_at,updated_at from users WHERE email= $1
    `,
    [email],
  );
  return result.rows[0] ?? null;
}

//find user by id: /api/auth/me
export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, name, email, role, is_active,password_hash,created_at,updated_at from users WHERE id= $1
    `,
    [id],
  );
  return result.rows[0] ?? null;
}

//update user profile: strictly the customer
//should user be allowed to update password on here or run forgot password separately.
// export async function updateUser(input:{
//     name: string,
//     email: string,
//     password: string
// }): Promise<User>{

// }

//update user status: admin and agent

//users should have a right to reopen a closed ticket

//update password
//user is authenticated from his token to know if he is the owner of that account. user types his password. it is verified against existing password
export async function updatePassword(input: {
  id: string;
  newPassword: Promise<string>;
}): Promise<Boolean> {
  const result = await pool.query(
    `
    UPDATE users SET password_hash = $1, updated_at = NOW() where id = $3
    `,
    [input.newPassword, input.id],
  );
  return (result.rowCount ?? 0) > 0;
}
