export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "OPEN" | "IN PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketCategories = ["account", "technical", "payment", "general"];

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
