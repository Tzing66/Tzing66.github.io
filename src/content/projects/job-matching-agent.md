## The problem

Job boards return far more postings than anyone can read. This is a personal agent that fetches postings, filters them against my profiles, and has Claude score and rank the shortlist.

## How it works

- **Fetch** from the Adzuna API, with the country as a parameter and a configurable posting-age window applied server-side.
- **Search** several keyword profiles independently, in a fixed priority order (Data Engineering first), so cross-profile duplicates resolve predictably.
- **Remember** what's already been seen in SQLite, keyed globally by job link, so each run only surfaces new postings.
- **Score** each profile's shortlist with one batched Claude call per run rather than one call per job, to keep token usage down.
- **Track** results in a persistent Excel tracker that accumulates rows across runs, with an editable "Applied" column.
