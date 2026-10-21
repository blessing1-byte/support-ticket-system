import { LoginInput, RegisterInput } from "../schema/auth.schema";
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
