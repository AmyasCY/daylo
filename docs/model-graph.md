# Model Graph

This document reflects the model designs currently implemented in the codebase.

Source files:
- `models/goal.ts`
- `models/task.ts`
- `models/schedule.ts`
- `models/time-block.ts`

## Mermaid Diagram

```mermaid
classDiagram
direction LR

class Goal {
  ObjectId _id
  string name
  string description
  string status
  string priority
  Date targetDate
  Date createdAt
  Date updatedAt
}

class Task {
  ObjectId _id
  ObjectId goalId
  string title
  string description
  Date deadline
  number estimatedDurationMinutes
  string priority
  string status
  Date completedAt
  Date createdAt
  Date updatedAt
}

class Schedule {
  ObjectId _id
  Date scheduleDate
  string reasoningSummary
  TimeBlock[] timeBlocks
  ScheduleFeedback[] feedbackNotes
  Date createdAt
  Date updatedAt
}

class TimeBlock {
  Date startAt
  Date endAt
  string availabilityDescription
  ScheduleTaskAssignment[] assignments
}

class ScheduleTaskAssignment {
  ObjectId taskId
  string titleSnapshot
  Date startAt
  Date endAt
  string reasoning
}

class ScheduleFeedback {
  Date submittedAt
  string note
}

Goal "1" <-- "0..*" Task : goalId
Schedule "1" *-- "0..*" TimeBlock : embeds
TimeBlock "1" *-- "0..*" ScheduleTaskAssignment : embeds
Schedule "1" *-- "0..*" ScheduleFeedback : embeds
Task "1" <-- "0..*" ScheduleTaskAssignment : taskId
Goal ..> Task : virtual tasks[]
Task ..> Goal : virtual goal
```

## Notes

- `Goal`, `Task`, and `Schedule` are top-level Mongoose models.
- `TimeBlock`, `ScheduleTaskAssignment`, and `ScheduleFeedback` are embedded schemas rather than standalone collections.
- `Task.goalId` is optional, so a task can exist without a related goal.
- `ScheduleTaskAssignment.titleSnapshot` preserves the task title at scheduling time.
