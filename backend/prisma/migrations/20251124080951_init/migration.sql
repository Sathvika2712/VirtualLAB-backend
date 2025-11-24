-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "repoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT,
    "lastRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("createdAt", "description", "id", "lastRunAt", "name", "ownerId", "repoUrl", "status", "tags", "updatedAt") SELECT "createdAt", "description", "id", "lastRunAt", "name", "ownerId", "repoUrl", "status", "tags", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_TerminalSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "distro" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROVISIONING',
    "entryCommand" TEXT,
    "connectionUrl" TEXT,
    "metadata" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "TerminalSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TerminalSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TerminalSession" ("connectionUrl", "distro", "endedAt", "entryCommand", "id", "metadata", "projectId", "startedAt", "status", "userId") SELECT "connectionUrl", "distro", "endedAt", "entryCommand", "id", "metadata", "projectId", "startedAt", "status", "userId" FROM "TerminalSession";
DROP TABLE "TerminalSession";
ALTER TABLE "new_TerminalSession" RENAME TO "TerminalSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
