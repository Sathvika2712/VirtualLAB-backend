import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { projectRoutes } from "../modules/projects/project.routes";
import { sessionRoutes } from "../modules/sessions/session.routes";
import { userRoutes } from "../modules/users/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/sessions", sessionRoutes);

export const apiRoutes = router;

