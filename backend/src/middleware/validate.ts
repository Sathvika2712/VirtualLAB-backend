import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(422).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    const { body, params, query } = result.data as {
      body: Record<string, unknown>;
      params: Record<string, unknown>;
      query: Record<string, unknown>;
    };

    Object.assign(req.body, body);
    Object.assign(req.params, params);
    Object.assign(req.query as unknown as Record<string, unknown>, query);

    return next();
  };

