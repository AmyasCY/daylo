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
- [x] Sync project documentation with current implementation progress
  - [x] Update README current status to match implemented infrastructure and APIs
  - [x] Refresh `memory_bank/progress.md` summary and remaining work
- [x] Add a Docker-based local MongoDB workflow
  - [x] Commit a minimal `docker-compose.yml` for MongoDB
  - [x] Document Docker startup, shutdown, and connection verification in `README.md`
- [x] Add a minimal local test workflow
  - [x] Add a project test command and Vitest config
  - [x] Add initial unit tests for schemas and shared helpers
  - [x] Document local test commands in `README.md`

# Epic 3: Goals CRUD
- [x] Implement Goal creation API
  - [x] Validate requests
  - [x] Write to database
  - [x] Return standardized responses
- [x] Implement Goal list API
  - [x] Fetch all goals
  - [x] Maintain stable response structure
- [x] Implement Goal detail API
  - [x] Query goal by ID
  - [x] Handle non-existent cases
- [x] Implement Goal update API
  - [x] Support partial field updates
  - [x] Add input validation
- [x] Implement Goal deletion API
  - [x] Handle success and missing cases
  - [x] Define impact policy on related tasks
- [x] Implement Goals management page
  - [x] Display list
  - [x] Support add, edit, delete
  - [x] Keep UI clean and usable

# Epic 4: Tasks CRUD
- [x] Implement Task creation API
  - [x] Support optional `goalId`
  - [x] Validate deadline, estimatedDuration, priority, status
- [x] Implement Task list API
  - [x] Fetch basic list
  - [x] Support filtering by status or goal association
- [x] Implement Task detail API
  - [x] Return full task info
  - [x] Include related goal data
- [x] Implement Task update API
  - [x] Support status and basic field edits
  - [x] Maintain partial update capability
- [x] Implement Task deletion API
  - [x] Delete task and return standardized response
  - [x] Handle missing cases
- [x] Implement Tasks management page
  - [x] Display task list
  - [x] Support create, edit, delete
  - [x] Allow setting deadline, duration, priority, status, goal

# Epic 5: Scheduling MVP
- Define schedule generation I/O contract
  - Input: tasks, time blocks, goal relations
  - Output: time-block schedule and reasoning
  - Clarify service-layer interface
- Implement task priority scoring rules
  - Integrate deadline urgency
  - Incorporate task priority
  - Factor in goal alignment
  - Output interpretable ranking logic
- Implement time-block assignment algorithm
  - Assign tasks to available slots
  - Avoid time conflicts
  - Handle unassignable tasks
- Implement schedule generation service
  - Chain sorting, assignment, conflict resolution
  - Return complete schedule object
  - Keep logic independent of UI and route handlers
- Implement reasoning generation
  - Explain task prioritization
  - Explain time slot selection
  - Generate text via rule-based logic
- Implement schedule generation API
  - Accept input and invoke service
  - Save schedule results
  - Return time blocks and reasoning

# Epic 6: Schedule UI
- Implement available time-block input UI
  - Let users configure daily available time
  - Support add/remove time slots
  - Basic form validation
- Implement schedule generation form page
  - Select task range or default to all incomplete tasks
  - Configure daily time blocks
  - Submit generation request
- Implement schedule display page
  - Show time blocks
  - Display assigned tasks
  - Support reasoning view
- Optimize schedule readability
  - Distinguish free/assigned slots
  - Highlight deadline/priority info
  - Ensure mobile readability

# Epic 7: Re-planning MVP
- Define feedback input format
  - Examples: too full, prioritize task, deep work in morning
  - Build simple parsable feedback structure
- Implement re-planning service
  - Adjust based on existing schedule
  - Support re-sorting and re-assignment via feedback
  - Preserve original schedule for reference
- Implement re-plan API
  - Accept `scheduleId` and feedback
  - Invoke re-planning logic
  - Return new schedule and reasoning
- Implement schedule feedback UI
  - User input feedback
  - Trigger re-plan
  - Display updated schedule

# Epic 8: Quality & Polish
- Add base loading/error/empty states
  - Error prompts for CRUD pages
  - Schedule generation failure alerts
  - Empty state placeholders
- Add basic testing
  - [x] Plan test entry if full framework not yet added
  - [x] Add the initial local test runner setup
  - [x] Add route validation coverage for Task CRUD
  - [x] Add serializer coverage for task response shaping
  - Cover core schedule sorting/assignment logic
  - Cover key pure service functions
- Clean up default boilerplate
  - Remove Next.js default icons and text
  - Replace with project-specific content
- Final acceptance and documentation
  - Run lint checks
  - Update README with features and roadmap
  - Document known MVP limitations
