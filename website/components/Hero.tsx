import { profile, stats } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon, CalendarIcon } from "./Icons";

export default function Hero() {
  const book = profile.calendly || `mailto:${profile.email}?subject=Meeting%20request`;
  return (
    <section id="top" className="pt-14 pb-16 sm:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-[1.25fr_.85fr] md:gap-12">
        {/* text */}
        <div className="order-2 md:order-1">
          <span className="reveal inline-flex items-center gap-2.5 rounded-full border border-line2 bg-surface px-3.5 py-1.5 text-[13.5px] font-medium text-teal">
            <span className="relative h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-teal" />
              <span className="absolute inset-0 animate-ping rounded-full bg-teal motion-reduce:animate-none" />
            </span>
            Open to new roles — remote or relocation
          </span>
          <h1 className="reveal mt-5 text-[clamp(38px,7vw,60px)] font-semibold leading-[1.05] text-head">
            {profile.name}
          </h1>
          <p className="reveal mt-3 font-display text-[clamp(18px,3vw,22px)] font-medium text-head">
            {profile.role}
            <span className="mx-2 text-azure">/</span>
            <span className="font-mono text-[15px] text-muted">{profile.tagline}</span>
          </p>
          <p className="reveal mt-5 max-w-[56ch] text-[16px] leading-relaxed text-body">
            {profile.blurb}
          </p>

          <div className="reveal mt-7 flex flex-wrap gap-3">
            <a
              href={book}
              target={profile.calendly ? "_blank" : undefined}
              rel={profile.calendly ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-lg bg-azure px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-[#93b4f9]"
            >
              <CalendarIcon className="h-4 w-4" /> Book a call
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-lg border border-line2 bg-surface px-5 py-3 text-[15px] font-medium text-head transition-colors hover:border-azure">
              <MailIcon className="h-4 w-4" /> Email
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex items-center rounded-lg border border-line2 bg-surface px-4 py-3 text-head transition-colors hover:border-azure">
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex items-center rounded-lg border border-line2 bg-surface px-4 py-3 text-head transition-colors hover:border-azure">
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* photo */}
        <div className="reveal order-1 md:order-2">
          <div className="relative mx-auto w-56 sm:w-64 md:w-full md:max-w-[300px]">
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-azure/25 via-transparent to-amber/20 blur-2xl" />
            <img
              src={profile.photo}
              alt={profile.name}
              className="aspect-[4/5] w-full rounded-2xl border border-line2 object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="reveal mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-line py-7 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-[clamp(24px,3.4vw,30px)] font-semibold text-amber">{s.num}</div>
            <div className="mt-1 text-[13.5px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
