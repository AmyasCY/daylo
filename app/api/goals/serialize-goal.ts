type SerializableGoal = {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  targetDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeGoal(goal: SerializableGoal) {
  return {
    id: goal.id,
    name: goal.name,
    description: goal.description,
    status: goal.status,
    priority: goal.priority,
    targetDate: goal.targetDate ?? null,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}
