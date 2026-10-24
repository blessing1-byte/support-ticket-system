import { Tickets } from "../types/types";

export function convertToPublicTickets(tickets: Tickets) {
  return {
    id: tickets.id,
    subject: tickets.subject,
    description: tickets.description,
    category: tickets.category,
    priority: tickets.priority,
    status: tickets.status,
    created_by: tickets.created_by,
    assigned_agent_id: tickets.assigned_agent_id,
    assigned_at: tickets.assigned_at,
    created_at: tickets.created_at,
    updated_at: tickets.updated_at,
  };
}
