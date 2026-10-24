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
