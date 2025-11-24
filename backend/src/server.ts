import { buildApp } from "./app";
import { appEnv } from "./config/env";
import { logger } from "./lib/logger";

const app = buildApp();

app.listen(appEnv.port, () => {
  logger.info(`🚀 VirtualLAB API running on port ${appEnv.port}`);
});

