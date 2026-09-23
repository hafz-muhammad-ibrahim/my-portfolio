import { projects } from "@/lib/content";
import { ExternalIcon } from "./Icons";

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-6">
      <h2 className="mb-8 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted lg:sr-only">
        Projects
      </h2>
      <div className="space-y-5">
        {projects.map((p) => (
          <article
            key={p.title}
            className={`rounded-2xl border bg-surface p-6 transition-colors sm:p-7 ${
              p.tag === "live" ? "border-teal/35" : "border-line hover:border-line2"
            }`}
          >
            <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[20px] font-semibold text-head">{p.title}</h3>
                {p.org && <span className="text-sm text-muted">— {p.org}</span>}
              </div>
              {p.tag === "live" ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 px-3 py-1 text-[12.5px] font-semibold text-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  {p.tagLabel}
                </span>
              ) : (
                <span className="rounded-full border border-line2 px-3 py-1 text-[12.5px] text-muted">
                  {p.tagLabel}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-[70ch] text-[15.5px] leading-relaxed text-body">{p.body}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-line bg-raised px-2.5 py-1 font-mono text-[12px] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>

            {p.links && (
              <div className="mt-5 flex flex-wrap gap-6">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-[14.5px] font-medium text-azure hover:underline hover:underline-offset-4"
                  >
                    <ExternalIcon className="h-4 w-4" />
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
