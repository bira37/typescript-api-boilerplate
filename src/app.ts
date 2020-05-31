import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { auth, createContext } from "./middlewares";
import { migrate } from "./migrations/migrationRunner";
import routes from "./routes";
import { createPgPoolInstance, PgPoolInstance } from "./utils/db";

export async function createApp(
  databaseName: string | null = null
): Promise<{ app: express.Express; pgPool: PgPoolInstance }> {
  const app = express();
  const masterPool = createPgPoolInstance();

  const dbName = databaseName ?? "postgres";

  const [dbExists] = await masterPool.sql`
    SELECT EXISTS(
      SELECT datname FROM pg_catalog.pg_database WHERE datname = ${dbName}
    );`;

  if (!dbExists.exists) {
    await masterPool.pool.query(`CREATE DATABASE ${dbName};`);
  }

  masterPool.pool.end();

  const pgPool: PgPoolInstance = createPgPoolInstance(databaseName);

  await migrate(pgPool.pool);

  if (process.env.NODE_ENV === "test") {
    await pgPool.pool.query(
      `INSERT INTO users (username, password, email, "firstName", "lastName", "isSuperUser") VALUES ('test', '$2b$10$3ic6voUGModwqeXv7zSph.OOcDgb22xB.4zZEuAbsPMJWSjVF6wia', 'test@test', 'test', 'user', FALSE);`
    );

    await pgPool.pool.query(
      `INSERT INTO users (username, password, email, "firstName", "lastName", "isSuperUser") VALUES ('supertest', '$2b$10$3ic6voUGModwqeXv7zSph.OOcDgb22xB.4zZEuAbsPMJWSjVF6wia', 'test@test', 'test', 'user', TRUE);`
    );
  }
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(createContext(pgPool));

  app.use("/auth", routes.auth);
  app.use("/user", auth(), routes.user);

  return { app, pgPool };
}
