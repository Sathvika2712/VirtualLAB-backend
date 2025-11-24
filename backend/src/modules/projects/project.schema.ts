import { z } from "zod";
import { PROJECT_STATUSES } from "../shared/domain";

const base = {
  name: z.string().min(3),
  description: z.string().max(500).optional(),
  repoUrl: z.string().url().optional(),
  tags: z.array(z.string()).max(10).optional(),
};

export const createProjectSchema = z.object({
  body: z.object(base),
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: z.string().cuid(),
  }),
  body: z.object({
    ...base,
    status: z.enum(PROJECT_STATUSES).optional(),
  }),
});

export const projectIdSchema = z.object({
  params: z.object({
    projectId: z.string().cuid(),
  }),
});

