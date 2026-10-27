import { closePool, getPool, TOPICS } from "shared";
import { TicketCategories, Tickets } from "../types/types";

const pool = getPool();

export async function createTicket(input: {
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_by: string;
}): Promise<Tickets> {
  //acquire a single connection from the pool
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const ticketResult = await client.query(
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
    const ticket = ticketResult.rows[0];

    const payload = {
      ticketId: ticket.id,
      created_by: ticket.created_by,
      message: "ticket created successfully",
      subject: ticket.subject,
    };

    const outboxResult = await client.query(
      `INSERT INTO outbox_events(topic, event_type, aggregate_id, payload)
      VALUES($1,$2,$3,$4)
      RETURNING id, topic, event_type, aggregate_id, payload, created_at, published_at`,
      [
        TOPICS.TICKET_EVENTS,
        "ticket.created",
        ticket.id,
        JSON.stringify(payload),
      ],
    );
    await client.query("COMMIT");
    return ticket;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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

//unassign agent
export async function unassignAgent(ticketId: string): Promise<Boolean> {
  const result = await pool.query(
    `DELETE assigned_agent_id from tickets WHERE id=$1`,
    [ticketId],
  );
  return (result.rowCount ?? 0) > 0;
}

//re assign an agent
export async function reassignAgent(
  ticketId: string,
  agentId: string,
): Promise<Boolean> {
  const result = await pool.query(
    `UPDATE tickets SET assigned_agent_id = $1, updated_at=NOW() WHERE id=$2`,
    [agentId, ticketId],
  );
  return (result.rowCount ?? 0) > 0;
}

//do find ticket by id in service and controller
//delete ticket by admin and customer
//logout on service by invalidation of jwt token
