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

//update ticket
export async function updateTicket(input: {
  subject: string;
  description: string;
  category: string;
  priority: string;
  ticketId: string;
}): Promise<Boolean> {
  const result = await pool.query(
    `UPDATE tickets SET subject =$1, description =$2, category=$3, priority=$5, updated_at = NOW()
 where id =$6`,
    [
      input.subject,
      input.description,
      input.category,
      input.priority,
      input.ticketId,
    ],
  );
  return (result.rowCount ?? 0) > 0;
}

//assign agents to a task
export async function assignAgent(ticketId: string, agentId: string) {
  const result = await pool.query(
    `UPDATE tickets SET assigned_agent_id=$1, assigned_at = NOW() WHERE id = $2`,
    [agentId, ticketId],
  );
  return (result.rowCount ?? 0) > 0;
}

//find ticket by id
export async function findTicketById(id: string): Promise<Tickets> {
  const result = await pool.query(
    `
    SELECT * FROM tickets where id = $1
    `,
    [id],
  );
  return result.rows[0];
}

//update status of ticket by admin or agent
export async function updateTicketStatus(
  status: string,
  id: string,
): Promise<Boolean> {
  const result = await pool.query(
    `UPDATE tickets SET status =$1, updated_at = NOW() WHERE id = $2`,
    [status, id],
  );
  return (result.rowCount ?? 0) > 0;
}

//find user by agentId using specified index

export async function findAgentById(userId: string) {
  const result = await pool.query(
    `SELECT id, role, is_active FROM users WHERE id = $1 AND role = 'AGENT'`,
    [userId],
  );
  return result.rows[0];
}

// export async function findTaskOwner(userId: string) {
//   const result = await pool.query(
//     `SELECT id, role, status
//      FROM users
//      WHERE id = $1 AND role = 'AGENT'`,
//     [userId],
//   );

//   return result.rows[0];
// }
//listTicket according To Role

export async function listTicketsByRole(input: {
  id: string;
  role: string;
  limit: number;
  offset: number;
}): Promise<Tickets[]> {
  if (input.role === "CUSTOMER") {
    const result = await pool.query<Tickets>(
      `SELECT * FROM tickets WHERE created_by = $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3`,
      [input.id, input.limit, input.offset],
    );
    return result.rows;
  } else if (input.role === "AGENT") {
    const result = await pool.query<Tickets>(
      `SELECT * FROM tickets WHERE assigned_agent_id = $1
      ORDER BY created_at DESC`,
      [input.id],
    );
    return result.rows;
  } else {
    const result = await pool.query<Tickets>(
      `SELECT * FROM tickets  ORDER BY created_at DESC`,
    );
    return result.rows;
  }
}

//note: return ticket list all for admin, assigned for agent and belongs to for user
