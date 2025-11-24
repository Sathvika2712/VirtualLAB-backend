import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const userService = {
  create: async (params: { email: string; passwordHash: string; fullName: string }) =>
    prisma.user.create({
      data: {
        email: params.email,
        passwordHash: params.passwordHash,
        fullName: params.fullName,
      },
    }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    }),

  dashboard: (userId: string) =>
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        projects: {
          orderBy: { updatedAt: "desc" },
        },
        sessions: {
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
    }),
};

export type UserSummary = Awaited<ReturnType<typeof userService.findById>>;

