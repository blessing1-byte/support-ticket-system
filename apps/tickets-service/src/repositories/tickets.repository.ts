import { getPool } from "shared";
import { Tickets } from "../types/types";

const pool = getPool();

export async function createTicket(input: {
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_by: string;
}): Promise<Tickets> {
  const result = await pool.query(
    `INSERT INTO tickets(subject, description, category, priority, status,created_by)
        VALUES($1,$2,$3,$4, $5,$6)
        RETURNING id, subject, description, category, priority, status,created_by, assigned_agent_id, assigned_at, created_at, updated_at`,
    [
      input.subject,
      input.description,
      input.category,
      input.priority,
      input.status,
      input.created_by,
    ],
  );
  return result.rows[0];
}
