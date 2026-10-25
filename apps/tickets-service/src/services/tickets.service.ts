import { TicketInput, UpdateTicketInput } from "../schema/tickets.schema";
import * as ticketRepo from "../repositories/tickets.repository";
import { convertToPublicTickets } from "../utils/tickets.utils";
import { AppError } from "shared";

export async function createTicket(input: TicketInput, userId: string) {
  const ticket = await ticketRepo.createTicket({
    subject: input.subject,
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: input.status,
    created_by: userId,
  });

  if (!ticket) {
    throw new Error("failed to create ticket");
  }

  return convertToPublicTickets(ticket);
}

//update ticket
export async function updateTicket(
  input: UpdateTicketInput,
  ticketId: string,
  userId: string,
  role: string,
) {
  if (!ticketId) {
    throw new AppError(404, "task does not exist");
  }

  const ticket = await ticketRepo.findTicketById(ticketId);
  if (userId !== ticket.created_by) {
    throw new AppError(403, "you do not have permission to update ticket");
  }

  if (role !== "CUSTOMER") {
    throw new AppError(
      403,
      "you do not have the permission to update user's ticket details",
    );
  }

  const updatedTicket = await ticketRepo.updateTicket({
    subject: input.subject,
    description: input.description,
    category: input.category,
    priority: input.priority,
    ticketId,
  });

  if (!updatedTicket) {
    throw new Error("failed to update ticket");
  }
}

//assign agent to a task
//find task by id
export async function assignAgent(
  ticketId: string,
  role: string,
  agentId: string,
) {
  const ticket = await ticketRepo.findTicketById(ticketId);
  if (!ticket) {
    throw new AppError(404, "task does not exist");
  }

  const agent = await ticketRepo.findAgentById(agentId);
  if (!agent) {
    throw new AppError(404, "Agent does not exists");
  }
  if (agent.role !== "AGENT") {
    throw new AppError(400, "user is not an agent");
  }

  if (role !== "ADMIN") {
    throw new AppError(
      403,
      "you do not have the permission to assign an agent",
    );
  }
  const assigned = await ticketRepo.assignAgent(ticketId, agentId);
  if (!assigned) {
    throw new Error("failed to assign an agent to task");
  }
}
//  api/ticket/:id/assign-agent/:id
//   -- shows a lst of active agents

export async function listUserTickets(input: {
  id: string;
  role: string;
  page: number;
  limit: number;
}) {
  if (!input.id || !input.role) {
    throw new AppError(404, "missing user identity");
  }
  //the page you are currently in minus 1 8 the set limit per page
  const offset = (input.page - 1) * 10;

  const tickets = await ticketRepo.listTicketsByRole({
    id: input.id,
    role: input.role,
    limit: input.limit,
    offset,
  });

  return tickets.map((ticket) => convertToPublicTickets(ticket));
}

export async function updateTicketStatus(
  status: string,
  id: string,
  role: string,
) {
  const ticket = await ticketRepo.findTicketById(id);
  if (!ticket) {
    throw new AppError(404, "task does not exist");
  }

  if (role !== "AGENT" && role !== "ADMIN") {
    throw new AppError(
      403,
      "you dod not have permission to update this task status",
    );
  }

  const UpdatedStatus = await ticketRepo.updateTicketStatus(status, id);
  if (!UpdatedStatus) {
    throw new Error("failed to update task status");
  }
}
