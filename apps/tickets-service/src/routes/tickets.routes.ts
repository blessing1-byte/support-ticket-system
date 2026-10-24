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

export default ticketRouter;
