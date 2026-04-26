import { ZodError } from "zod";

import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { GoalModel } from "@/models/goal";
import { createGoalInputSchema } from "@/schemas/goal";

import { serializeGoal } from "./serialize-goal";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const goals = await GoalModel.find().sort({ createdAt: -1, _id: -1 }).lean();

    return successResponse({
      goals: goals.map((goal) =>
        serializeGoal({
          id: goal._id.toString(),
          name: goal.name,
          description: goal.description,
          status: goal.status,
          priority: goal.priority,
          targetDate: goal.targetDate,
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        }),
      ),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown goal list error";

    return errorResponse("GOAL_LIST_ERROR", message, { status: 500 });
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
    const input = createGoalInputSchema.parse(payload);

    await connectToDatabase();

    const goal = await GoalModel.create(input);

    return successResponse(
      {
        goal: serializeGoal(goal),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("INVALID_GOAL_INPUT", error.issues[0]?.message ?? "Invalid goal input.", {
        status: 400,
      });
    }

    const message =
      error instanceof Error ? error.message : "Unknown goal creation error";

    return errorResponse("GOAL_CREATE_ERROR", message, { status: 500 });
  }
}
