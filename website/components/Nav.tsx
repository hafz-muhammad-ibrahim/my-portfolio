"use client";

import { useEffect, useState } from "react";
import { profile, nav } from "@/lib/content";
import { CalendarIcon } from "./Icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const book = profile.calendly || `mailto:${profile.email}?subject=Meeting%20request`;

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur transition-colors ${
        scrolled ? "border-line bg-ink/80" : "border-transparent bg-ink/40"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="font-display text-[17px] font-semibold text-head">
          Muhammad Ibrahim
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="text-sm text-muted transition-colors hover:text-head">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href={book}
          target={profile.calendly ? "_blank" : undefined}
          rel={profile.calendly ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-2 rounded-lg border border-line2 bg-surface px-4 py-2 text-sm font-medium text-head transition-colors hover:border-azure"
        >
          <CalendarIcon className="h-4 w-4" />
          Book a call
        </a>
      </div>
    </header>
  );
}
