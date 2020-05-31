import { Pool } from "pg";
import migrations from "./migrations";

export async function migrate(pool: Pool) {
  console.log("Starting migrations...");

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "query" TEXT NOT NULL
      );
    `);

    console.log("Reading migrations table...");
    const dbMigrations = (await client.query("SELECT * FROM migrations;")).rows.map(m => m.id);

    console.log("Getting migration lock");
    await client.query(`SELECT pg_advisory_lock(1);`);

    console.log("Running migrations...");

    for (const id in migrations) {
      if (!dbMigrations.includes(id)) {
        console.log(`Running migration ${id}...`);
        await client.query("BEGIN;");
        await client.query(migrations[id]);
        await client.query(
          `INSERT INTO migrations (id, "createdAt", query) VALUES ($1, NOW(), $2)`,
          [id, migrations[id]]
        );
        await client.query("COMMIT;");
      } else {
        console.log(`Skipping migration ${id}...`);
      }
    }

    console.log("Releasing migration lock");
    await client.query(`SELECT pg_advisory_unlock(1);`);
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS:", err.message);
  } finally {
    client.release();
    console.log("Finish migrate");
  }
}
