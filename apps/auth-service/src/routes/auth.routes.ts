import { Router } from "express";
import { validateBody } from "shared";
import { loginSchema, registerSchema } from "../schema/auth.schema";
import * as authController from "../controllers/auth.controller";
const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

//login user
authRouter.post("/login", validateBody(loginSchema), authController.login);

export default authRouter;
