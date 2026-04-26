import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-[radial-gradient(circle_at_top,#fff7ed,transparent_45%),linear-gradient(180deg,#fffaf3_0%,#fff 48%,#f8fafc_100%)] px-6 py-16 text-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <section className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border border-amber-200 bg-amber-100/70 px-3 py-1 text-sm font-medium text-amber-900">
            Daily planning for focused solo work
          </p>
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              Turn goals and tasks into a plan you can actually follow today.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Daylo helps a single user combine priorities, tasks, and available
              time blocks into a realistic schedule with clear reasoning and
              room to re-plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Capture goals and tasks
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Shape today&apos;s schedule
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              Re-plan from feedback
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/goals"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open goals board
            </Link>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Goal CRUD is live
            </span>
          </div>
        </section>

        <section className="grid w-full max-w-xl gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <article className="rounded-3xl bg-slate-950 p-6 text-slate-50 shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">
              Input
            </p>
            <h2 className="mt-3 text-xl font-semibold">What matters today?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add goals, break them into concrete tasks, and record the time you
              actually have available.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-700/80">
              Output
            </p>
            <h2 className="mt-3 text-xl font-semibold">A workable schedule</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Generate a daily plan that balances priority, time constraints,
              and what can realistically be completed.
            </p>
          </article>
          <article className="rounded-3xl bg-emerald-50 p-6 shadow-lg ring-1 ring-emerald-100">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-800/80">
              Next
            </p>
            <h2 className="mt-3 text-xl font-semibold">Explain and adjust</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Show the reasoning behind the plan and reshape the day when new
              feedback arrives.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
