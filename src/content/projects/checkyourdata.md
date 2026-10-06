## The problem

Writing data-quality checks by hand is tedious, so they often don't get written. CheckYourData lets you upload a dataset and has an AI agent propose validation checks from its schema, which you review, edit and run.

## How it works

- **Upload** a CSV. The backend profiles its columns and stores the dataset.
- **Suggest:** an agent sends the column schema plus a small sample to Claude, using forced tool-use so the response is always a structured list of check configs. Malformed suggestions are caught by validation and retried automatically.
- **Review:** you approve or edit suggestions alongside preset checks. The agent never runs checks or saves anything itself.
- **Run and track:** checks run against the data, and results are kept as history with drift over time.
- **Cache:** suggestions are cached in Postgres keyed by a hash of schema + sample, so a repeat call returns in ~40ms instead of ~4s without re-hitting the API.

## Architecture

A FastAPI backend with Postgres, a React + TypeScript frontend, and a single Docker service in production: FastAPI serves the built frontend from the same origin, and uploaded files live in Supabase Storage so they survive free-tier restarts.
