"use client";

import { startTransition, useEffect, useState } from "react";

type Goal = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  priority: "low" | "medium" | "high";
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type GoalFormState = {
  name: string;
  description: string;
  status: Goal["status"];
  priority: Goal["priority"];
  targetDate: string;
};

const defaultGoalFormState: GoalFormState = {
  name: "",
  description: "",
  status: "active",
  priority: "medium",
  targetDate: "",
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

function toRequestPayload(form: GoalFormState) {
  return {
    name: form.name,
    description: form.description,
    status: form.status,
    priority: form.priority,
    targetDate: form.targetDate || null,
  };
}

function toEditableForm(goal: Goal): GoalFormState {
  return {
    name: goal.name,
    description: goal.description,
    status: goal.status,
    priority: goal.priority,
    targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : "",
  };
}

function formatTargetDate(value: string | null) {
  if (!value) {
    return "No target date";
  }

  return new Date(value).toLocaleDateString();
}

export function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [createForm, setCreateForm] = useState<GoalFormState>(defaultGoalFormState);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GoalFormState>(defaultGoalFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadGoals() {
    setErrorMessage(null);

    try {
      const data = await readApiResponse<{ goals: Goal[] }>(
        await fetch("/api/goals", { cache: "no-store" }),
      );

      setGoals(data.goals);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load goals.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    startTransition(() => {
      void loadGoals();
    });
  }, []);

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await readApiResponse<{ goal: Goal }>(
        await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toRequestPayload(createForm)),
        }),
      );

      setGoals((currentGoals) => [data.goal, ...currentGoals]);
      setCreateForm(defaultGoalFormState);
      setSuccessMessage("Goal created.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create goal.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function beginEditing(goal: Goal) {
    setEditingGoalId(goal.id);
    setEditForm(toEditableForm(goal));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function cancelEditing() {
    setEditingGoalId(null);
    setEditForm(defaultGoalFormState);
  }

  async function handleUpdateSubmit(
    event: React.FormEvent<HTMLFormElement>,
    goalId: string,
  ) {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await readApiResponse<{ goal: Goal }>(
        await fetch(`/api/goals/${goalId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toRequestPayload(editForm)),
        }),
      );

      setGoals((currentGoals) =>
        currentGoals.map((goal) => (goal.id === goalId ? data.goal : goal)),
      );
      setEditingGoalId(null);
      setEditForm(defaultGoalFormState);
      setSuccessMessage("Goal updated.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update goal.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(goalId: string) {
    const confirmed = window.confirm(
      "Delete this goal? Related tasks will stay in place and lose their goal link.",
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await readApiResponse<{ deletedGoalId: string; detachedTasksCount: number }>(
        await fetch(`/api/goals/${goalId}`, {
          method: "DELETE",
        }),
      );

      setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId));

      if (editingGoalId === goalId) {
        cancelEditing();
      }

      setSuccessMessage("Goal deleted.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete goal.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <section className="rounded-[2rem] border border-amber-200/70 bg-white/90 p-6 shadow-xl shadow-amber-100/40 backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
            Add Goal
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Capture what matters next
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Keep goals concrete enough to guide task planning, but broad enough to
            represent a real outcome.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleCreateSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              required
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              placeholder="Ship the first scheduling demo"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={createForm.description}
              onChange={(event) =>
                setCreateForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              placeholder="What outcome should this goal create?"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={createForm.status}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    status: event.target.value as Goal["status"],
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Priority</span>
              <select
                value={createForm.priority}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    priority: event.target.value as Goal["priority"],
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Target date</span>
            <input
              type="date"
              value={createForm.targetDate}
              onChange={(event) =>
                setCreateForm((current) => ({
                  ...current,
                  targetDate: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? "Saving..." : "Create goal"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-700">
              Goal Board
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Current priorities
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Review, refine, and remove goals before you break them into tasks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              startTransition(() => {
                void loadGoals();
              });
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Refresh
          </button>
        </div>

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

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 text-sm text-slate-500 shadow-lg">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-sm leading-6 text-slate-500">
            No goals yet. Start with one focused outcome and refine it as the plan
            gets clearer.
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => {
              const isEditing = editingGoalId === goal.id;

              if (isEditing) {
                return (
                  <form
                    key={goal.id}
                    onSubmit={(event) => void handleUpdateSubmit(event, goal.id)}
                    className="rounded-[2rem] border border-amber-200 bg-white p-6 shadow-lg shadow-amber-100/40"
                  >
                    <div className="grid gap-4">
                      <input
                        required
                        value={editForm.name}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <select
                          value={editForm.status}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              status: event.target.value as Goal["status"],
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                        <select
                          value={editForm.priority}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              priority: event.target.value as Goal["priority"],
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <input
                          type="date"
                          value={editForm.targetDate}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              targetDate: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        />
                      </div>
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
                          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                );
              }

              return (
                <article
                  key={goal.id}
                  className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-amber-900">
                          {goal.status.replace("_", " ")}
                        </span>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-sky-900">
                          {goal.priority} priority
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-950">
                          {goal.name}
                        </h3>
                        <p className="max-w-2xl text-sm leading-6 text-slate-600">
                          {goal.description || "No description yet."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => beginEditing(goal)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(goal.id)}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center rounded-full border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-400 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                    <p>Target: {formatTargetDate(goal.targetDate)}</p>
                    <p>Updated: {new Date(goal.updatedAt).toLocaleDateString()}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
