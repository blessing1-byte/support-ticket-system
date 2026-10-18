import dotenv from "dotenv";
// import { resolve } from "node:path";
// import { cwd } from "node:process";
import { Pool } from "pg";
import { AppError } from "../errors/AppError";
dotenv.config();

let pool: Pool | null = null;

//create an instance of pool connection
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new AppError(404, "DATABASE_URL was not set");
    }

    pool = new Pool({ connectionString });
  }
  return pool;
}

//close connection
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default getPool;
