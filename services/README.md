# services

Business logic lives here.

Planned examples:

- goal service
- task service
- time block service
- schedule generation service
- re-planning service

Guidelines:

- Orchestrate models, schemas, and scheduling rules here
- Keep Route Handlers thin by delegating business workflows to services
- Prefer pure functions for scheduling logic where possible
