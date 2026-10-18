export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: Boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
//statuscode, message, isOperational
//defined as a class in order to create instances and extend the main error class
