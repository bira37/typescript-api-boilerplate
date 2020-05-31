import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../schemas/auth";

export function auth() {
  return async function (req: any, res: any, next: any) {
    try {
      const token = req.headers["x-access-token"];

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET ?? "secret");
        req.ctx.user = (
          await req.ctx.sql`SELECT * FROM users WHERE id = ${
            (decodedToken as TokenPayload).userId
          } AND "deletedAt" IS NULL;`
        )[0];
        next();
      } catch (err) {
        throw new Error("You are not authenticated.");
      }
    } catch (err) {
      res.status(400).send({ data: { error: err.message } });
    }
  };
}
