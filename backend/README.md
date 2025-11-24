# VirtualLAB Backend

This service powers the VirtualLAB platform: a cloud-first terminal simulator where students can spin up Ubuntu, Kali, Fedora, or Debian shells, manage their projects, and keep track of active sessions.

## Stack

- Node.js + Express + TypeScript
- Prisma ORM with SQLite by default (swap `DATABASE_URL` for Postgres/MySQL in production)
- JWT authentication, Zod validation, centralized error handling

## Getting started

```bash
cp .env.example .env        # or create your own, see below
npm install
npx prisma migrate dev
npm run dev
```

### Required environment variables

```
NODE_ENV=development
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-secret"
JWT_EXPIRES_IN="1d"
```

## Available scripts

- `npm run dev` – start the API with automatic reload
- `npm run build` – compile TypeScript to `dist`
- `npm start` – run the compiled server
- `npm run lint` – type-check the project

## API surface

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a user and issue a JWT |
| POST | `/api/auth/login` | Authenticate an existing user |
| GET | `/api/users/me` | Fetch the authenticated profile |
| GET | `/api/users/dashboard` | List projects and recent sessions |
| GET/POST/PUT/DELETE | `/api/projects` | CRUD project workspace metadata |
| GET/POST | `/api/sessions` | List or start terminal sessions |
| POST | `/api/sessions/:sessionId/stop` | Gracefully stop a running session |

> All `/api/users`, `/api/projects`, and `/api/sessions` endpoints require the `Authorization: Bearer <token>` header.

## Terminal orchestration notes

The `sessionService` showcases how to:

1. Validate project ownership.
2. Create a new `TerminalSession` with `PROVISIONING` status.
3. Generate a synthetic WebSocket URL (where a real orchestrator would attach).
4. Mark the session as `READY`, or transition to `FAILED/STOPPED` when needed.

In production you can swap the stubbed logic with integrations to:

- Docker Engine / Firecracker / Kubernetes jobs
- Cloud-hosted PTY providers
- Remote desktop or SSH gateways

Each session record keeps `metadata` JSON so you can persist provider-specific details.

## Testing the flow

1. Register and log in to obtain a JWT.
2. Use the token to create projects.
3. Start sessions pointing to a project and a distro.
4. Poll `/api/sessions` to see current state or stop a session.

This backend is intentionally modular to make it easy to plug into the existing frontend that your teammate is building.

