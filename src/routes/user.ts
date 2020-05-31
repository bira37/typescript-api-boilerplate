import express from "express";
import { createUser } from "../controllers";
import { bodyValidator, invoker } from "../middlewares";
import { createUserSchema } from "../validators";

const router = express.Router();

router.post("/createUser", bodyValidator(createUserSchema), invoker(createUser));

export default router;
