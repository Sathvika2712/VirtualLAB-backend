import cors from "cors";
import express from "express";
import helmet from "helmet";
import { appEnv } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRoutes } from "./routes";

export const buildApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) =>
    res.json({
      status: "ok",
      env: appEnv.nodeEnv,
      timestamp: Date.now(),
    }),
  );

  app.use("/api", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

