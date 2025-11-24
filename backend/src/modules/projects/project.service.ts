import { Prisma, Project } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { ProjectStatus } from "../shared/domain";

type ProjectWithTags = Omit<Project, "tags"> & { tags: string[] };

const parseTags = (raw?: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const serializeTags = (tags?: string[]) => (tags ? JSON.stringify(tags) : null);

const normalizeTags = (record: Project): ProjectWithTags => ({
  ...record,
  tags: parseTags(record.tags),
});

export const projectService = {
  list: async (userId: string): Promise<ProjectWithTags[]> => {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
    });
    return projects.map((project: Project) => normalizeTags(project));
  },

  create: async (
    userId: string,
    payload: { name: string; description?: string; repoUrl?: string; tags?: string[] },
  ): Promise<ProjectWithTags> => {
    const project = await prisma.project.create({
      data: {
        name: payload.name,
        description: payload.description ?? null,
        repoUrl: payload.repoUrl ?? null,
        tags: serializeTags(payload.tags),
        ownerId: userId,
      },
    });
    return normalizeTags(project);
  },

  update: async (
    userId: string,
    projectId: string,
    data: { name?: string; description?: string | null; repoUrl?: string | null; status?: ProjectStatus; tags?: string[] },
  ): Promise<ProjectWithTags> => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ownerId !== userId) {
      throw new ApiError(404, "Project not found");
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
        tags: data.tags ? serializeTags(data.tags) : project.tags,
        description: data.description ?? project.description,
        repoUrl: data.repoUrl ?? project.repoUrl,
      },
    });
    return normalizeTags(updated);
  },

  remove: async (userId: string, projectId: string) => {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ownerId !== userId) {
      throw new ApiError(404, "Project not found");
    }

    await prisma.project.delete({ where: { id: projectId } });
  },
};

