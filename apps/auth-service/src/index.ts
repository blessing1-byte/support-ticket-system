import e from "express";
import dotenv from "dotenv";
import { resolve } from "node:path";
import { errorHandler, httpLogger, logger, successResponse } from "shared";
import authRouter from "./routes/auth.routes";

dotenv.config({ path: resolve(process.cwd(), "../../../.env") });

dotenv.config({ path: resolve(process.cwd(), ".env") });

const PORT = process.env.AUTH_PORT || 4001;

const app = e();
app.use(httpLogger);
app.use(e.json());

app.get("/health", (_req, res) => {
  successResponse(res, 200, {
    message: "support ticket system auth service is running",
  });
});
//set up routes
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info("app is running on port 4001");
});
