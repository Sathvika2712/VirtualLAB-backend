import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { validate } from "../../middleware/validate";
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "./project.schema";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "./project.controller";

const router = Router();

router.use(authGuard);

router.get("/", listProjects);
router.post("/", validate(createProjectSchema), createProject);
router.put("/:projectId", validate(updateProjectSchema), updateProject);
router.delete("/:projectId", validate(projectIdSchema), deleteProject);

export const projectRoutes = router;

