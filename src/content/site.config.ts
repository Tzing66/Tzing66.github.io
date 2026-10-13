// Single source of truth for all site content.
// Components read from here; never hard-code copy in components.
// Empty strings / empty arrays are hidden on the page, so unfinished content can stay blank.

export const site = {
  name: "Tanmay Singh",
  nickname: "Tanz",
  role: "Data Engineer · MLOps · AI systems",
  pitch: "I build reliable data pipelines and the platforms around them, from 10M+ record banking systems to AI products.",
  location: "India · open to remote & relocation",
  email: "tanmay.work10@gmail.com",
  url: "https://tzing66.github.io",
  links: {
    github: "https://github.com/Tzing66",
    linkedin: "https://www.linkedin.com/in/tanmay-singh-3167b91b3/",
    resume: "/resume/TS_DE_26.pdf",
  },
  // Search/social description (meta description, Open Graph, Twitter). Edit freely.
  description: "Tanmay Singh — Data Engineer working across MLOps and AI systems. Projects, experience and resume. Based in India; open to remote roles or international relocation with visa sponsorship.",
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
    "I'm a data engineer with a background in MLOps. At Capgemini I spent two and a half years on HSBC UK's application data management team, running Airflow pipelines over 10M+ customer credit records a month and cutting batch runtime by 40%.",
    "After an MS in Data Science, Analytics and Engineering at Arizona State, I joined Vault IQ and worked across the stack on an AI brand-development platform: the Supabase data model, the backend and UI, and the agents that turn LLM and image-generation models into brand content and product shots.",
    "Outside work I build things end to end, like CheckYourAQI, an air-quality forecaster that runs unattended on AWS, and Mettle, the workout tracker I'm building now.",
  ] as string[],
  photo: "", // optional, e.g. "/me.jpg"
  facts: ["📍 Based in India", "🌍 Open to remote & relocation", "🛠 MLOps & Data Engineering", "🎓 MS @ Arizona State", "💻 BTech CSE @ Manipal"],
};

export const experience = [
  {
    role: "Data Engineer (AI & Backend Systems)",
    company: "Vault IQ",
    detail: "Full stack · data, backend and product UI",
    location: "Remote",
    period: "Dec 2025 – May 2026",
    bullets: [
      "Worked across the stack, from the Supabase schemas for user, brand, product and social data (4+ modules) to the backend services and product UI built on them",
      "Sped up the AI brand-generation pipeline, orchestrating OpenAI, Gemini and Flux Pro to produce brand content and product visuals",
      "Built a photoshoot agent that takes generated product images and stages them in marketing-ready settings, from hero shots to styled scenes, while keeping the product true to the original",
      "Built the production chatbot with a custom knowledge-base layer, plus the dashboard backend serving brand, catalogue and revenue metrics in real time, integrating 6+ external APIs",
    ] as string[],
    stack: ["Supabase", "PostgreSQL", "OpenAI", "Gemini", "Flux Pro"] as string[],
  },
  {
    role: "Data Engineer",
    company: "Capgemini",
    detail: "HSBC UK · Application Data Management",
    location: "",
    period: "Oct 2020 – Mar 2023",
    bullets: [
      "Built and orchestrated Airflow ETL pipelines for HSBC's customer credit data systems",
      "Processed 10M+ customer records a month across BigQuery and PostgreSQL environments",
      "Cut batch pipeline runtime by 40% by optimising BigQuery queries and storage, and wrote SCD logic to meet ETL SLAs",
      "Added PySpark validation and data-quality checks aligned with credit-risk models, plus monitoring that flags anomalies before they reach production",
    ],
    stack: ["Airflow", "BigQuery", "PostgreSQL", "Python", "PySpark", "SQL"],
  },
];

// Merged into the Experience timeline by start date, so `period` must start with "Mon YYYY".
export const education = [
  {
    degree: "MS, Data Science, Analytics and Engineering",
    school: "Arizona State University",
    period: "Aug 2023 – May 2025",
  },
  {
    degree: "BTech, Computer Science and Engineering",
    school: "Manipal University Jaipur",
    period: "Aug 2016 – May 2020",
  },
];

export type ProjectTag = "Data Eng" | "ML" | "AI" | "Analytics" | "Mobile";

export type Project = {
  repo: string; // owner/name on GitHub
  slug: string; // URL id (#projects/<slug>) and write-up file: src/content/projects/<slug>.md
  title?: string; // overrides the repo name
  tagline?: string; // falls back to the GitHub description
  status?: "live" | "building" | "complete" | "archived";
  demo?: string;
  image?: string; // landscape image under public/ for the card
  imageFit?: "cover" | "contain"; // contain for diagrams that mustn't be cropped
  imageBg?: string; // panel colour behind a contained image
  credit?: string; // attribution shown with images (e.g. map data)
  chart?: "solar" | "mesa"; // a data chart as the card visual (src/content/charts/<name>.json)
  flow?: string[]; // pipeline steps drawn as a diagram when there's no image
  gallery?: { src: string; caption: string }[]; // extra images in the write-up
  charts?: ("solar" | "mesa")[]; // full-size charts (with data table) in the write-up
  icon?: string; // app icon under public/ (placeholder when there are no screenshots yet)
  screens?: string[]; // phone screenshots under public/, shown as a gallery
  note?: string; // short status line, e.g. "In development — not public yet"
  cta?: { label: string; href: string }; // primary call to action on the card and write-up
  highlights?: string[];
  stack?: string[];
  tags?: ProjectTag[]; // drives the filter chips
};

