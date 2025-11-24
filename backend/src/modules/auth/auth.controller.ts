import { Request, Response } from "express";
import { authService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return res.json(result);
};

