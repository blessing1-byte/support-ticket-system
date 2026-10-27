export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "OPEN" | "IN PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketCategories = "account" | "technical" | "payment" | "general";

export type Tickets = {
  id: string;
  subject: string;
  description: string;
  category: TicketCategories;
  priority: Priority;
  status: Status;
  created_by: string;
  assigned_agent_id: string;
  assigned_at: Date;
  created_at: Date;
  updated_at: Date;
};

export type Events = {
  id: string;
  topic: string;
  event_type: string;
  aggregate_id: string;
  payload: Record<string, any>;
  created_at: Date;
  published_at: Date | null;
};
