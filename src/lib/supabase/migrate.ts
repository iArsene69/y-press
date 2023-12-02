import { migrate } from "drizzle-orm/postgres-js/migrator";
import db from "./db";

const migrateDB = async () => {
  try {
    console.log("🔃Migrating Database");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("✅Database successfully migrated");
  } catch (error) {
    console.error("❌Failed to migrate database--Error:", error);
  }
};

migrateDB();
