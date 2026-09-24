import { profile, skills } from "@/lib/content";
import { MailIcon, PhoneIcon, LinkedInIcon, GitHubIcon, CalendarIcon, PinIcon } from "./Icons";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-16">
      <h2 className="mb-6 font-display text-[clamp(24px,4vw,32px)] font-semibold text-head">About</h2>
      <div className="max-w-[68ch] space-y-4 text-[16px] leading-relaxed text-body">
        <p>
          I&apos;m a full-stack engineer with <span className="text-head">six years</span> building and shipping
          production systems end to end for remote, international teams — React and Next.js on the front,
          Node.js, Express and TypeScript on the back, with a heavy tilt toward backend, data and cloud.
        </p>
        <p>
          Most of my work sits where <span className="text-head">product meets scale</span>: a platform I helped
          hold at 100K+ daily users while cutting server costs ~40%, an e-commerce automation suite spanning six
          marketplaces, and an AWS migration that took operational cost down ~30%.
        </p>
        <p>
          Lately I&apos;ve been building at the <span className="text-head">systems-plus-LLM</span> layer —
          orchestration where deterministic code stays in charge of decisions and the model does the explaining.
          I care about clean architecture, tests that actually catch things, and leaving systems cheaper and
          calmer than I found them.
        </p>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-16">
      <h2 className="mb-8 font-display text-[clamp(24px,4vw,32px)] font-semibold text-head">Toolkit</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.group} className="rounded-xl border border-line bg-surface p-5">
            <h3 className="mb-3 font-display text-sm font-semibold text-azure">{s.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {s.items.map((i) => (
                <li key={i} className="rounded-md border border-line bg-raised px-2.5 py-1 text-[13px] text-body">
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
  const book = profile.calendly || `mailto:${profile.email}?subject=Meeting%20request`;
  const channels = [
    { icon: MailIcon, label: profile.email, href: `mailto:${profile.email}` },
    { icon: PhoneIcon, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: LinkedInIcon, label: "LinkedIn", href: profile.linkedin, ext: true },
    { icon: GitHubIcon, label: "GitHub", href: profile.github, ext: true },
    { icon: PinIcon, label: profile.location },
  ];
  return (
    <section id="contact" className="scroll-mt-20 py-16">
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-[clamp(24px,4vw,34px)] font-semibold text-head">
              Let&apos;s build something that scales
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15.5px] text-muted">
              Open to senior full-stack, backend and forward-deployed roles — remote or relocation. Grab a time
              or reach me on any channel.
            </p>
            <a
              href={book}
              target={profile.calendly ? "_blank" : undefined}
              rel={profile.calendly ? "noopener noreferrer" : undefined}
              className="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-azure px-6 py-3 font-semibold text-ink transition-colors hover:bg-[#93b4f9]"
            >
              <CalendarIcon className="h-4 w-4" /> Book a call
            </a>
          </div>
          <ul className="space-y-1">
            {channels.map((c) => {
              const Icon = c.icon;
              const inner = (
                <span className="flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[15px] text-body transition-colors hover:bg-raised">
                  <Icon className="h-[18px] w-[18px] flex-none text-azure" />
                  <span className="break-all">{c.label}</span>
                </span>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a href={c.href} target={c.ext ? "_blank" : undefined} rel={c.ext ? "noopener noreferrer" : undefined}>
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[13.5px] text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="font-mono text-[12.5px]">Built with Next.js · Tailwind · TypeScript</span>
      </div>
    </footer>
  );
}
