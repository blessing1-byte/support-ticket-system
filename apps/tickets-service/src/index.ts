import e from "express";
import dotenv from "dotenv";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
  verifyGatewaySecret,
} from "shared";
import ticketRouter from "./routes/tickets.routes";
import { initKafka, pollOutbox } from "./utils/kafka";

dotenv.config({ path: resolve(process.cwd(), "../../../.env") });

dotenv.config({ path: resolve(process.cwd(), ".env") });

const PORT = process.env.TICKET_PORT || 4002;

const app = e();
app.use(httpLogger);
app.use(e.json());
app.get("/health", (_req, res) => {
  successResponse(res, 200, { message: "ticket service is running" });
});

app.use("/api/ticket", verifyGatewaySecret, ticketRouter);

app.use((_req, res, next) => {
  next(new AppError(404, "not found"));
});

app.use(errorHandler);

async function startKafka() {
  try {
    //initialize producer
    await initKafka();

    await pollOutbox();
  } catch (error) {
    logger.error({ error }, "kafka producer init failed");
  }
}
app.listen(PORT, () => {
  logger.info(`ticket service is running on ${PORT}`);
});
startKafka();
