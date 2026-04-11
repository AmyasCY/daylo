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
