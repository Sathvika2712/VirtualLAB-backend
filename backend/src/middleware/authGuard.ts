import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appEnv } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authGuard = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    type JwtPayload = NonNullable<AuthenticatedRequest["user"]>;
    const payload = jwt.verify(token, appEnv.jwtSecret) as JwtPayload;
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

