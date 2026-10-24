import {
  LoginInput,
  RegisterInput,
  UpdatePasswordInput,
  UpdateUserInput,
} from "../schema/auth.schema";
import * as userRepo from "../repositories/user.repository";
import { AppError, logger } from "shared";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";
import { signToken } from "shared";

const salt = bcrypt.genSaltSync(10);
export async function register(input: RegisterInput) {
  //find user by email if already existing
  //throw error if existing
  //if not hash the users password and then create the user and return publicUser without password
  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw new AppError(400, "user is already existing");
  }
  const password_hash = await bcrypt.hash(input.password, salt);

  const newUser = await userRepo.registerUser({
    name: input.name,
    email: input.email,
    password: password_hash,
  });

  logger.info("user created successfully");

  return convertToPublicUser(newUser);
}

//user logins in
//authGateway runs
//finds user and return
export async function login(input: LoginInput) {
  const existingUser = await userRepo.findUserByEmail(input.email);
  if (!existingUser) {
    throw new AppError(401, "invalid email or password");
  }
  const validPassword = await bcrypt.compare(
    input.password,
    existingUser.password_hash,
  );
  if (!validPassword) {
    throw new AppError(404, "invalid email or password");
  }

  //sign a token and also return user data along with th signed token

  const token = signToken({ userId: existingUser.id, role: existingUser.role });

  return { token, user: convertToPublicUser(existingUser) };
}

// find by id
export async function findUserById(id: string, role: string) {
  const user = await userRepo.findUserById(id);
  if (!user) {
    throw new AppError(401, "user does not exist");
  }
  if (user.role !== role && user.role !== "ADMIN") {
    throw new AppError(
      401,
      "you do no have the permission to perform this action.",
    );
  }

  return convertToPublicUser(user);
}

//update password
export async function updatePassword(
  input: UpdatePasswordInput,
  userId: string,
  role: string,
) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(409, "user not found");
  }

  if (user.role !== role) {
    throw new AppError(403, "you do not have rights to update your password.");
  }

  const validPassword = await bcrypt.compare(
    input.oldPassword,
    user.password_hash,
  );

  if (!validPassword) {
    throw new AppError(401, "the password you entered is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(input.newPassword, salt);

  const updated = await userRepo.updatePassword({
    id: userId,
    newPassword: hashedNewPassword,
  });

  if (!updated) {
    throw new Error("an error occurred. failed to update password");
  }
}

//update user details
export async function updateUser(
  input: UpdateUserInput,
  userId: string,
  role: string,
) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AppError(409, "user does not exist");
  }
  if (user.role != role) {
    throw new AppError(
      401,
      "you do not have the permission to update user profile",
    );
  }

  const updated = await userRepo.updateUser({
    name: user.name ?? input.name,
    email: user.email ?? input.email,
    id: userId,
  });
  if (!updated) {
    throw new Error("failed to update user details");
  }
}
