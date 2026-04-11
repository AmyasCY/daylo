# lib

Shared infrastructure and cross-cutting utilities live here.

Current contents:

- `api-response.ts`: typed helpers for standard API success and error payloads
- `db.ts`: server-only MongoDB / Mongoose connection helper

Planned examples:

- environment helpers
- API response helpers
- date and scheduling utilities

Guidelines:

- Put reusable infrastructure here, not feature-specific business logic
- Keep browser-safe utilities separate from server-only modules
