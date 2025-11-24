import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authGuard";
import { userService } from "./user.service";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const profile = await userService.findById(req.user.id);
  return res.json(profile);
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dashboard = await userService.dashboard(req.user.id);
  return res.json(dashboard);
};

