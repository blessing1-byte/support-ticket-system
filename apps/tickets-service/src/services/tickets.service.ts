import { TicketInput } from "../schema/tickets.schema";
import * as ticketRepo from "../repositories/tickets.repository";
import { convertToPublicTickets } from "../utils/tickets.utils";

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
