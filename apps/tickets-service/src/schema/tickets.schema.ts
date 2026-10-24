import z from "zod";
export const ticketSchema = z.object({
  subject: z.string().min(1, "tickets must have a subject"),
  description: z.string().min(1, "tickets must have a description"),
  category: z.string().min(1, "tickets must have a category"),
  priority: z.string().min(1, "tickets must have a priority"),
  status: z.string().min(1, "tickets must have a status"),
});

export type TicketInput = z.infer<typeof ticketSchema>;
