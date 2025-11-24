import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.schema";
import { login, register } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export const authRoutes = router;

