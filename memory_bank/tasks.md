# Epic 1: Foundation
Initialize project fundamentals
- [x] Update site title, description, and homepage placeholder content
- [x] Replace default README; add project goals, tech stack, and startup instructions
Specify environment variable requirements
- [x] Configure env vars and example files
- [x] Add `.env.example`
- [x] Define base variables including `MONGODB_URI`
- [x] Add local development instructions
Build database connection layer
- [x] Implement MongoDB/Mongoose connection reuse
- [x] Resolve duplicate hot-reload connections in dev
- [x] Provide unified database entry
Define base directories and module boundaries
- [x] Establish minimal structure: `models`, `schemas`, `services`, `lib`
- [x] Clarify responsibilities for frontend, API, and AI/services
- [x] Align with existing Next.js App Router structure
Standardize API response format
- [x] Define success/error response structure
- [x] Unify error message format
- [x] Encapsulate base response utilities

# Epic 2: Domain Modeling
- [x] Design Goal data model
  - [x] Fields: name, description, status, priority, etc.
  - [x] Support core CRUD attributes
  - [x] Define task relationship
- [x] Design Task data model
  - [x] Fields: title, description, deadline, estimatedDuration, priority, status
  - [x] Support optional goal association
  - [x] Define minimal executable task structure
- [x] Design Schedule data model
  - [x] Store daily schedules
  - [x] Include time blocks, task assignments, reasoning
  - [x] Reserve feedback fields for future re-planning
- [x] Design TimeBlock structure
  - [x] Represent user available time slots
  - [x] Support start/end time and availability description
  - [x] Clarify standalone or embedded model
Write Zod validation schemas
  - [x] Create schemas for Goal, Task, Schedule inputs
  - [x] Distinguish create/update scenarios
  - [x] Align frontend/backend validation rules

# Documentation
- [x] Document current implemented model graph
  - [x] Add Mermaid diagram for Goal, Task, Schedule, and TimeBlock structures
  - [x] Save model relationship notes in `docs/model-graph.md`
