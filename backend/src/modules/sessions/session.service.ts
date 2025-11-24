import { TerminalSession } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/errorHandler";
import { TerminalDistro } from "../shared/domain";

const buildConnectionUrl = (sessionId: string, distro: TerminalDistro) =>
  `wss://terminals.virtualab.dev/${distro.toLowerCase()}/${sessionId}`;

const normalizeSession = (session: TerminalSession) => ({
  ...session,
  metadata: session.metadata ? JSON.parse(session.metadata) : null,
});

export const sessionService = {
  list: async (userId: string) => {
    const sessions = await prisma.terminalSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    });
    return sessions.map(normalizeSession);
  },

  start: async (
    userId: string,
    payload: { distro: TerminalDistro; projectId?: string; entryCommand?: string },
  ) => {
    if (payload.projectId) {
      const project = await prisma.project.findUnique({ where: { id: payload.projectId } });
      if (!project || project.ownerId !== userId) {
        throw new ApiError(404, "Project not found for user");
      }
    }

    const session = await prisma.terminalSession.create({
      data: {
        distro: payload.distro,
        entryCommand: payload.entryCommand ?? null,
        userId,
        projectId: payload.projectId ?? null,
        status: "PROVISIONING",
        metadata: JSON.stringify({
          hints: ["Mount volumes", "Install dependencies", "Persist outputs"],
        }),
      },
    });

    // For now we immediately mark the session as ready
    const readySession = await prisma.terminalSession.update({
      where: { id: session.id },
      data: {
        status: "READY",
        connectionUrl: buildConnectionUrl(session.id, payload.distro),
      },
    });
    return normalizeSession(readySession);
  },

  stop: async (userId: string, sessionId: string) => {
    const session = await prisma.terminalSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) {
      throw new ApiError(404, "Session not found");
    }
    const updated = await prisma.terminalSession.update({
      where: { id: sessionId },
      data: {
        status: "STOPPED",
        endedAt: new Date(),
      },
    });
    return normalizeSession(updated);
  },
};

