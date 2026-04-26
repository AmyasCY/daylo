"use client";

import { startTransition, useEffect, useState } from "react";

type TaskGoalSummary = {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "archived";
  priority: "low" | "medium" | "high";
};

type Task = {
  id: string;
  goalId: string | null;
  title: string;
  description: string;
  deadline: string | null;
  estimatedDurationMinutes: number;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  goal: TaskGoalSummary | null;
};

type GoalOption = {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "archived";
  priority: "low" | "medium" | "high";
};

type TaskFormState = {
  goalId: string;
  title: string;
  description: string;
  deadline: string;
  estimatedDurationMinutes: string;
  priority: Task["priority"];
  status: Task["status"];
  completedAt: string;
};

const defaultTaskFormState: TaskFormState = {
  goalId: "",
  title: "",
  description: "",
  deadline: "",
  estimatedDurationMinutes: "30",
  priority: "medium",
  status: "todo",
  completedAt: "",
};

const taskStatusLabels: Record<Task["status"], string> = {
  todo: "To do",
  in_progress: "In progress",
  completed: "Completed",
};

async function readApiResponse<TData>(response: Response) {
  const payload = (await response.json()) as
    | { ok: true; data: TData }
    | { ok: false; error: { code: string; message: string } };

  if (!payload.ok) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

function toRequestPayload(form: TaskFormState) {
  return {
    goalId: form.goalId || null,
    title: form.title,
    description: form.description,
    deadline: form.deadline || null,
    estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
    priority: form.priority,
    status: form.status,
    completedAt: form.completedAt || null,
  };
}

function toEditableForm(task: Task): TaskFormState {
  return {
    goalId: task.goalId ?? "",
    title: task.title,
    description: task.description,
    deadline: task.deadline ? task.deadline.slice(0, 10) : "",
    estimatedDurationMinutes: String(task.estimatedDurationMinutes),
    priority: task.priority,
    status: task.status,
    completedAt: task.completedAt ? task.completedAt.slice(0, 16) : "",
  };
}

function formatDeadline(value: string | null) {
  if (!value) {
    return "No deadline";
  }

  return new Date(value).toLocaleDateString();
}

function formatCompletedAt(value: string | null) {
  if (!value) {
    return "Not completed";
  }

  return new Date(value).toLocaleString();
}

export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [createForm, setCreateForm] = useState<TaskFormState>(defaultTaskFormState);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TaskFormState>(defaultTaskFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadTasksPage() {
    setErrorMessage(null);

    try {
      const [taskData, goalData] = await Promise.all([
        readApiResponse<{ tasks: Task[] }>(
          await fetch("/api/tasks", { cache: "no-store" }),
        ),
        readApiResponse<{ goals: GoalOption[] }>(
          await fetch("/api/goals", { cache: "no-store" }),
        ),
      ]);

      setTasks(taskData.tasks);
      setGoals(goalData.goals);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load tasks.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    startTransition(() => {
      void loadTasksPage();
    });
  }, []);

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await readApiResponse<{ task: Task }>(
        await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toRequestPayload(createForm)),
        }),
      );

      setTasks((currentTasks) => [data.task, ...currentTasks]);
      setCreateForm(defaultTaskFormState);
      setSuccessMessage("Task created.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditing(task: Task) {
    setEditingTaskId(task.id);
    setEditForm(toEditableForm(task));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditForm(defaultTaskFormState);
  }

  async function handleUpdateSubmit(
    event: React.FormEvent<HTMLFormElement>,
    taskId: string,
  ) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await readApiResponse<{ task: Task }>(
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toRequestPayload(editForm)),
        }),
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? data.task : task)),
      );
      setEditingTaskId(null);
      setEditForm(defaultTaskFormState);
      setSuccessMessage("Task updated.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(taskId: string) {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await readApiResponse<{ deletedTaskId: string }>(
        await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        }),
      );

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

      if (editingTaskId === taskId) {
        cancelEditing();
      }

      setSuccessMessage("Task deleted.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-sky-200/70 bg-white/90 p-6 shadow-xl shadow-sky-100/40 backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-700">
            Add Task
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Turn intent into something schedulable
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Capture the next concrete step, attach it to a goal when it helps, and
            keep the inputs ready for later schedule generation.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleCreateSubmit}>
          <TaskFormFields
            form={createForm}
            goals={goals}
            isSaving={isSaving}
            onChange={setCreateForm}
          />

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? "Saving..." : "Create task"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Task Queue
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Review the work that will feed the schedule engine.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Keep duration, deadlines, and status clean so the next scheduling step
              has usable inputs instead of ambiguous notes.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div className="mt-6 space-y-3">
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
            {successMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm text-slate-500">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-sm leading-6 text-slate-500">
            No tasks yet. Add the first concrete action you want Daylo to schedule.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.map((task) => {
              const isEditing = editingTaskId === task.id;

              return (
                <article
                  key={task.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                >
                  {isEditing ? (
                    <form
                      className="space-y-4"
                      onSubmit={(event) => handleUpdateSubmit(event, task.id)}
                    >
                      <TaskFormFields
                        form={editForm}
                        goals={goals}
                        isSaving={isSaving}
                        onChange={setEditForm}
                      />

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {isSaving ? "Saving..." : "Save changes"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                              {taskStatusLabels[task.status]}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                              {task.priority} priority
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                              {task.estimatedDurationMinutes} min
                            </span>
                            {task.goal ? (
                              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                                Goal: {task.goal.name}
                              </span>
                            ) : (
                              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                                Unlinked task
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                              {task.title}
                            </h3>
                            <p className="max-w-3xl text-sm leading-6 text-slate-600">
                              {task.description || "No description provided."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => beginEditing(task)}
                            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            Deadline
                          </dt>
                          <dd className="mt-2 font-medium text-slate-700">
                            {formatDeadline(task.deadline)}
                          </dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            Completed At
                          </dt>
                          <dd className="mt-2 font-medium text-slate-700">
                            {formatCompletedAt(task.completedAt)}
                          </dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            Created
                          </dt>
                          <dd className="mt-2 font-medium text-slate-700">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            Updated
                          </dt>
                          <dd className="mt-2 font-medium text-slate-700">
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

type TaskFormFieldsProps = {
  form: TaskFormState;
  goals: GoalOption[];
  isSaving: boolean;
  onChange: React.Dispatch<React.SetStateAction<TaskFormState>>;
};

function TaskFormFields({
  form,
  goals,
  isSaving,
  onChange,
}: TaskFormFieldsProps) {
  return (
    <>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input
          required
          value={form.title}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          disabled={isSaving}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Draft the schedule scoring rules"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          value={form.description}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          disabled={isSaving}
          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Keep this concrete enough to become a schedulable block."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Goal</span>
          <select
            value={form.goalId}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                goalId: event.target.value,
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">No linked goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Estimated duration (minutes)
          </span>
          <input
            required
            min={1}
            max={1440}
            type="number"
            value={form.estimatedDurationMinutes}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                estimatedDurationMinutes: event.target.value,
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Deadline</span>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                deadline: event.target.value,
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Completed at</span>
          <input
            type="datetime-local"
            value={form.completedAt}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                completedAt: event.target.value,
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select
            value={form.priority}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                priority: event.target.value as Task["priority"],
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={form.status}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                status: event.target.value as Task["status"],
              }))
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
    </>
  );
}
