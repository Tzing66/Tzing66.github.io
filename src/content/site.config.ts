// Single source of truth for all site content.
// Components read from here; never hard-code copy in components.
// Empty strings / empty arrays are hidden on the page, so unfinished content can stay blank.

export const site = {
  name: "Tanmay Singh",
  nickname: "Tanz",
  role: "Data Engineer · MLOps · AI systems",
  pitch: "", // TODO(Tanz): one sentence
  location: "India · open to UK roles",
  email: "tanmay.work10@gmail.com",
  url: "https://tzing66.github.io",
  links: {
    github: "https://github.com/Tzing66",
    linkedin: "https://www.linkedin.com/in/tanmay-singh-3167b91b3/",
    resume: "/resume/TS_DE_26.pdf",
  },
  // Filename the browser saves the resume as when using the download button.
  resumeDownloadName: "Tanmay_Singh_Resume.pdf",
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
    // TODO(Tanz): 2–3 short paragraphs
  ] as string[],
  photo: "", // TODO(Tanz): optional, e.g. "/me.jpg"
  facts: ["📍 India · open to UK", "🛠 MLOps & Data Engineering", "🎓 MS @ Arizona State", "💻 BTech CSE @ Manipal"],
};

export const experience = [
  {
    role: "Data Engineer (AI & Backend Systems)",
    company: "Vault IQ",
    detail: "",
    location: "Remote",
    period: "Dec 2025 – May 2026",
    bullets: [
      // TODO(Tanz): 2–3 bullet points describing impact
    ] as string[],
    stack: [] as string[],
  },
  {
    role: "Data Engineer",
    company: "Capgemini",
    detail: "HSBC UK account · Application Data Management",
    location: "",
    period: "Oct 2020 – Mar 2023",
    bullets: [
      "Optimized SQL queries and wrote SCD logic to meet ETL SLAs",
      // TODO(Tanz): any metrics
    ],
    stack: ["SQL", "Python", "Spark", "Airflow"],
  },
];

export const education = [
  {
    degree: "MSc, Data Science and Analytics Engineering",
    school: "Arizona State University",
    period: "", // TODO(Tanz): optional years
  },
  {
    degree: "BTech, Computer Science Engineering",
    school: "Manipal University Jaipur",
    period: "", // TODO(Tanz): optional years
  },
];

export type ProjectTag = "Data Eng" | "ML" | "AI" | "Analytics";

export type Project = {
  repo: string; // owner/name on GitHub
  slug: string; // URL id (#projects/<slug>) and write-up file: src/content/projects/<slug>.md
  featured?: boolean; // large card
  title?: string; // overrides the repo name
  tagline?: string; // falls back to the GitHub description
  status?: "live" | "building" | "complete" | "archived";
  demo?: string;
  image?: string; // screenshot under public/
  highlights?: string[];
  stack?: string[];
  tags?: ProjectTag[]; // drives the filter chips
};

// Curated allowlist. ONLY repos listed here are shown, in this order.
export const projects: Project[] = [
  {
    repo: "Tzing66/CheckYourData",
    slug: "checkyourdata",
    featured: true,
    title: "CheckYourData",
    tagline: "Data quality checks, suggested by an AI agent",
    status: "building",
    demo: "", // TODO(Tanz): Render URL if you want it linked
    highlights: [
      "Upload a dataset; an agent reads the schema and proposes validation checks",
      "Approve or edit suggestions alongside preset checks",
    ],
    stack: ["React", "FastAPI", "Postgres", "Claude API", "Docker"],
    tags: ["Data Eng", "AI"],
  },
  {
    repo: "Tzing66/checkyouraqi",
    slug: "checkyouraqi",
    featured: true,
    title: "CheckYourAQI",
    tagline: "PM2.5 forecasts 24–72h ahead for 70 Delhi NCR monitoring stations",
    status: "live",
    demo: "https://checkyouraqi.streamlit.app",
    image: "/projects/checkyouraqi.jpg",
    highlights: [
      "Hourly ingestion into an S3/Iceberg lakehouse modelled with 27 dbt models on Athena",
      "LightGBM forecaster with leakage-checked training and champion/challenger promotion",
      "Public Streamlit dashboard and FastAPI read API, running unattended on AWS",
    ],
    stack: ["Airflow", "AWS", "dbt", "Iceberg", "LightGBM", "FastAPI", "Streamlit"],
    tags: ["Data Eng", "ML"],
  },
  {
    repo: "Tzing66/Real-Time-Clickstream-Analytics-Pipeline-on-AWS",
    slug: "clickstream",
    featured: true,
    title: "Real-Time Clickstream Analytics",
    tagline: "Serverless streaming pipeline on AWS, from simulated clicks to queryable partitions",
    status: "complete",
    highlights: [
      "Kinesis + Lambda ingestion of simulated clickstream events into a raw S3 zone",
      "Glue ETL flattens and partitions by date; Athena repairs and queries the table",
      "Step Functions orchestrates the run, with SNS success/failure notifications",
    ],
    stack: ["Kinesis", "Lambda", "Glue", "S3", "Athena", "Step Functions", "Python"],
    tags: ["Data Eng"],
  },
  {
    repo: "Tzing66/job_matching_agent",
    slug: "job-matching-agent",
    title: "Job Matching Agent",
    tagline: "Fetches and scores job postings against my resumes",
    status: "building",
    stack: ["Python", "Claude API", "Adzuna API", "SQLite", "Excel"],
    tags: ["AI"],
  },
  {
    repo: "Tzing66/Solar-Intensity-Model",
    slug: "solar-intensity",
    title: "Solar Intensity Model",
    tagline: "Regression model predicting solar power output in Phoenix, AZ",
    status: "complete",
    stack: ["Python", "scikit-learn", "pvlib", "NASA POWER API"],
    tags: ["ML"],
  },
  {
    repo: "Tzing66/mesa-transit-expansion-emissions-analysis",
    slug: "mesa-transit",
    title: "Mesa Transit Expansion & Emissions",
    tagline: "GIS transit planning and CO₂ impact modelling for underserved Mesa, AZ (ASU grad project)",
    status: "complete",
    stack: ["QGIS", "Python", "GeoPandas", "Matplotlib"],
    tags: ["Analytics"],
  },
];

// TODO(Tanz): confirm the final list.
export const stack = [
  { group: "Languages", items: ["Python", "SQL"] },
  { group: "Data", items: ["Spark", "Airflow", "Postgres", "dbt"] },
  { group: "ML/AI", items: ["FastAPI", "Claude API", "scikit-learn", "LightGBM"] },
  { group: "Cloud & DevOps", items: ["AWS", "Docker", "GitHub Actions"] },
];

export const currently = [
  "Grinding NeetCode 150",
  // TODO(Tanz): what you're building, reading, learning
];

// Listening data for the Now section, fetched at build time from Last.fm (see scripts/fetch-lastfm.ts).
// Leave lastfmUser empty to hide the card.
export const music = {
  lastfmUser: "", // TODO(Tanz): your Last.fm username
};

// Extra small cards for the Now bento grid (a book, a game, gym stats…). Empty = none shown.
export const nowExtras: { label: string; title: string; text?: string; href?: string }[] = [
  // TODO(Tanz): e.g. { label: "Reading", title: "Designing Data-Intensive Applications", text: "Kleppmann" },
];

export const contact = {
  blurb: "Hiring for a data or ML platform role, or just want to talk pipelines? Reach out.",
};
