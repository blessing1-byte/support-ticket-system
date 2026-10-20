import dotenv from "dotenv";
import { resolve } from "node:path";
import { closePool } from "shared";
import * as adminService from "../services/admin.service";

dotenv.config({ path: resolve(__dirname, "../../../../.env") });
async function main() {
  try {
    const admin_name = process.env.ADMIN_NAME;
    const admin_email = process.env.ADMIN_EMAIL;
    const admin_password = process.env.ADMIN_PASSWORD;

    if (!admin_name || !admin_email || !admin_password) {
      throw new Error("environment variables was not set");
    }
    const admin = await adminService.createAdmin({
      name: admin_name,
      email: admin_email,
      password: admin_password,
    });
    console.log("admin created successfully: " + admin.email);
  } catch (error) {
    console.error("admin creation failed:", error);
    process.exitCode = 1;
  } finally {
    try {
      await closePool();
      console.log("connection closed");
    } catch (error) {
      console.error("Failed to close database connection:", error);
      process.exitCode = 1;
    }
  }
}
main();
