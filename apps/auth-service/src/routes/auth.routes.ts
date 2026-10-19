import { Router } from "express";
import { validateBody } from "shared";
import { registerSchema } from "../schema/auth.schema";
import * as authController from "../controllers/auth.controller";
const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

export default authRouter;
