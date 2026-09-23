export const profile = {
  name: "Muhammad Ibrahim",
  role: "Full-Stack Engineer",
  tagline: "Node.js · TypeScript · React · AWS & GCP",
  blurb:
    "I build backends that stay fast and cheap when traffic gets serious — the payment flow that can't drop a transaction, the platform that has to hold up at 100K users. Six years across product, scale and cloud, now working where systems meet LLM orchestration.",
  location: "Lahore, Pakistan",
  email: "muhammadibrahim6318@gmail.com",
  github: "https://github.com/hafz-muhammad-ibrahim",
  linkedin: "https://www.linkedin.com/in/muhammadibrahim-7504211b9",
  liveDemo: "https://my-portfolio-bqhw.onrender.com",
};

export const stats = [
  { num: "100K+", label: "daily active users" },
  { num: "99.9%", label: "uptime held" },
  { num: "~40%", label: "infra cost cut" },
  { num: "6 yrs", label: "shipping production" },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
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
  tag: "live" | "private";
  tagLabel: string;
  org?: string;
  body: string;
  stack: string[];
  links?: { label: string; href: string; external?: boolean }[];
};

export const projects: Project[] = [
  {
    title: "Agent Orchestration Layer",
    tag: "live",
    tagLabel: "Live demo",
    org: "Personal project",
    body:
      "A supervisor service that sits on top of a trading platform and turns raw system checks into readable, actionable output. The core decision: deterministic code decides pass/fail — the LLM only explains results and drafts a remediation plan, and never sits in the trade hot path. It degrades to a deterministic fallback when no model key is present, and ships a safe demo mode with no secrets. Containerized and deployed.",
    stack: ["Python", "FastAPI", "LLM orchestration", "Docker", "REST"],
    links: [
      { label: "Live demo", href: "https://my-portfolio-bqhw.onrender.com", external: true },
      { label: "Source", href: "https://github.com/hafz-muhammad-ibrahim/my-portfolio", external: true },
    ],
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
