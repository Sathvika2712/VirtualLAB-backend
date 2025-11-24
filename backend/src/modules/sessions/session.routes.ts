import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { validate } from "../../middleware/validate";
import { createSessionSchema, sessionIdSchema } from "./session.schema";
import { listSessions, startSession, stopSession } from "./session.controller";

const router = Router();

router.use(authGuard);
router.get("/", listSessions);
router.post("/", validate(createSessionSchema), startSession);
router.post("/:sessionId/stop", validate(sessionIdSchema), stopSession);

export const sessionRoutes = router;

