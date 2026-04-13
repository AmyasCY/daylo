import { InferSchemaType, Model, Schema, model, models } from "mongoose";

export const GOAL_STATUSES = ["active", "paused", "completed", "archived"] as const;
export const GOAL_PRIORITIES = ["low", "medium", "high"] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];
export type GoalPriority = (typeof GOAL_PRIORITIES)[number];

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: GOAL_STATUSES,
      default: "active",
      index: true,
    },
    priority: {
      type: String,
      enum: GOAL_PRIORITIES,
      default: "medium",
      index: true,
    },
    targetDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

goalSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "goalId",
});

goalSchema.index({ createdAt: -1 });

export type Goal = InferSchemaType<typeof goalSchema>;

type GoalModel = Model<Goal>;

export const GoalModel =
  (models.Goal as GoalModel | undefined) ?? model<Goal>("Goal", goalSchema);
