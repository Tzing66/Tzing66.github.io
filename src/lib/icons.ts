import {
  siPython, siPostgresql, siApachespark, siApacheairflow, siFastapi, siClaude, siDocker,
  siGithubactions, siReact, siScikitlearn, siQgis, siPandas, siStreamlit, siSqlite,
  siGooglebigquery, siGooglecloud, siSupabase, siTypescript, siGit, siGooglegemini,
} from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

// Tech name (as written in site.config.ts) → Simple Icons logo.
// Anything missing (AWS, OpenAI, dbt, LightGBM: no Simple Icons logo) renders without a logo.
const byName: Record<string, SimpleIcon | undefined> = {
  Python: siPython,
  Postgres: siPostgresql,
  PostgreSQL: siPostgresql,
  BigQuery: siGooglebigquery,
  "Google Cloud": siGooglecloud,
  Supabase: siSupabase,
  TypeScript: siTypescript,
  Git: siGit,
  Gemini: siGooglegemini,
  pandas: siPandas,
  "React Native": siReact,
  Spark: siApachespark,
  Airflow: siApacheairflow,
  FastAPI: siFastapi,
  "Claude API": siClaude,
  Docker: siDocker,
  "GitHub Actions": siGithubactions,
  React: siReact,
  "scikit-learn": siScikitlearn,
  QGIS: siQgis,
  Pandas: siPandas,
  Streamlit: siStreamlit,
  SQLite: siSqlite,
};

export const techIcon = (name: string) => byName[name];

