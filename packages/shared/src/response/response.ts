//should be able to check if response is success or failed
//response shape
import { Response } from "express";

//res, statuscode, data

//success response shape
export function successResponse(
  res: Response,
  statusCode = 200,
  data: unknown,
) {
  return res.status(statusCode).json({ success: true, data });
}

//failed response shape
export function failResponse(res: Response, message: string, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
