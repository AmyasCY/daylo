import Link from "next/link";

import { GoalsManager } from "./goals-manager";

export const metadata = {
  title: "Goals | Daylo",
  description: "Create, review, update, and remove goals for your Daylo plan.",
};

export default function GoalsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,transparent_28%),linear-gradient(180deg,#fffaf3_0%,#f8fafc_52%,#eef6ff_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 text-sm font-medium text-amber-900">
              Goals Management
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Shape the outcomes that drive the rest of the day.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Capture priorities, adjust them as reality changes, and keep your
                planning inputs clean before tasks and schedules pile up.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            Back home
          </Link>
        </header>

        <GoalsManager />
      </div>
    </main>
  );
}
