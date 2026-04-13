import {
  InferSchemaType,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "completed",
] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

const taskSchema = new Schema(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    estimatedDurationMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 24 * 60,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "todo",
      index: true,
    },
    completedAt: {
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

taskSchema.virtual("goal", {
  ref: "Goal",
  localField: "goalId",
  foreignField: "_id",
  justOne: true,
});

taskSchema.index({ status: 1, priority: -1, deadline: 1 });
taskSchema.index({ goalId: 1, createdAt: -1 });

export type Task = InferSchemaType<typeof taskSchema> & {
  goalId: Types.ObjectId | null;
};

type TaskModel = Model<Task>;

export const TaskModel =
  (models.Task as TaskModel | undefined) ?? model<Task>("Task", taskSchema);
