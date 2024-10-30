import { ENV } from "@/server/constants/env.constant";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const connection = new Database(ENV.DB_URL);

export const db = drizzle(connection);
