import { projects } from "@/lib/content";
import { ExternalIcon } from "./Icons";

export default function Projects() {
  return (
    <section id="work" className="scroll-mt-20 py-16">
      <div className="mb-9">
        <h2 className="font-display text-[clamp(24px,4vw,32px)] font-semibold text-head">Selected work</h2>
        <p className="mt-2 text-[15px] text-muted">Products I&apos;ve architected and shipped — with the outcomes that mattered.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className={`flex flex-col rounded-2xl border bg-surface p-6 transition-colors sm:p-7 ${
              p.tag === "live" ? "border-teal/35" : "border-line hover:border-line2"
            } ${p.featured ? "lg:col-span-1" : ""}`}
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[19px] font-semibold text-head">{p.title}</h3>
                <p className="mt-0.5 text-[13px] text-muted">{p.org}</p>
              </div>
              {p.tag === "live" && (
                <span className="inline-flex flex-none items-center gap-2 rounded-full border border-teal/40 px-3 py-1 text-[12px] font-semibold text-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Live
                </span>
              )}
            </div>

            <p className="mt-3 text-[15px] leading-relaxed text-body">{p.body}</p>

            <ul className="mt-4 space-y-1.5">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-snug text-body">
                  <span className="mt-[7px] h-1 w-1 flex-none rounded-full bg-amber" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <li key={t} className="rounded-md border border-line bg-raised px-2.5 py-1 font-mono text-[12px] text-muted">
                  {t}
                </li>
              ))}
            </ul>

            {p.links && (
              <div className="mt-5 flex flex-wrap gap-5 border-t border-line pt-4">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-azure hover:underline hover:underline-offset-4"
                  >
                    <ExternalIcon className="h-4 w-4" /> {l.label}
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
