import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("4000"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment configuration", env.error.flatten().fieldErrors);
  process.exit(1);
}

export const appEnv = {
  nodeEnv: env.data.NODE_ENV,
  port: Number(env.data.PORT),
  jwtSecret: env.data.JWT_SECRET,
  jwtExpiresIn: env.data.JWT_EXPIRES_IN,
};

