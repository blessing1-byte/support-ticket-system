import dotenv from "dotenv";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { closePool, getPool } from "./../packages/shared/src/db/pool";

dotenv.config();

async function main() {
  try {
    //sql file to run
    //get the content
    const file = process.argv[2] || "001_users.sql";

    //read the data in the sql and perform query to create table
    //read the content
    const sql = readFileSync(resolve(process.cwd(), file), "utf-8");

    const pool = getPool();
    console.log("connection established successfully");
    //put the content
    await pool.query(sql);

    //success message
    console.log(" migrated successfully : ", file);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
    console.log("connection closed");
  }
}

main();

/*
 Micro-Optimization 
If process.exit(1) is called inside a catch block, Node.js terminates the process immediately, which can sometimes bypass the execution of finally.

To ensure the finally block always completes its cleanup cleanly before exiting, set process.exitCode = 1 instead:
*/
