import e from "express";
import { config } from "dotenv";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import { gatewayAuth } from "./middleware/gatewayAuthentication";
import { resolve } from "node:path";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import cors from "cors";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.GATEWAY_PORT || 4000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";

//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

const app = e();

app.use(helmet());
app.use(cors());
app.use(limiter);

app.get("/health", (_req, res) => {
  successResponse(res, 200, { message: "api-gateway is running successfully" });
});

//setUp proxy
app.use(
  "/api/auth",
  gatewayAuth,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`,
  }),
);

app.use(e.json());
app.use(httpLogger);

//not found route
app.use((_req, _res, next) => {
  next(new AppError(404, "route not found"));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`app is listening on port ${PORT}`);
});
