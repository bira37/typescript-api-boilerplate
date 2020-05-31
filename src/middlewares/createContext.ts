import { Context } from "../api";
import { PgPoolInstance } from "../utils/db";

export function createContext({ pool, sql, transaction }: PgPoolInstance) {
  return async function (req: any, res: any, next: any) {
    const ctx: Context = {
      user: null,
      pool,
      sql,
      transaction
    };

    req.ctx = ctx;
    next();
  };
}
