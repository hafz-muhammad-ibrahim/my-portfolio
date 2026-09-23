import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-6">
      <h2 className="mb-8 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted lg:sr-only">
        Experience
      </h2>
      <ol className="space-y-3">
        {experience.map((job) => (
          <li key={job.company}>
            <div className="group rounded-xl border border-transparent p-5 transition-colors hover:border-line hover:bg-surface/60">
              <div className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
                <p className="font-mono text-xs leading-6 text-muted">{job.period}</p>
                <div>
                  <h3 className="text-[17px] font-semibold text-head">
                    {job.role} <span className="text-azure">· {job.company}</span>
                  </h3>
                  <p className="mt-0.5 text-[13px] text-muted">{job.location}</p>
                  <ul className="mt-3 space-y-2">
                    {job.points.map((p, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-body">
                        <span className="mt-2.5 h-1 w-1 flex-none rounded-full bg-azure/70" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {job.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-md border border-line bg-raised px-2.5 py-1 font-mono text-[12px] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
