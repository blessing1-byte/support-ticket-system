import { Router } from "express";
import { validateBody } from "shared";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "../schema/auth.schema";
import * as authController from "../controllers/auth.controller";
import { requireAdmin } from "../middleware/adminAuthorization";
const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

//login user
authRouter.post("/login", validateBody(loginSchema), authController.login);

//findById
authRouter.get("/me", authController.findUserById);

//agent
//create agent
authRouter.post(
  "/create-agent",
  validateBody(registerSchema),
  requireAdmin,
  authController.createAgent,
);

authRouter.post(
  "/me/update-password",
  validateBody(updatePasswordSchema),
  authController.updatePassword,
);

export default authRouter;
