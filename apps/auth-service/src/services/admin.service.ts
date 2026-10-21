import { AdminCreationData } from "../schema/admin.schema";
import * as adminRepo from "../repositories/admin.repository";
import { AppError } from "shared";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";
import { RegisterInput } from "../schema/auth.schema";

const salt = bcrypt.genSaltSync(10);

export async function createAdmin(input: AdminCreationData) {
  const admin = await adminRepo.findAdmin();
  if (admin) {
    throw new AppError(409, "admin already exists");
  }

  const password_hash = await bcrypt.hash(input.password, salt);

  const newAdmin = await adminRepo.createAdmin({
    name: input.name,
    email: input.email,
    password: password_hash,
  });

  return convertToPublicUser(newAdmin);
}

//create agent
export async function createAgent(input: RegisterInput) {
  const agent = await adminRepo.findAgentByEmail(input.email);
  if (agent) {
    throw new AppError(409, "agent already exists");
  }

  const password_hash = await bcrypt.hash(input.password, salt);

  const newAgent = await adminRepo.createAgent({
    name: input.name,
    email: input.email,
    password: password_hash,
  });

  return convertToPublicUser(newAgent);
}
