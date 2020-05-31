import express from "express";
import { login } from "../controllers";
import { bodyValidator, invoker } from "../middlewares";
import { loginSchema } from "../validators";

const router = express.Router();

router.post("/login", bodyValidator(loginSchema), invoker(login));

export default router;
