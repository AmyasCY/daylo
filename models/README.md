# models

Database-backed domain entities live here.

Planned examples:

- `goal.ts`
- `task.ts`
- `time-block.ts`
- `schedule.ts`

Guidelines:

- Keep this layer focused on persistence shape and model definitions
- Share the MongoDB connection from `@/lib/db`
- Avoid placing request validation or scheduling rules here
