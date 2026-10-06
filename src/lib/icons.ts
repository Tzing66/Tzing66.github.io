import {
  siPython, siPostgresql, siApachespark, siApacheairflow, siFastapi, siClaude, siDocker,
  siGithubactions, siReact, siScikitlearn, siQgis, siPandas, siStreamlit, siSqlite,
} from "simple-icons";

type SimpleIcon = { title: string; path: string; hex: string };

// Tech name (as written in site.config.ts) → Simple Icons logo.
// Anything missing (e.g. AWS, whose logo Simple Icons no longer ships) renders without a logo.
const byName: Record<string, SimpleIcon | undefined> = {
  Python: siPython,
  Postgres: siPostgresql,
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

