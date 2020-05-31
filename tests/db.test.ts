import { createPgPoolInstance, PgPoolInstance } from "../src/utils/db";

describe("Database", () => {
  let pgPool: PgPoolInstance;

  beforeAll(async () => {
    pgPool = createPgPoolInstance();
  });

  afterAll(done => {
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
  });
});
