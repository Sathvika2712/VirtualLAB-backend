import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { getDashboard, getProfile } from "./user.controller";

const router = Router();

router.get("/me", authGuard, getProfile);
router.get("/dashboard", authGuard, getDashboard);

export const userRoutes = router;

