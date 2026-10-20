import { LoginInput, RegisterInput } from "../schema/auth.schema";
import * as userRepo from "../repositories/user.repository";
import { AppError, logger } from "shared";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";

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
    throw new AppError(404, "invalid email or password");
  }
  const validPassword = bcrypt.compare(
    input.password,
    existingUser.password_hash,
  );
  if (!validPassword) {
    throw new AppError(404, "invalid email or password");
  }

  //sign a token and also return user data along with th signed token
  return { user: convertToPublicUser(existingUser) };
}
