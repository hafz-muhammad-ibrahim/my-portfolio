import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Full-Stack Engineer. Backends that scale to 100K+ daily users. Node.js, TypeScript, React, AWS/GCP and LLM orchestration.",
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description:
      "Backends that scale to 100K+ daily users. Node.js, TypeScript, React, AWS/GCP.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
