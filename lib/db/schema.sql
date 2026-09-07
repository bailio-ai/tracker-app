-- Bundle/session schema for the training bundle tracker.
-- Apply manually against Neon/Vercel Postgres (e.g. via `psql "$DB_URL" -f lib/db/schema.sql`
-- or the Neon SQL editor). Not run automatically; no migration tool is in use yet.

CREATE TABLE IF NOT EXISTS bundles (
  id SERIAL PRIMARY KEY,
  price NUMERIC(6, 2) NOT NULL,
  start_date DATE NOT NULL,
  total_sessions INT NOT NULL DEFAULT 10,
  active BOOLEAN DEFAULT true
);

-- Guarantees at most one active bundle at the database level, as a safety
-- net alongside the transaction in createBundle (see lib/db.ts).
CREATE UNIQUE INDEX IF NOT EXISTS bundles_one_active
  ON bundles (active)
  WHERE active;

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  bundle_id INT REFERENCES bundles(id),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  effort INT CHECK (effort BETWEEN 1 AND 5),
  note TEXT
);
