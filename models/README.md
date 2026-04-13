# models

Database-backed domain entities live here.

Current contents:

- `goal.ts`: Goal model with status, priority, timestamps, and a virtual task relationship
- `task.ts`: Task model with scheduling fields and an optional Goal reference
- `schedule.ts`: Daily schedule model with embedded time blocks, task assignments, reasoning, and feedback placeholders
- `time-block.ts`: Shared embedded TimeBlock schema for user availability windows and scheduled assignments

Guidelines:

- Keep this layer focused on persistence shape and model definitions
- Share the MongoDB connection from `@/lib/db`
- Avoid placing request validation or scheduling rules here
