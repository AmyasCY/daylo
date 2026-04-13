import { InferSchemaType, Schema, Types } from "mongoose";

export const scheduleTaskAssignmentSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    titleSnapshot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    reasoning: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  { _id: false },
);

export const timeBlockSchema = new Schema(
  {
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    availabilityDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 240,
    },
    assignments: {
      type: [scheduleTaskAssignmentSchema],
      default: [],
    },
  },
  { _id: false },
);

export type ScheduleTaskAssignment = InferSchemaType<
  typeof scheduleTaskAssignmentSchema
> & {
  taskId: Types.ObjectId;
};

export type TimeBlock = InferSchemaType<typeof timeBlockSchema> & {
  assignments: ScheduleTaskAssignment[];
};
