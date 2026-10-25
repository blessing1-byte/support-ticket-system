import { Router } from "express";
import * as ticketController from "../controllers/tickets.controllers";
import { ticketSchema } from "../schema/tickets.schema";
import { validateBody } from "shared";
const ticketRouter = Router();

ticketRouter.post(
  "/create-ticket",
  validateBody(ticketSchema),
  ticketController.createTicket,
);

ticketRouter.patch("/:id/assign-agent", ticketController.assignAgent);

ticketRouter.get("/list-tickets", ticketController.listUserTickets);

ticketRouter.patch("/:id/update-ticket", ticketController.updateTicket);

ticketRouter.patch("/:id/update-ticket", ticketController.updateTicketStatus);

export default ticketRouter;
