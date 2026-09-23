"use client";

import { useEffect, useState } from "react";
import { profile, stats, nav } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

export default function Intro() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:flex-col lg:justify-between lg:py-24">
      <div>
        <div className="reveal">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line2 bg-surface px-3.5 py-1.5 text-[13.5px] font-medium text-teal">
            <span className="relative h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-teal" />
              <span className="absolute inset-0 animate-ping rounded-full bg-teal motion-reduce:animate-none" />
            </span>
            Open to new roles
          </span>
        </div>

        <h1 className="reveal mt-6 text-[clamp(34px,5vw,46px)] font-semibold leading-[1.1] text-head">
          {profile.name}
        </h1>
        <p className="reveal mt-3 font-display text-lg font-medium text-head">
          {profile.role}
        </p>
        <p className="reveal mt-1 font-mono text-[13.5px] text-muted">
          {profile.tagline}
        </p>
        <p className="reveal mt-6 max-w-sm text-[15.5px] leading-relaxed text-body">
          {profile.blurb}
        </p>

        {/* desktop section nav */}
        <nav className="reveal mt-12 hidden lg:block" aria-label="In-page">
          <ul className="space-y-3">
            {nav.map((item) => {
              const on = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group inline-flex items-center gap-4 py-1"
                    aria-current={on ? "true" : undefined}
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        on ? "w-14 bg-azure" : "w-8 bg-line2 group-hover:w-14 group-hover:bg-muted"
                      }`}
                    />
                    <span
                      className={`font-mono text-xs tracking-widest transition-colors ${
                        on ? "text-head" : "text-muted group-hover:text-head"
                      }`}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="reveal mt-12 lg:mt-0">
        <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:grid-cols-2">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-semibold text-amber">{s.num}</div>
              <div className="mt-1 text-[13px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 text-muted">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-head">
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-head">
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-colors hover:text-head">
            <MailIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
