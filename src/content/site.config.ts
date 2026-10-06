// Single source of truth for all site content.
// Components read from here; never hard-code copy in components.
// Anything still marked TODO(Tanz) is a placeholder waiting on real content.

export const site = {
  name: "Tanmay Singh",
  nickname: "Tanz",
  role: "Data Engineer · MLOps · AI systems",
  pitch: "TODO(Tanz): one sentence",
  location: "India · open to UK roles",
  email: "TODO(Tanz)",
  url: "https://tzing66.github.io",
  links: {
    github: "https://github.com/Tzing66",
    linkedin: "https://www.linkedin.com/in/TODO",
    resume: "/resume/Tanmay_Singh_Resume.pdf",
  },
};

// Page sections in scroll order. Drives the nav, progress rail and command palette.
// `stage` is the pipeline-stage label shown above each section heading.
export const sections = [
  { id: "about", label: "About", stage: "ingest" },
  { id: "experience", label: "Experience", stage: "transform" },
  { id: "projects", label: "Projects", stage: "serve" },
  { id: "stack", label: "Stack", stage: "compute" },
  { id: "now", label: "Now", stage: "monitor" },
  { id: "contact", label: "Contact", stage: "sink" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const about = {
  paragraphs: [
    "TODO(Tanz): paragraph 1. Facts so far: CS degree from Manipal University Jaipur; MS in Data Science, Analytics and Engineering from Arizona State University.",
    "TODO(Tanz): paragraph 2. Facts so far: data engineer with a background in MLOps; now based in India and open to UK roles.",
  ],
  photo: "", // TODO(Tanz): optional, e.g. "/me.jpg"
  facts: ["📍 India · open to UK", "🛠 MLOps & Data Engineering", "🎓 MS @ Arizona State"],
};

export const experience = [
  {
    role: "Data Engineer (AI & Backend Systems)",
    company: "Vault IQ",
    location: "Remote",
    period: "Dec 2025 – May 2026",
    bullets: ["TODO(Tanz): 2–3 bullet points describing impact"],
    stack: [] as string[],
  },
  {
    role: "Data Engineer",
    company: "Capgemini (HSBC UK account, Application Data Management)",
    location: "",
    period: "Oct 2020 – Mar 2023",
    bullets: [
      "Optimized SQL queries and wrote SCD logic to meet ETL SLAs",
      "TODO(Tanz): any metrics",
    ],
    stack: ["SQL", "Python", "Spark", "Airflow"],
  },
];

export const education = [
  {
    degree: "MS, Data Science, Analytics and Engineering",
    school: "Arizona State University",
    period: "", // TODO(Tanz)
  },
  {
    degree: "B.Tech, Computer Science", // TODO(Tanz): confirm exact degree title
    school: "Manipal University Jaipur",
    period: "", // TODO(Tanz)
  },
];

// Curated allowlist. ONLY repos listed here are shown, in this order.
export const projects = [
  {
    repo: "Tzing66/CheckYourData",
    featured: true,
    title: "CheckYourData",
    tagline: "Data quality checks, suggested by an AI agent",
    status: "building",
    demo: "",
    image: "",
    highlights: [
      "Upload a dataset; an agent reads the schema and proposes validation checks",
      "Approve or edit suggestions alongside preset checks",
    ],
    stack: ["React", "FastAPI", "Postgres", "Claude API", "Docker"],
  },
  {
    repo: "Tzing66/checkyouraqi",
    featured: true,
    title: "CheckYourAQI",
    tagline: "Air quality forecasting and alerting platform",
    status: "building",
    stack: ["Airflow", "AWS", "Python", "ML"],
  },
  {
    repo: "Tzing66/job_matching_agent",
    title: "Job Matching Agent",
    tagline: "Fetches and scores job postings against my resumes",
    stack: ["Python", "Claude", "Adzuna API", "Excel"],
  },
  // TODO(Tanz): add, remove or reorder. ONLY repos listed here are shown.
] satisfies Project[];

export type Project = {
  repo: string;
  featured?: boolean;
  title?: string;
  tagline?: string;
  status?: "live" | "building" | "archived";
  demo?: string;
  image?: string;
  highlights?: string[];
  stack?: string[];
};

// TODO(Tanz): confirm the final list.
export const stack = [
  { group: "Languages", items: ["Python", "SQL"] },
  { group: "Data", items: ["Spark", "Airflow", "Postgres"] },
  { group: "ML/AI", items: ["FastAPI", "Claude API"] },
  { group: "Cloud & DevOps", items: ["AWS", "Docker", "GitHub Actions"] },
];

export const currently = [
  "Grinding NeetCode 150",
  // TODO(Tanz): what you're building, reading, learning
];

export const contact = {
  blurb: "Hiring for a data or ML platform role, or just want to talk pipelines? Reach out.",
};
