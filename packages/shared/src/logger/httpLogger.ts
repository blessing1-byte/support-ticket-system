import { pinoHttp } from "pino-http";
import { logger } from "./logger";

export const httpLogger = pinoHttp({
  logger: logger,
});

//this helps to log http requests
