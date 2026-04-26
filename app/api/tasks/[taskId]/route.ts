import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { GoalModel } from "@/models/goal";
import { TaskModel } from "@/models/task";
import { objectIdSchema } from "@/schemas/common";
import { updateTaskInputSchema } from "@/schemas/task";

import { serializeTask } from "../serialize-task";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

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

async function getValidatedTaskId(context: RouteContext) {
  const params = await context.params;
  return objectIdSchema.safeParse(params.taskId);
}

async function validateLinkedGoalId(goalId: string | null | undefined) {
  if (goalId === undefined || goalId === null) {
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

export async function GET(_request: Request, context: RouteContext) {
  const parsedTaskId = await getValidatedTaskId(context);

  if (!parsedTaskId.success) {
    return errorResponse("INVALID_TASK_ID", "Task ID must be a valid ObjectId.", {
      status: 400,
    });
  }

  try {
    await connectToDatabase();

    const task = await TaskModel.findById(parsedTaskId.data)
      .populate("goal", "name status priority")
      .lean();

    if (!task) {
      return errorResponse("TASK_NOT_FOUND", "Task not found.", {
        status: 404,
      });
    }

    return successResponse({
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
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown task detail error";

    return errorResponse("TASK_DETAIL_ERROR", message, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const parsedTaskId = await getValidatedTaskId(context);

  if (!parsedTaskId.success) {
    return errorResponse("INVALID_TASK_ID", "Task ID must be a valid ObjectId.", {
      status: 400,
    });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("INVALID_JSON", "Request body must be valid JSON.", {
      status: 400,
    });
  }

  try {
    const input = updateTaskInputSchema.parse(payload);

    await connectToDatabase();

    const goalValidationError = await validateLinkedGoalId(input.goalId);

    if (goalValidationError) {
      return goalValidationError;
    }

    const task = await TaskModel.findByIdAndUpdate(
      parsedTaskId.data,
      { $set: input },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("goal", "name status priority")
      .lean();

    if (!task) {
      return errorResponse("TASK_NOT_FOUND", "Task not found.", {
        status: 404,
      });
    }

    return successResponse({
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
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        "INVALID_TASK_INPUT",
        error.issues[0]?.message ?? "Invalid task input.",
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown task update error";

    return errorResponse("TASK_UPDATE_ERROR", message, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const parsedTaskId = await getValidatedTaskId(context);

  if (!parsedTaskId.success) {
    return errorResponse("INVALID_TASK_ID", "Task ID must be a valid ObjectId.", {
      status: 400,
    });
  }

  try {
    await connectToDatabase();

    const task = await TaskModel.findById(parsedTaskId.data).lean();

    if (!task) {
      return errorResponse("TASK_NOT_FOUND", "Task not found.", {
        status: 404,
      });
    }

    await TaskModel.deleteOne({ _id: parsedTaskId.data });

    return successResponse({
      deletedTaskId: parsedTaskId.data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown task deletion error";

    return errorResponse("TASK_DELETE_ERROR", message, { status: 500 });
  }
}
