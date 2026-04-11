# Daylo

Daylo is a single-user daily planning app. The goal of the MVP is to help a user turn goals, tasks, and available time blocks into a workable schedule for today, explain why that schedule was chosen, and support lightweight re-planning from feedback.

## MVP Scope

- Manage goals and tasks
- Record available time blocks for the day
- Generate a daily schedule
- Show readable reasoning for the schedule
- Re-plan based on simple user feedback

## Current Status

This repository is in the foundation stage. The project now has Daylo-specific site metadata and landing content, but core business features are still being built.

What is not implemented yet:

- Database connection and persistence
- Domain models for goals, tasks, schedules, and time blocks
- CRUD APIs
- Scheduling logic
- Reasoning and re-planning flows

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
- MongoDB running locally or a MongoDB connection string you can use for development

### Install dependencies

```bash
npm install
```

### Create your local env file

```bash
cp .env.example .env.local
```

Set `MONGODB_URI` in `.env.local` to your local or hosted MongoDB instance.

### Start the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
```

## Environment Variables

The app does not read environment variables in code yet, but the project now defines the first required variable for the upcoming database layer.

- `MONGODB_URI`: MongoDB connection string for local development and future server-side database access

Notes:

- Keep secrets in `.env.local`, not in source control
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