// Mettle beta sign-up. Paste a Google Form (or similar) link here; while empty, the
// "Want to try the beta?" button opens a pre-filled email instead.
const mettleBetaForm = "https://forms.gle/QbLSDqcSx2JKkgqD7";

// Curated allowlist. ONLY repos listed here are shown, in this order.
export const projects: Project[] = [
  {
    repo: "Tzing66/mettle",
    slug: "mettle",
    title: "Mettle",
    tagline: "Gamified workout tracker: show up to earn XP, hit real benchmarks to earn a lot of it, climb from E to S rank",
    status: "building",
    note: "In development — not public yet",
    cta: {
      label: "Want to try the beta?",
      href: mettleBetaForm || `mailto:${site.email}?subject=${encodeURIComponent("Mettle beta")}&body=${encodeURIComponent("Hi Tanmay, I'd like to try the Mettle beta.\n\nPhone (iOS / Android): ")}`,
    },
    icon: "/projects/mettle/icon.png",
    // First three show on the card (middle one raised); all show in the write-up.
    screens: [
      "/projects/mettle/launch.webp",
      "/projects/mettle/home.webp",
      "/projects/mettle/progression.webp",
      "/projects/mettle/routines.webp",
    ],
    highlights: [
      "Offline-first logging on local SQLite, synced to Supabase when you sign in",
      "XP comes from a pure TypeScript engine that also runs server-side, so leaderboard XP can't be edited on the phone",
      "325 exercises with strength and running standards normalised for bodyweight, age and sex; friend groups with weekly leaderboards",
    ],
    stack: ["React Native", "Expo", "TypeScript", "SQLite", "Supabase", "Postgres"],
    tags: ["Mobile"],
  },
  {
    repo: "Tzing66/checkyouraqi",
    slug: "checkyouraqi",
    title: "CheckYourAQI",
    tagline: "PM2.5 forecasts 24–72h ahead for 70 Delhi NCR monitoring stations",
    status: "live",
    demo: "https://checkyouraqi.streamlit.app",
    image: "/projects/aqi/overview.webp",
    gallery: [
      { src: "/projects/aqi/overview.webp", caption: "Dashboard: city average now, tomorrow's forecast and every station on a map" },
      { src: "/projects/aqi/model-health.webp", caption: "Forecast accuracy page: live error against simple baselines" },
      { src: "/projects/aqi/station.webp", caption: "A station page during the OpenAQ outage, labelled as stale rather than hidden" },
    ],
    highlights: [
      "Hourly ingestion into an S3/Iceberg lakehouse modelled with 27 dbt models on Athena",
      "LightGBM forecaster with leakage-checked training and champion/challenger promotion",
      "Public Streamlit dashboard and FastAPI read API, running unattended on AWS",
    ],
    stack: ["Airflow", "AWS", "dbt", "Iceberg", "LightGBM", "FastAPI", "Streamlit"],
    tags: ["Data Eng", "ML"],
  },
  {
    repo: "Tzing66/mesa-transit-expansion-emissions-analysis",
    slug: "mesa-transit",
    title: "Mesa Transit Expansion & Emissions",
    tagline: "GIS transit planning and CO₂ modelling for underserved Mesa, AZ · ASU graduate project",
    status: "complete",
    image: "/projects/mesa/proposed-routes.webp",
    credit: "Map data © OpenStreetMap contributors",
    gallery: [
      { src: "/projects/mesa/no-bus-areas.webp", caption: "Census tracts with no bus service (dark), over Mesa's existing routes" },
      { src: "/projects/mesa/existing-routes.webp", caption: "Existing routes and stops" },
      { src: "/projects/mesa/proposed-routes.webp", caption: "Five proposed routes and 45 stops covering the gaps" },
      { src: "/projects/mesa/buffer-overlap.webp", caption: "500 m walking buffers around the new routes, intersected with tracts" },
    ],
    charts: ["mesa"],
    highlights: [
      "Mapped transit gaps across census tracts in QGIS and designed 5 new bus routes with 45 stops for 63,413 underserved residents",
      "Modelled diesel vs electric buses at 5–15% ridership uptake: about 8,000 t of CO₂ saved per year on average",
      "Combined census (ACS), OpenStreetMap, ridership and city budget data into one pipeline for mapping and cost estimates",
    ],
    stack: ["QGIS", "Python", "GeoPandas", "pandas", "Matplotlib"],
    tags: ["Analytics", "Data Eng"],
  },
  {
    repo: "Tzing66/CheckYourData",
    slug: "checkyourdata",
    title: "CheckYourData",
    tagline: "Data quality checks, suggested by an AI agent",
    status: "complete",
    flow: ["Upload a CSV", "Profile the schema", "Claude proposes checks", "You review & approve", "Run checks · track drift"],
    highlights: [
      "Upload a dataset; an agent reads the schema and a sample, and proposes validation checks via forced tool use",
      "Approve or edit suggestions alongside preset checks; results are kept as history with drift over time",
      "Suggestions cached in Postgres by schema hash: a repeat call returns in ~40 ms instead of ~4 s",
    ],
    stack: ["React", "FastAPI", "Postgres", "Claude API", "Docker"],
    tags: ["Data Eng", "AI"],
  },
  {
    repo: "Tzing66/Real-Time-Clickstream-Analytics-Pipeline-on-AWS",
    slug: "clickstream",
    title: "Real-Time Clickstream Analytics",
    tagline: "Serverless streaming pipeline on AWS, from simulated clicks to queryable partitions",
    status: "complete",
    image: "/projects/clickstream/step-functions.webp",
    imageFit: "contain",
    imageBg: "#161d26",
    highlights: [
      "Kinesis + Lambda ingestion of simulated clickstream events into a raw S3 zone",
      "Glue ETL flattens and partitions by date; Athena repairs and queries the table",
      "Step Functions orchestrates the run, with SNS success/failure notifications",
    ],
    stack: ["Kinesis", "Lambda", "Glue", "S3", "Athena", "Step Functions", "Python"],
    tags: ["Data Eng"],
  },
  {
    repo: "Tzing66/Solar-Intensity-Model",
    slug: "solar-intensity",
    title: "Solar Intensity Model",
    tagline: "Forecasting daily solar output in Phoenix, AZ from weather data",
    status: "complete",
    chart: "solar",
    charts: ["solar"],
    highlights: [
      "Merged NASA POWER weather data and pvlib daylight hours with NREL plant output for 2006",
      "Compared linear, RFECV-selected linear and polynomial regression; plain linear won with R² 0.83 and ~9% average error",
      "Solar radiation carries most of the signal; daylight hours are a distant second",
    ],
    stack: ["Python", "pandas", "scikit-learn", "pvlib", "Matplotlib"],
    tags: ["ML"],
  },
  {
    repo: "Tzing66/job_matching_agent",
    slug: "job-matching-agent",
    title: "Job Matching Agent",
    tagline: "A personal agent that fetches job postings and has Claude score them against my profiles",
    status: "building",
    flow: ["Adzuna API", "Profile filters", "SQLite · seen jobs", "Claude batch scoring", "Excel tracker"],
    highlights: [
      "Pulls postings from the Adzuna API for four keyword profiles, searched in a fixed priority order",
      "Remembers every job it has seen in SQLite, so each run surfaces only new postings",
      "Scores each shortlist with one batched Claude call and appends the results to an Excel tracker",
    ],
    stack: ["Python", "Claude API", "Adzuna API", "SQLite", "Excel"],
    tags: ["AI"],
  },
];

