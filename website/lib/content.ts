export const profile = {
  name: "Muhammad Ibrahim",
  role: "Full-Stack Engineer",
  tagline: "Node.js · TypeScript · React · AWS & GCP",
  photo: "/profile.jpg",
  blurb:
    "I build backends that stay fast and cheap when traffic gets serious — the payment flow that can't drop a transaction, the platform that has to hold up at 100K users. Six years across product, scale and cloud, now working where systems meet LLM orchestration.",
  location: "Lahore, Pakistan",
  email: "muhammadibrahim6318@gmail.com",
  phone: "+92 333 6369514",
  github: "https://github.com/hafz-muhammad-ibrahim",
  linkedin: "https://www.linkedin.com/in/muhammadibrahim-7504211b9",
  // Create a free scheduler at calendly.com or cal.com and paste the link here.
  // While empty, the "Book a call" button falls back to email.
  calendly: "",
};

export const stats = [
  { num: "100K+", label: "daily active users" },
  { num: "99.9%", label: "uptime held" },
  { num: "~40%", label: "infra cost cut" },
  { num: "6 yrs", label: "shipping production" },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export type Job = {
  period: string;
  role: string;
  company: string;
  location: string;
  points: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    period: "Jul 2024 — Jul 2026",
    role: "Full-Stack Engineer",
    company: "Aylab.io",
    location: "Remote · Singapore",
    points: [
      "Architected the backend for CricketFly, a multi-chain fantasy platform, and scaled it to 100K+ daily active users at 99.9% uptime while cutting server costs ~40% through Redis caching, multi-threaded workers and right-sized cloud infrastructure.",
      "Built a blockchain ad network end to end — user and admin panels, real-time transaction verification and OCR-based video analysis — with ML bot-detection that cut fraudulent clicks ~85% and lifted advertiser ROI ~40%.",
      "Authored the core engine for an automated trading system across five exchanges, and mentored 3–4 engineers on architecture, code reviews and testing standards.",
    ],
    stack: ["Node.js", "Express", "TypeScript", "Redis", "GCP", "Web3.js", "MongoDB"],
  },
  {
    period: "Jul 2021 — Jun 2024",
    role: "Software Engineer",
    company: "Qbatch",
    location: "Faisalabad, PK",
    points: [
      "Built a two-step order-fulfillment system for Amazon, Walmart and Shopify drop-shippers, automating supplier selection across six marketplaces plus warehouse and delivery tracking.",
      "Re-implemented the deprecated Amazon MWS on SP-API in a resilient, asynchronous Node.js service — improving API response times ~40% and data accuracy ~35%.",
      "Led the infrastructure migration to AWS with CI/CD, cutting operational cost ~30% while holding 99.9% uptime; mentored a team of up to 5 and set Jest/SuperTest standards.",
    ],
    stack: ["Node.js", "MySQL", "Sequelize", "AWS", "Docker", "React-Redux", "Puppeteer"],
  },
  {
    period: "Jan 2020 — Jun 2021",
    role: "Software Engineer",
    company: "Ozel",
    location: "Faisalabad, PK",
    points: [
      "Built login-automation and order-processing services with AWS integration, robust credential handling and automated captcha solutions.",
      "Worked directly with clients to scope and ship tailored automation that cut manual effort and errors.",
    ],
    stack: ["Node.js", "Express", "Puppeteer", "AWS", "S3"],
  },
];

export type Project = {
  title: string;
  org: string;
  featured?: boolean;
  tag?: "live";
  body: string;
  highlights: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: "CricketFly",
    org: "Aylab.io · multi-chain fantasy platform",
    featured: true,
    body:
      "A fantasy-cricket platform running across four blockchains, with tournament management, NFT systems and multi-currency payment gateways. I architected the backend and the infrastructure it scales on.",
    highlights: [
      "Scaled to 100K+ daily active users at 99.9% uptime",
      "Cut server costs ~40% via caching + multi-threaded workers",
      "Led Web3 integration: wallets, gas optimization, NFT minting",
    ],
    stack: ["Node.js", "Express", "TypeScript", "Redis", "GCP", "Web3.js"],
    links: [{ label: "View app", href: "https://cricket-fly.en.uptodown.com/android" }],
  },
  {
    title: "Ecom Circles",
    org: "Qbatch · multi-marketplace automation",
    featured: true,
    body:
      "A two-step order-fulfillment platform for Amazon, Walmart and Shopify drop-shippers — automating supplier selection across six marketplaces, warehouse management and delivery tracking.",
    highlights: [
      "Re-implemented Amazon MWS on SP-API: ~40% faster responses",
      "Led AWS migration with CI/CD: ~30% lower operational cost",
      "Held 99.9% uptime across the platform",
    ],
    stack: ["Node.js", "MySQL", "Sequelize", "AWS", "Docker", "Puppeteer"],
    links: [{ label: "Visit product", href: "https://app.ecomcircles.com/" }],
  },
  {
    title: "Agent Orchestration Layer",
    org: "Personal project",
    tag: "live",
    body:
      "A supervisor service over a trading platform. Deterministic code decides pass/fail; the LLM only explains results and drafts a remediation plan — never in the trade hot path. Ships a safe demo mode with no secrets. Containerized and deployed.",
    highlights: [
      "Deterministic core with an LLM explainer layer",
      "Graceful fallback when no model key is present",
      "Dockerized and running live",
    ],
    stack: ["Python", "FastAPI", "LLM orchestration", "Docker"],
    links: [
      { label: "Live demo", href: "https://my-portfolio-bqhw.onrender.com" },
      { label: "Source", href: "https://github.com/hafz-muhammad-ibrahim/my-portfolio" },
    ],
  },
  {
    title: "Blockchain Ad Network",
    org: "Aylab.io",
    body:
      "A full advertising ecosystem — user and admin panels with real-time on-chain transaction verification and OCR-based video analysis — protected by an ML bot-detection layer.",
    highlights: [
      "Cut manual verification time ~75% with automation",
      "Reduced fraudulent clicks ~85%, lifted advertiser ROI ~40%",
    ],
    stack: ["Node.js", "TypeScript", "OCR", "ML detection", "AppsFlyer"],
  },
];

export const skills = [
  { group: "Backend", items: ["Node.js", "NestJS", "Express", "TypeScript", "REST APIs", "WebSockets", "Redis caching"] },
  { group: "Frontend", items: ["React", "Next.js", "Redux", "Tailwind CSS", "JavaScript / ES6+"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Sequelize", "Query optimization"] },
  { group: "Cloud & DevOps", items: ["AWS (EC2, S3, ECS/ECR, Lambda)", "GCP", "Docker", "Nginx", "CI/CD"] },
  { group: "AI & Automation", items: ["LLM orchestration", "Function calling / tool-use", "Puppeteer", "OCR pipelines"] },
  { group: "Practices", items: ["System design", "Clean architecture", "TDD (Jest, SuperTest)", "Auth (JWT, OAuth2, RBAC)", "Mentoring"] },
];
