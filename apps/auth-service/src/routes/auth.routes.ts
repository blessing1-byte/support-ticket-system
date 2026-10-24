import { Router } from "express";
import { validateBody } from "shared";
import {
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateUserSchema,
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

authRouter.patch(
  "/me/update",
  validateBody(updatePasswordSchema),
  authController.updatePassword,
);

authRouter.patch(
  "/me/update",
  validateBody(updateUserSchema),
  authController.updateUser,
);

export default authRouter;
