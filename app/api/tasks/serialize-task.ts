type SerializableTaskGoal = {
  id: string;
  name: string;
  status: string;
  priority: string;
};

type SerializableTask = {
  id: string;
  goalId: string | null;
  title: string;
  description: string;
  deadline?: Date | null;
  estimatedDurationMinutes: number;
  priority: string;
  status: string;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  goal?: SerializableTaskGoal | null;
};

export function serializeTask(task: SerializableTask) {
  return {
    id: task.id,
    goalId: task.goalId ?? null,
    title: task.title,
    description: task.description,
    deadline: task.deadline ?? null,
    estimatedDurationMinutes: task.estimatedDurationMinutes,
    priority: task.priority,
    status: task.status,
    completedAt: task.completedAt ?? null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    goal: task.goal ?? null,
  };
}
