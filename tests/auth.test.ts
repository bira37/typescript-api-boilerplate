import { randomBytes } from "crypto";
import { Express } from "express";
import request from "supertest";
import { ErrorData } from "../src/api";
import { createApp } from "../src/app";
import { UserLoginReturn } from "../src/schemas/auth";
import { PgPoolInstance } from "../src/utils/db";

describe("Auth", () => {
  let app: Express;
  let pgPool: PgPoolInstance;

  beforeAll(async () => {
    const databaseName = `testdb_${randomBytes(8).toString("hex")}`;
    const createdApp = await createApp(databaseName);
    app = createdApp.app;
    pgPool = createdApp.pgPool;
  });

  afterAll(done => {
    pgPool.pool.end();
    done();
  });

  describe("login", () => {
    describe("Succesful tests", () => {
      test("should login as normal user", async () => {
        const { body } = await request(app)
          .post("/auth/login")
          .send({ username: "test", password: "test" });

        const data: UserLoginReturn = body.data;

        expect(data.token).toBeTruthy();
        expect(data.sessionId).toBeTruthy();
      });

      test("should login as super user", async () => {
        const { body } = await request(app)
          .post("/auth/login")
          .send({ username: "supertest", password: "test" });

        const data: UserLoginReturn = body.data;

        expect(data.token).toBeTruthy();
        expect(data.sessionId).toBeTruthy();
      });
    });

    describe("Unsuccesful tests", () => {
      test("should not login with wrong username", async () => {
        const { status, body } = await request(app)
          .post("/auth/login")
          .send({ username: "super", password: "test" });

        expect(status).toBe(400);

        const data: ErrorData = body.data;

        expect(data.error).toBe("Username does not exist.");
      });

      test("should not login with wrong password", async () => {
        const { status, body } = await request(app)
          .post("/auth/login")
          .send({ username: "test", password: "tset" });

        expect(status).toBe(400);

        const data: ErrorData = body.data;

        expect(data.error).toBe("Wrong password.");
      });
    });
  });
});
