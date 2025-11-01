# Agentic-run-tracker

This is a agentic run tracker with UI and a MySQL backend.

Agentic AI Run Tracker — local install and apply

This repository contains a small demo project that demonstrates how to
set up a local MySQL-backed run-tracking database, seed it with example
data, and provide helper scripts to apply the schema and query the data.

## Contents

- `schema.sql` - full DDL (tables, triggers, functions, procedures) and seed data
- `run_sql.py` - Python helper that reads `.env` and applies `schema.sql` to your local MySQL
- `run_queries.sql` - example queries and CALL statements for testing stored procedures
- `.env.example` - a template for your local MySQL credentials
- `requirements.txt` - Python dependencies used by the helper script

## Quickstart

1. Copy `.env.example` to `.env` and fill in your MySQL connection info.
2. (Optional) Create and activate a virtual environment, then install the requirements:

   python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt

3. Apply the schema and seed data (this script is idempotent — it will skip things that already exist):

   python run_sql.py --apply

4. Run sample queries or call stored procedures with `run_queries.sql` or use the demo python script.

## Notes

- The helper script contains robust fallbacks for executing multi-statement SQL on varying
  MySQL connector implementations. If the connector doesn't support multi-statement execution,
  the script will split statements (while keeping procedures/triggers intact) and execute them
  sequentially.

- If you'd like, you can push this project to a remote GitHub repository. See `.gitignore` and
  `.env.example` for files you should keep private.

## Additional context

This README was merged with content from a prior local commit and the remote repository. The
project has been tested locally: `python run_sql.py --apply` succeeded and seeded 10 users, 10
projects, 10 agents and 10 runs. If you see merge conflicts when pushing, resolve the conflicts
in the indicated files, add them (`git add <file>`), then run `git rebase --continue` (if a rebase
is in progress) or complete the merge and push again.
