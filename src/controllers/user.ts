import bcrypt from "bcrypt";
import { Context } from "../api";
import { DBUser } from "../db";
import { UserCreation } from "../schemas/user";

/**
 * @function createUser
 * @summary creates and return the user
 * @param {UserCreation} args
 * @returns {DBUser}
 */
export const createUser = async (
  ctx: Context,
  { username, password, email, firstName, lastName, isSuperUser }: UserCreation
): Promise<DBUser> => {
  if ((!ctx.user || !ctx.user.isSuperUser) && isSuperUser) {
    throw new Error("You must be a super user to create a super user.");
  }

  const [
    existingUser
  ] = await ctx.sql`SELECT * FROM users WHERE username = ${username} AND "deletedAt" IS NULL;`;

  if (existingUser) {
    throw new Error("Username already in use.");
  }

  const pwdHash = await bcrypt.hash(password, await bcrypt.genSalt());

  const [createdUser] = await ctx.sql`
    INSERT INTO users (username, password, email, "firstName", "lastName", "isSuperUser")
    VALUES 
      (${username}, ${pwdHash}, ${email}, ${firstName}, ${lastName}, ${isSuperUser})
    RETURNING 
      *
  ;`;

  return createdUser;
};
