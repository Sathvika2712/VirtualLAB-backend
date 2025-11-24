import { z } from "zod";
import { TERMINAL_DISTROS } from "../shared/domain";

export const createSessionSchema = z.object({
  body: z.object({
    distro: z.enum(TERMINAL_DISTROS),
    projectId: z.string().cuid().optional(),
    entryCommand: z.string().optional(),
  }),
});

export const sessionIdSchema = z.object({
  params: z.object({
    sessionId: z.string().cuid(),
  }),
});

