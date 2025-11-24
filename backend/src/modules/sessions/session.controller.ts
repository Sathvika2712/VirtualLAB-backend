import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authGuard";
import { sessionService } from "./session.service";

export const listSessions = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const sessions = await sessionService.list(req.user.id);
  return res.json(sessions);
};

export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const session = await sessionService.start(req.user.id, req.body);
  return res.status(201).json(session);
};

export const stopSession = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { sessionId } = req.params as { sessionId: string };
  const session = await sessionService.stop(req.user.id, sessionId);
  return res.json(session);
};

