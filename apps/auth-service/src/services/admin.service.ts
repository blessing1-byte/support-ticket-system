import { AdminCreationData } from "../schema/admin.schema";
import * as adminRepo from "../repositories/admin.repository";
import { AppError } from "shared";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";

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
