## Why

The current prototype persists training bundles in ad-hoc tables (`bonos`/`entrenos`) accessed directly from page and action code, with no formal schema, no price/date tracking, and no session-level detail (effort, notes). Before the upcoming bundle-management business logic (renewals, single-active-bundle enforcement, UI flows) can be built, the app needs a normalized Postgres schema (`bundles`/`sessions`) and a small set of reusable, typed data-access functions to build on.

## What Changes

- Add a `bundles` table: `id` (SERIAL PK), `price` (NUMERIC(6,2) NOT NULL), `start_date` (DATE NOT NULL), `total_sessions` (INT NOT NULL DEFAULT 10), `active` (BOOLEAN DEFAULT true).
- Add a `sessions` table: `id` (SERIAL PK), `bundle_id` (INT REFERENCES bundles(id)), `session_date` (DATE NOT NULL DEFAULT CURRENT_DATE), `effort` (INT CHECK 1-5), `note` (TEXT, optional).
- Establish the 1:N relationship between `bundles` and `sessions` via `bundle_id`, and the invariant that at most one `bundle` has `active = true` at a time.
- Extend `lib/db.ts` with reusable, typed query functions on top of the existing `pg` pool connection: create bundle (deactivating any previous active bundle), get the active bundle, create a session, count sessions for a bundle, and list bundles with their sessions for history views.
- **BREAKING**: This schema supersedes the prototype `bonos`/`entrenos` tables currently queried by `app/actions.ts` and the `app/(app)` pages. Migrating that existing code to the new schema is out of scope for this change and will be handled by the follow-up `bundle-management` task.
- Out of scope: renewal logic, UI changes, and any business rules beyond the single-active-bundle invariant at the data layer.

## Capabilities

### New Capabilities
- `bundle-storage`: Postgres schema and base CRUD data-access layer for training bundles and their sessions (schema, connection, reusable queries).

### Modified Capabilities
(none — no existing specs in this project yet)

## Impact

- **Database**: new `bundles` and `sessions` tables (SQL migration to be added under the project's db/migration location).
- **Code**: `lib/db.ts` gains new exported query functions; no changes to `app/actions.ts` or `app/(app)/**` pages in this change (they still reference the old `bonos`/`entrenos` schema and will break against the new tables until the `bundle-management` follow-up migrates them).
- **Dependencies**: none new — reuses the existing `pg` pool already configured via `DB_URL`.
