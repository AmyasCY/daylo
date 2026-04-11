# AGENTS.md

## Product context
### Core Concept
This is an AI scheduling assistant focused on generating daily schedule according to personal goals.

The system must:
- Link tasks to goals
- Generate a daily schedule automatically
- Provide clear reasoning for decisions
- Support dynamic re-planning

### Core Features (MVP Scope Only)
1. Goal Management
+ CRUD
+ Decompose goals into tasks
2. Task Management
+ CRUD
+ Tasks are not required to be linked to goals
+ Optional fields: deadline, estimated duration, priority, status
3. Schedule Generation (Core Logic)
Input: tasks, deadlines, priorities, user constraints (available time blocks)
Output: a time-blocked daily schedule
Requirements:
+ Prioritize tasks based on: deadline urgency, importance, goal alignment
+ assign tasks into available time slots
+ avoid conflicts
4. AI Reasoning (Critical Requirement)
For each schedule, generate explanation:
- why tasks are prioritised
- why assigned to specific time slots
5. Dynamic Re-planning
The system allows users to provide feedback on generated schedules, triggering an automatic re-planning and adjustment process.
6. Schedule View:
Display:
+ time blocks
+ task info
+ optional reasoning

## System Constraints
- Keep architecture simple and modular
- Seperate:
+ frontend
+ backend API
+ AI logic (service layer)

## Tech stack
- Next.js App Router + TypeScript
- MongoDB / Mongoose
- Tailwind
- Zod for validation

## Engineering rules
- Make minimal, high-confidence changes
- Reuse existing patterns before introducing new abstractions
- Keep API response format consistent
- Prefer server actions or route handlers only when aligned with current structure
- Do not change folder structure unless necessary
- Add comments only where logic is non-obvious

## Quality checks
- Run lint before finishing
- If tests exist, run relevant tests
- Summarize changed files and any follow-up risks

## When task is ambiguous
- Propose a short plan first
- State assumptions explicitly

## Expected Output from You
When implementing features:
Provide:
+ clean code
+ clear structure
+ minimal but sufficient comments
Prefer:
+ incremental steps
+ small, testable components


