import { Pool, PoolClient } from "pg";

function makePool(databaseName: string | null = null) {
  return new Pool({
    connectionString: `${process.env.DATABASE_URL}${
      process.env.NODE_ENV !== "production" ? "/" + (databaseName ? databaseName : "postgres") : ""
    }`,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
  });
}

function wrapQuery(pool: Pool) {
  return async function (q: TemplateStringsArray, ...args: any[]): Promise<any[]> {
    const client = await pool.connect();
    const query: string[] = [];

    query.push(q[0]);

    for (let i = 0; i < args.length; i++) {
      query.push(`$${(i + 1).toString()}`);
      query.push(q[i + 1]);
    }

    try {
      const result = await client.query(query.join(""), args);
      client.release();
      return result.rows;
    } catch (err) {
      client.release();
      console.error({ error: err, query: query.join(""), args });
      throw err;
    }
  };
}

function wrapTransaction(pool: Pool) {
  function wrapClient(client: PoolClient) {
    return async function (q: TemplateStringsArray, ...args: any[]): Promise<any[]> {
      const query: string[] = [];

      query.push(q[0]);

      for (let i = 0; i < args.length; i++) {
        query.push(`$${(i + 1).toString()}`);
        query.push(q[i + 1]);
      }

      try {
        const result = await client.query(query.join(""), args);
        return result.rows;
      } catch (err) {
        console.error({ error: err, query: query.join(""), args });
        throw err;
      }
    };
  }

  return async function (
    callback: (sql: (q: TemplateStringsArray, ...args: any[]) => Promise<any[]>) => Promise<void>
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN;");
      await callback(wrapClient(client));
      await client.query("COMMIT;");
      client.release();
    } catch (err) {
      console.error(err);
      await client.query("ROLLBACK;");
      client.release();
      throw err;
    }
  };
}

export interface PgPoolInstance {
  pool: Pool;
  sql: (q: TemplateStringsArray, ...args: any[]) => Promise<any[]>;
  transaction: (
    callback: (sql: (q: TemplateStringsArray, ...args: any[]) => Promise<any[]>) => Promise<void>
  ) => Promise<void>;
}

export function createPgPoolInstance(databaseName: string | null = null): PgPoolInstance {
  const pool = makePool(databaseName);

  return {
    pool,
    sql: wrapQuery(pool),
    transaction: wrapTransaction(pool)
  };
}
