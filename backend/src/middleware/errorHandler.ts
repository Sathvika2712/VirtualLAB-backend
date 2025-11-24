import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const notFoundHandler = (_: Request, res: Response) =>
  res.status(404).json({ message: "Route not found" });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const isApiError = err instanceof ApiError;
  const status = isApiError ? err.statusCode : 500;
  const payload = {
    message: err.message ?? "Internal server error",
    ...(isApiError && err.details ? { details: err.details } : {}),
  };

  if (!isApiError) {
    logger.error("Unhandled error", err);
  }

  res.status(status).json(payload);
};

