## Context

See proposal.md - Why/What Changes for motivation and scope. Relevant constraints:
- The project already has a single shared `pg` `Pool` in `lib/db.ts`, connected via `DB_URL` (Vercel Postgres/Neon), with no migration framework installed.
- The prototype tables `bonos`/`entrenos` remain in use by existing code; this change adds `bundles`/`sessions` alongside them without touching or dropping the old tables.
- This is a small, single-user (password-gated) tracker app, so concurrency around bundle creation is not a real-world risk today, only a correctness edge case worth deciding on.

## Goals / Non-Goals

**Goals:**
- Define the `bundles`/`sessions` schema and a SQL artifact that can be applied to the Neon/Vercel Postgres database.
- Add typed, reusable query functions to `lib/db.ts` that satisfy the requirements in `specs/bundle-storage/spec.md`.
- Make the "single active bundle" invariant hold by construction, not by convention.

**Non-Goals:**
- Migrating `app/actions.ts` or `app/(app)/**` pages off the old `bonos`/`entrenos` schema.
- Introducing a migration framework/tool.
- Any renewal or bundle-management business logic beyond the base CRUD queries listed in the proposal.

## Decisions

**SQL delivery: a plain `.sql` file, applied manually — no migration tool.**
A single `lib/db/schema.sql` file will define both tables. It is run once against Neon (via the Neon SQL editor or `psql $DB_URL`) rather than through an automated migration runner. Alternative considered: adding `node-pg-migrate` or similar — rejected as premature for a two-table schema; revisit if/when the schema needs versioned, repeatable migrations.

**Single-active-bundle invariant: transaction + partial unique index (belt and suspenders).**
`createBundle` runs `UPDATE bundles SET active = false WHERE active = true` followed by the `INSERT` inside one `pg` transaction (`BEGIN`/`COMMIT`), so a caller always sees at most one active bundle after the call returns. The schema also declares `CREATE UNIQUE INDEX bundles_one_active ON bundles (active) WHERE active` as a DB-level safety net. Alternative considered: relying on the partial unique index alone and letting the second insert fail — rejected because the spec requires the *previous* bundle to be deactivated automatically, not to error out.

**Query functions live in `lib/db.ts`, not a separate module.**
The task explicitly extends the existing connection file rather than introducing a new `lib/queries.ts`, keeping the connection and the base queries co-located since the file is still small.

**`effort` validity enforced via a Postgres `CHECK` constraint.**
`CHECK (effort BETWEEN 1 AND 5)` on `sessions.effort`, matching the "Effort rating is constrained to a valid range" scenario. `effort` remains nullable (not `NOT NULL`) since the source schema in the proposal does not mark it required.

**`listBundlesWithSessions` returns bundles with sessions nested per bundle, fetched via two queries (not a JOIN).**
One query fetches all bundles, a second fetches all sessions ordered by `bundle_id`, and they are merged in application code. Alternative considered: a single `LEFT JOIN` — rejected for this simple case since it avoids duplicating bundle columns across rows and keeps the mapping straightforward for a small dataset.

## Risks / Trade-offs

- [Old `bonos`/`entrenos` tables and code stay in place, alongside the new schema, creating temporary duplication] → Mitigation: intentional and called out in the proposal; the `bundle-management` follow-up task owns migrating the app code, so this change must not delete or rename the old tables.
- [Transaction-based deactivation is not fully race-safe under concurrent `createBundle` calls] → Mitigation: accepted risk given the single-user nature of the app; the partial unique index guarantees the invariant is never silently violated even if a race did occur (a concurrent insert would fail loudly instead of leaving two active bundles).
