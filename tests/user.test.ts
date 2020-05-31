import { randomBytes } from "crypto";
import { Express } from "express";
import faker from "faker";
import { ErrorData } from "../src/api";
import { createApp } from "../src/app";
import { DBUser } from "../src/db";
import { PgPoolInstance } from "../src/utils/db";
import { makeLogin, makeSuperLogin, call } from "./setup";

export function generateValidUser(user: Partial<DBUser> = {}) {
  return {
    username: faker.random.alphaNumeric(10),
    password: faker.internet.password(10),
    email: faker.internet.email(),
    firstName: faker.random.alphaNumeric(),
    lastName: faker.random.alphaNumeric(),
    isSuperUser: false,
    ...user
  };
}

describe("Auth", () => {
  let app: Express;
  let pgPool: PgPoolInstance;
  let session: { sessionId: string; token: string };
  let superSession: { sessionId: string; token: string };

  beforeAll(async () => {
    const databaseName = `testdb_${randomBytes(8).toString("hex")}`;
    const createdApp = await createApp(databaseName);
    app = createdApp.app;
    pgPool = createdApp.pgPool;

    session = await makeLogin(app);
    superSession = await makeSuperLogin(app);
  });

  afterAll(done => {
    pgPool.pool.end();
    done();
  });

  describe("createUser", () => {
    describe("Succesful tests", () => {
      test("should create an user", async () => {
        const user = generateValidUser();
        const { status, data: createdUser } = await call<DBUser>(
          app,
          "/user/createUser",
          user,
          session.token
        );

        expect(status).toBe(200);
        expect(createdUser.username).toBe(user.username);
      });

      test("should create an super user", async () => {
        const user = generateValidUser();
        const { status, data: createdUser } = await call<DBUser>(
          app,
          "/user/createUser",
          { ...user, isSuperUser: true },
          superSession.token
        );

        expect(status).toBe(200);
        expect(createdUser.username).toBe(user.username);
      });
    });

    describe("Unsuccesful tests", () => {
      test("should not create an super user if you are not a super user", async () => {
        const user = generateValidUser();
        const { status, data } = await call<ErrorData>(
          app,
          "/user/createUser",
          { ...user, isSuperUser: true },
          session.token
        );

        expect(status).toBe(400);
        expect(data.error).toBe("You must be a super user to create a super user.");
      });

      test("should not create an user if user already exists", async () => {
        const user = generateValidUser();
        const { status, data } = await call<ErrorData>(
          app,
          "/user/createUser",
          { ...user, username: "test" },
          session.token
        );

        expect(status).toBe(400);
        expect(data.error).toBe("Username already in use.");
      });

      test("should not create an user if some data is invalid", async () => {
        const user = generateValidUser();
        const { status, data } = await call<ErrorData>(
          app,
          "/user/createUser",
          { ...user, password: "123", email: null, username: "abc" },
          session.token
        );

        expect(status).toBe(400);
        expect(data.error).toMatch(/ValidationError/u);
      });
    });
  });
});
