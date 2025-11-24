import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authGuard";
import { projectService } from "./project.service";

export const listProjects = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const projects = await projectService.list(req.user.id);
  return res.json(projects);
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const project = await projectService.create(req.user.id, req.body);
  return res.status(201).json(project);
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { projectId } = req.params as { projectId: string };
  const project = await projectService.update(req.user.id, projectId, req.body);
  return res.json(project);
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { projectId } = req.params as { projectId: string };
  await projectService.remove(req.user.id, projectId);
  return res.status(204).send();
};