// From the resume's skills plus what the projects actually use.
export const stack = [
  { group: "Languages", items: ["Python", "SQL", "TypeScript"] },
  { group: "Data & warehousing", items: ["PostgreSQL", "BigQuery", "Supabase", "dbt"] },
  { group: "Pipelines & processing", items: ["Airflow", "Spark", "pandas"] },
  { group: "ML & AI", items: ["scikit-learn", "LightGBM", "Claude API", "Gemini", "OpenAI"] },
  { group: "Cloud & DevOps", items: ["AWS", "Google Cloud", "Docker", "GitHub Actions", "Git"] },
  { group: "Apps & APIs", items: ["FastAPI", "React", "React Native", "Streamlit"] },
];

// Plain strings, or { text, href } to make an item a link (e.g. to a project write-up).
export const currently: (string | { text: string; href: string })[] = [
  { text: "Building Mettle", href: "#projects/mettle" },
  "Grinding NeetCode 150",
  "Reading up about something niche",
  "Finding the next big breakthrough",
];

// Listening data for the Now section, fetched at build time from Last.fm (see scripts/fetch-lastfm.ts).
// Leave lastfmUser empty to hide the card.
export const music = {
  lastfmUser: "tanzinii",
};

// Extra small cards for the Now bento grid (a book, a game, gym stats…). Empty = none shown.
export const nowExtras: { label: string; title: string; text?: string; href?: string }[] = [
  // e.g. { label: "Reading", title: "Designing Data-Intensive Applications", text: "Kleppmann" },
];

export const contact = {
  blurb: "Hiring for a data or ML platform role, or just want to talk pipelines? Reach out.",
  // Where/how you can work, spelled out once for recruiters. Empty = hidden.
  availability: "Open to remote roles, or relocating internationally with visa sponsorship.",
};
