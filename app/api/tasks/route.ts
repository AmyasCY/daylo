import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { GoalModel } from "@/models/goal";
import { TaskModel } from "@/models/task";
import { objectIdSchema } from "@/schemas/common";
import { createTaskInputSchema, taskStatusSchema } from "@/schemas/task";

import { serializeTask } from "./serialize-task";

export const runtime = "nodejs";

type PopulatedTaskGoal = {
  _id: { toString(): string };
  name: string;
  status: string;
  priority: string;
};

function serializeGoalSummary(goal: PopulatedTaskGoal) {
  return {
    id: goal._id.toString(),
    name: goal.name,
    status: goal.status,
    priority: goal.priority,
  };
}

function getSerializedGoal(task: { goal?: unknown }) {
  const { goal } = task;

  if (
    !goal ||
    typeof goal !== "object" ||
    !("_id" in goal) ||
    !("name" in goal) ||
    !("status" in goal) ||
    !("priority" in goal)
  ) {
    return null;
  }

  return serializeGoalSummary(goal as PopulatedTaskGoal);
}

async function validateLinkedGoalId(goalId: string | null) {
  if (!goalId) {
    return null;
  }

  const goalExists = await GoalModel.exists({ _id: goalId });

  if (!goalExists) {
    return errorResponse(
      "INVALID_TASK_INPUT",
      "Linked goal was not found.",
      { status: 400 },
    );
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const goalId = searchParams.get("goalId");
  const query: {
    status?: string;
    goalId?: string | null;
  } = {};

  if (status) {
    const parsedStatus = taskStatusSchema.safeParse(status);

    if (!parsedStatus.success) {
      return errorResponse(
        "INVALID_TASK_FILTER",
        "Task status filter is invalid.",
        { status: 400 },
      );
    }

    query.status = parsedStatus.data;
  }

  if (goalId) {
    if (goalId === "none") {
      query.goalId = null;
    } else {
      const parsedGoalId = objectIdSchema.safeParse(goalId);

      if (!parsedGoalId.success) {
        return errorResponse(
          "INVALID_TASK_FILTER",
          "Task goal filter must be a valid ObjectId or 'none'.",
          { status: 400 },
        );
      }

      query.goalId = parsedGoalId.data;
    }
  }

  try {
    await connectToDatabase();

    const tasks = await TaskModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .populate("goal", "name status priority")
      .lean();

    return successResponse({
      tasks: tasks.map((task) =>
        serializeTask({
          id: task._id.toString(),
          goalId: task.goalId ? task.goalId.toString() : null,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          estimatedDurationMinutes: task.estimatedDurationMinutes,
          priority: task.priority,
          status: task.status,
          completedAt: task.completedAt,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          goal: getSerializedGoal(task as { goal?: unknown }),
        }),
      ),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown task list error";

    return errorResponse("TASK_LIST_ERROR", message, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "Request body must be valid JSON.", {
      status: 400,
    });
  }

  try {
    const input = createTaskInputSchema.parse(payload);

    await connectToDatabase();

    const goalValidationError = await validateLinkedGoalId(input.goalId);

    if (goalValidationError) {
      return goalValidationError;
    }

    const task = await TaskModel.create(input);
    await task.populate("goal", "name status priority");

    return successResponse(
      {
        task: serializeTask({
          id: task._id.toString(),
          goalId: task.goalId ? task.goalId.toString() : null,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          estimatedDurationMinutes: task.estimatedDurationMinutes,
          priority: task.priority,
          status: task.status,
          completedAt: task.completedAt,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          goal: getSerializedGoal(task as { goal?: unknown }),
        }),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        "INVALID_TASK_INPUT",
        error.issues[0]?.message ?? "Invalid task input.",
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown task creation error";

    return errorResponse("TASK_CREATE_ERROR", message, { status: 500 });
  }
}
