import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { GoalModel } from "@/models/goal";
import { TaskModel } from "@/models/task";
import { objectIdSchema } from "@/schemas/common";
import { updateGoalInputSchema } from "@/schemas/goal";

import { serializeGoal } from "../serialize-goal";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    goalId: string;
  }>;
};

async function getValidatedGoalId(context: RouteContext) {
  const params = await context.params;
  return objectIdSchema.safeParse(params.goalId);
}

export async function GET(_request: Request, context: RouteContext) {
  const parsedGoalId = await getValidatedGoalId(context);

  if (!parsedGoalId.success) {
    return errorResponse("INVALID_GOAL_ID", "Goal ID must be a valid ObjectId.", {
      status: 400,
    });
  }

  try {
    await connectToDatabase();

    const goal = await GoalModel.findById(parsedGoalId.data).lean();

    if (!goal) {
      return errorResponse("GOAL_NOT_FOUND", "Goal not found.", {
        status: 404,
      });
    }

    return successResponse({
      goal: serializeGoal({
        id: goal._id.toString(),
        name: goal.name,
        description: goal.description,
        status: goal.status,
        priority: goal.priority,
        targetDate: goal.targetDate,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown goal detail error";

    return errorResponse("GOAL_DETAIL_ERROR", message, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const parsedGoalId = await getValidatedGoalId(context);

  if (!parsedGoalId.success) {
    return errorResponse("INVALID_GOAL_ID", "Goal ID must be a valid ObjectId.", {
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
    const input = updateGoalInputSchema.parse(payload);

    await connectToDatabase();

    const goal = await GoalModel.findByIdAndUpdate(
      parsedGoalId.data,
      { $set: input },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!goal) {
      return errorResponse("GOAL_NOT_FOUND", "Goal not found.", {
        status: 404,
      });
    }

    return successResponse({
      goal: serializeGoal({
        id: goal._id.toString(),
        name: goal.name,
        description: goal.description,
        status: goal.status,
        priority: goal.priority,
        targetDate: goal.targetDate,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      }),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        "INVALID_GOAL_INPUT",
        error.issues[0]?.message ?? "Invalid goal input.",
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown goal update error";

    return errorResponse("GOAL_UPDATE_ERROR", message, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const parsedGoalId = await getValidatedGoalId(context);

  if (!parsedGoalId.success) {
    return errorResponse("INVALID_GOAL_ID", "Goal ID must be a valid ObjectId.", {
      status: 400,
    });
  }

  try {
    await connectToDatabase();

    const goal = await GoalModel.findById(parsedGoalId.data).lean();

    if (!goal) {
      return errorResponse("GOAL_NOT_FOUND", "Goal not found.", {
        status: 404,
      });
    }

    const detachedTasksResult = await TaskModel.updateMany(
      { goalId: parsedGoalId.data },
      { $set: { goalId: null } },
    );

    await GoalModel.deleteOne({ _id: parsedGoalId.data });

    return successResponse({
      deletedGoalId: parsedGoalId.data,
      detachedTasksCount: detachedTasksResult.modifiedCount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown goal deletion error";

    return errorResponse("GOAL_DELETE_ERROR", message, { status: 500 });
  }
}
