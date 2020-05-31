import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { Context } from "../api";
import { UserLogin, UserLoginReturn, TokenPayload } from "../schemas/auth";

/**
 * @function login
 * @summary verify the user credentials and return an session token id
 * @param {Context} ctx
 * @param {UserLogin} args
 * @returns {UserLoginReturn} an token id and a session id
 */
export const login = async (
  ctx: Context,
  { username, password }: UserLogin
): Promise<UserLoginReturn> => {
  const [
    user
  ] = await ctx.sql`SELECT * FROM users WHERE username = ${username} AND "deletedAt" IS NULL;`;

  if (!user) {
    throw new Error("Username does not exist.");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Wrong password.");
  }

  const payload: TokenPayload = {
    userId: user.id
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET ?? "secret", {
    expiresIn: process.env.JWT_EXPIRATION ?? "5m"
  });

  return {
    token,
    sessionId: uuid()
  };
};
