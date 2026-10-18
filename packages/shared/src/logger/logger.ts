//this creates an instance of the pino using the loglevel and configures the loglevel
//general logger for any info
import dotenv from "dotenv";
import pino from "pino";
dotenv.config();

const log_level =
  process.env.NODE_ENV === "production" ? process.env.LOG_LEVEL : "debug";

export const logger = pino({ level: log_level || "info" });
