import { createPgPoolInstance, PgPoolInstance } from "../src/utils/db";

describe("Database", () => {
  let pgPool: PgPoolInstance;

  beforeAll(async () => {
    pgPool = createPgPoolInstance();
  });

  afterAll(async done => {
    await pgPool.sql`DROP TABLE todo;`;
    await pgPool.sql`DROP TABLE todo2;`;
    pgPool.pool.end();
    done();
  });

  describe("Database Connection", () => {
    describe("SQL Query", () => {
      it("should make queries", async () => {
        const res = await pgPool.sql`SELECT 1+1 AS result;`;
        expect(res).toHaveLength(1);
        expect(res[0].result).toBe(2);
      });

      it("should wrap variables", async () => {
        const one = 1;
        const two = 2;

        const res = await pgPool.sql`SELECT ${one}::INTEGER + ${two}::INTEGER AS result`;
        expect(res).toHaveLength(1);
        expect(res[0].result).toBe(one + two);
      });
    });

    describe("Transaction Query", () => {
      test("should make query", async () => {
        await pgPool.transaction(async sql => {
          await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
          await sql`CREATE TABLE todo (id UUID PRIMARY KEY NOT NULL, value INTEGER NOT NULL);`;
          await sql`INSERT INTO todo (id, value) VALUES (uuid_generate_v4(), 5)`;
          const res = await sql`SELECT * FROM todo LIMIT 1;`;
          expect(res[0].value).toBe(5);
        });
      });

      test("should not save changes if transaction callback fails", async () => {
        await pgPool.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        await pgPool.sql`CREATE TABLE todo2 (id UUID PRIMARY KEY NOT NULL, value INTEGER NOT NULL);`;
        await pgPool.sql`INSERT INTO todo2 (id, value) VALUES (uuid_generate_v4(), 5)`;
        try {
          await pgPool.transaction(async sql => {
            await sql`UPDATE todo2 SET value = 9`;
            throw new Error("fake error");
          });
        } catch (err) {
          expect(err.message).toBe("fake error");
        } finally {
          const res = await pgPool.sql`SELECT * FROM todo2 LIMIT 1;`;
          expect(res[0].value).toBe(5);
        }
      });
    });
  });
});
