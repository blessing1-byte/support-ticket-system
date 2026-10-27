//barrel file
// npm i pino pino-http pg zod

//logger
export { logger } from "./logger/logger";
export { httpLogger } from "./logger/httpLogger";

//error handlers
export { AppError } from "./errors/AppError";
export { errorHandler } from "./errors/errorHandler";

//validateBody
export { validateBody } from "./validation/validateBody";

//response
export { failResponse, successResponse } from "./response/response";

//db
export { closePool, getPool } from "./db/pool";

//token
export { signToken, verifyToken } from "./auth/jwt";

//userRole
export type { UserRole } from "./auth/types";

//verify gateway secret
export { verifyGatewaySecret } from "./auth/gatewaySecretAuth";

//require Identity
export { requireIdentity } from "./util/requireIdentity";

//kafka
export { createProducer } from "./kafka/producers";
export { createConsumer } from "./kafka/consumer";

export { TOPICS } from "./kafka/topics";
export { publishJson, publishJsonSafe } from "./kafka/producers";
