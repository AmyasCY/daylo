# Daylo

Daylo is a single-user daily planning app. The goal of the MVP is to help a user turn goals, tasks, and available time blocks into a workable schedule for today, explain why that schedule was chosen, and support lightweight re-planning from feedback.

## MVP Scope

- Manage goals and tasks
- Record available time blocks for the day
- Generate a daily schedule
- Show readable reasoning for the schedule
- Re-plan based on simple user feedback

## Current Status

This repository is in the foundation stage. The project already has Daylo-specific site metadata, core infrastructure, initial domain modeling, and the first Goals API route, but the user-facing MVP is still under construction.

Implemented so far:

- Daylo landing page and site metadata
- `.env.example` with the initial `MONGODB_URI` requirement
- Reusable MongoDB / Mongoose connection helper
- Shared API success/error response helpers
- Mongoose models for `Goal`, `Task`, and `Schedule`
- Embedded schemas for `TimeBlock`, task assignments, and schedule feedback
- Zod input schemas for Goal, Task, and Schedule create/update flows
- Model relationship documentation in `docs/model-graph.md`
- `POST /api/goals` for creating goals
- `GET /api/health/db` for checking the database connection layer

What is not implemented yet:

- Goal list/detail/update/delete APIs
- Task CRUD APIs
- Schedule generation logic
- Reasoning and re-planning flows
- User-facing management pages for goals, tasks, and schedules

## Tech Stack

- Next.js `16.2.3`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- ESLint `^9`

## Project Structure

- `app/`: App Router pages and global styles
- `app/api/`: Route Handlers for server-side HTTP endpoints
- `lib/`: shared infrastructure and utilities, including the database entry point
- `models/`: persistence models and database-facing entity definitions
- `schemas/`: runtime validation and request/response contracts
- `services/`: business logic for goals, tasks, scheduling, and re-planning
- `memory_bank/`: project notes, goals, constraints, and active task context
- `public/`: static assets

Module boundaries:

- Frontend UI belongs in `app/`
- API endpoints belong in `app/api/`
- Validation belongs in `schemas/`
- Business workflows belong in `services/`
- Database connection and shared infrastructure belong in `lib/`
- Persistence models belong in `models/`

## Local Development

### Prerequisites

- Node.js 20+ recommended
- npm
- Docker Desktop or another Docker runtime for the included MongoDB setup
- Or a separate MongoDB connection string you can use for development

### Install dependencies

```bash
npm install
```

### Create your local env file

```bash
cp .env.example .env.local
```

The default `MONGODB_URI` in `.env.example` already matches the Docker Compose setup in this repo, so you can usually leave it as-is for local development.

### Start MongoDB with Docker

```bash
docker compose up -d
```

This starts a local MongoDB container on `127.0.0.1:27017` and stores database files in the named Docker volume `daylo-mongodb-data`.

To stop it later:

```bash
docker compose down
```

To stop it and remove the persisted database volume too:

```bash
docker compose down -v
```

### Start the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Verify the database connection

With the Docker container and dev server running, visit [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db).

You should get a JSON response showing the connected database name, host, and Mongoose ready state.

### Quality checks

```bash
npm run lint
```

### Local tests

Run the current unit and route-validation tests with:

```bash
npm run test
```

For watch mode while developing:

```bash
npm run test:watch
```

The first test batch focuses on stable, fast feedback:

- schema validation and input normalization
- API response envelope helpers
- goal serialization
- route-level validation paths that should fail before any database call

## Environment Variables

The app does not read environment variables in code yet, but the project now defines the first required variable for the upcoming database layer.

- `MONGODB_URI`: MongoDB connection string for local development and future server-side database access

Notes:

- Keep secrets in `.env.local`, not in source control
- `mongodb://127.0.0.1:27017/daylo` is the correct value when the Next.js app runs on your host machine and MongoDB runs through this repo's Docker Compose file
- If you later run the app inside Docker too, `127.0.0.1` will no longer point at MongoDB; use the Compose service name instead
- In this Next.js App Router project, non-`NEXT_PUBLIC_` variables stay server-only
- Only prefix a variable with `NEXT_PUBLIC_` if it truly needs to be exposed to the browser

## Database Connection Layer

The repo now includes a reusable Mongoose connection helper in `lib/db.ts`.

- Connection instances are cached on `globalThis` to avoid duplicate connections during hot reload in development
- The helper is server-only and intended for Route Handlers, Server Components, and future service-layer code
- A simple health check route is available at `/api/health/db`

## API Response Format

Route Handlers should return a consistent JSON envelope:

- Success: `{ ok: true, data: ... }`
- Error: `{ ok: false, error: { code, message } }`

The shared helpers live in `lib/api-response.ts`.

## Product Direction

Daylo is intentionally narrow for the first version:

- Single-user only
- Daily planning only
- Rule-based reasoning first
- Simple feedback-driven re-planning before any agent-style workflow

## Notes For Contributors

- This project uses a newer Next.js version with local guidance in `AGENTS.md`.
- Before making framework-level changes, read the relevant docs in `node_modules/next/dist/docs/`.
