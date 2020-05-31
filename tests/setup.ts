import dotenv from "dotenv";
import { Express } from "express";
import request from "supertest";

dotenv.config();

afterAll(done => {
  done();
});

export async function makeSuperLogin(app: Express): Promise<{ sessionId: string; token: string }> {
  const { status, body } = await request(app)
    .post("/auth/login")
    .send({ username: "supertest", password: "test" });

  if (status !== 200) {
    throw new Error(`TEST ERROR: ${body.data.message}`);
  }

  return { sessionId: body.data.sessionId, token: body.data.token };
}

export async function makeLogin(app: Express): Promise<{ sessionId: string; token: string }> {
  const { status, body } = await request(app)
    .post("/auth/login")
    .send({ username: "test", password: "test" });

  if (status !== 200) {
    throw new Error(`TEST ERROR: ${body.data.message}`);
  }

  return { sessionId: body.data.sessionId, token: body.data.token };
}

export async function call<T>(
  app: Express,
  endpoint: string,
  params: object,
  authToken = ""
): Promise<{ status: number; data: T }> {
  const { status, body } = await request(app)
    .post(endpoint)
    .set("x-access-token", authToken)
    .send(params);

  return { status, data: body.data };
}
