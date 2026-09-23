import { profile, skills } from "@/lib/content";
import { MailIcon } from "./Icons";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-6">
      <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted lg:sr-only">
        About
      </h2>
      <div className="max-w-[62ch] space-y-4 text-[15.5px] leading-relaxed text-body">
        <p>
          I&apos;m a full-stack engineer with <span className="text-head">six years</span> building and
          shipping production systems end to end for remote, international teams — React and Next.js on the
          front, Node.js, Express and TypeScript on the back, with a heavy tilt toward backend, data and cloud.
        </p>
        <p>
          Most of my work sits where <span className="text-head">product meets scale</span>: a platform I
          helped hold at 100K+ daily users while cutting server costs ~40%, an e-commerce automation suite
          spanning six marketplaces, and an AWS migration that took operational cost down ~30%.
        </p>
        <p>
          Lately I&apos;ve been building at the <span className="text-head">systems-plus-LLM</span> layer —
          orchestration where deterministic code stays in charge of decisions and the model does the
          explaining. I care about clean architecture, tests that actually catch things, and leaving systems
          cheaper and calmer than I found them.
        </p>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-6">
      <h2 className="mb-8 font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted lg:sr-only">
        Skills
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((s) => (
          <div key={s.group} className="rounded-xl border border-line bg-surface p-5">
            <h3 className="mb-3 font-display text-sm font-semibold text-azure">{s.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((i) => (
                <li
                  key={i}
                  className="rounded-md border border-line bg-raised px-2.5 py-1 text-[13.5px] text-body"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-10">
      <div className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
        <h2 className="font-display text-[clamp(24px,4vw,32px)] font-semibold text-head">
          Let&apos;s build something that scales
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[15.5px] text-muted">
          Open to senior full-stack, backend and forward-deployed engineering roles — remote or relocation.
          The fastest way to reach me is email.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-7 inline-flex items-center gap-2.5 rounded-lg bg-azure px-6 py-3 font-semibold text-ink transition-colors hover:bg-[#93b4f9]"
        >
          <MailIcon className="h-4 w-4" />
          {profile.email}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[13.5px] text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="font-mono text-[12.5px]">Built with Next.js · Tailwind · TypeScript</span>
      </div>
    </footer>
  );
}
