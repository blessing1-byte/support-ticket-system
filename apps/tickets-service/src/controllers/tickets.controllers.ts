import { Request, Response, NextFunction } from "express";
import { requireIdentity, successResponse } from "shared";
import * as ticketService from "../services/tickets.service";

export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = requireIdentity(req);
    const ticket = await ticketService.createTicket(req.body, userId);
    return successResponse(res, 201, { ticket });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = req.params.id as string;
    const { userId, role } = requireIdentity(req);
    const updatedTicket = await ticketService.updateTicket(
      req.body,
      taskId,
      userId,
      role,
    );
    return successResponse(res, 200, { message: "ticket update successfully" });
  } catch (error) {
    next(error);
  }
}

export async function assignAgent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketId = req.params.id as string;
    const { role } = requireIdentity(req);
    const { agentId } = req.body;
    const assignedAgent = await ticketService.assignAgent(
      ticketId,
      role,
      agentId,
    );
    return successResponse(res, 200, { message: "agent assigned successful" });
  } catch (error) {
    next(error);
  }
}

//list tasks
export async function listUserTickets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requireIdentity(req);

    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;

    const tickets = await ticketService.listUserTickets({
      id: userId,
      role,
      page,
      limit,
    });
    return successResponse(res, 200, { tickets });
  } catch (error) {
    next(error);
  }
}

export async function updateTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = req.params.id as string;
    const { userId } = requireIdentity(req);
    const { status } = req.body;
    const updatedTicketStatus = await ticketService.updateTicketStatus(
      status,
      taskId,
      userId,
    );
    return successResponse(res, 200, {
      message: "ticket status update successfully",
    });
  } catch (error) {
    next(error);
  }
}

//the agent should be able to view the tickets assigned to it
//
