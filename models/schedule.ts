import {
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

import { timeBlockSchema, type TimeBlock } from "@/models/time-block";

const scheduleFeedbackSchema = new Schema(
  {
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false },
);

const scheduleSchema = new Schema(
  {
    scheduleDate: {
      type: Date,
      required: true,
      index: true,
    },
    timeBlocks: {
      type: [timeBlockSchema],
      default: [],
    },
    reasoningSummary: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
    feedbackNotes: {
      type: [scheduleFeedbackSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

scheduleSchema.index({ scheduleDate: -1, createdAt: -1 });

export type ScheduleFeedback = InferSchemaType<typeof scheduleFeedbackSchema>;

export type Schedule = InferSchemaType<typeof scheduleSchema> & {
  timeBlocks: TimeBlock[];
  feedbackNotes: ScheduleFeedback[];
};

type ScheduleModel = Model<Schedule>;

export const ScheduleModel =
  (models.Schedule as ScheduleModel | undefined) ??
  model<Schedule>("Schedule", scheduleSchema);
