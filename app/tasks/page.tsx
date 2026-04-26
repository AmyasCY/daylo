import Link from "next/link";

import { TasksManager } from "./tasks-manager";

export const metadata = {
  title: "Tasks | Daylo",
  description: "Create, review, update, and remove tasks that feed the Daylo scheduler.",
};

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe,transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_52%,#eff6ff_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-100/70 px-3 py-1 text-sm font-medium text-sky-900">
              Task Management
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Shape the actual work that will fill the day.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Turn each goal into concrete actions, keep estimates realistic, and
                give the scheduler inputs that are clear enough to trust.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/goals"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              View goals
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Back home
            </Link>
          </div>
        </header>

        <TasksManager />
      </div>
    </main>
  );
}
