## 1. Schema

- [x] 1.1 Create `lib/db/schema.sql` with the `bundles` table (`id` SERIAL PK, `price` NUMERIC(6,2) NOT NULL, `start_date` DATE NOT NULL, `total_sessions` INT NOT NULL DEFAULT 10, `active` BOOLEAN DEFAULT true)
- [x] 1.2 Add the `sessions` table to `lib/db/schema.sql` (`id` SERIAL PK, `bundle_id` INT REFERENCES `bundles(id)`, `session_date` DATE NOT NULL DEFAULT CURRENT_DATE, `effort` INT CHECK (effort BETWEEN 1 AND 5), `note` TEXT)
- [x] 1.3 Add the partial unique index `bundles_one_active` on `bundles (active) WHERE active` to `lib/db/schema.sql`
- [x] 1.4 Apply `lib/db/schema.sql` against the Neon/Vercel Postgres database and confirm both tables and the index exist

## 2. Base Queries

- [x] 2.1 In `lib/db.ts`, add `createBundle` (price, start_date, total_sessions) that deactivates any currently active bundle and inserts the new one inside a single transaction, returning the created bundle
- [x] 2.2 In `lib/db.ts`, add `getActiveBundle` that returns the bundle with `active = true`, or `null` if none exists
- [x] 2.3 In `lib/db.ts`, add `createSession` (bundle_id, effort, note, session_date?) that inserts a session row and returns it
- [x] 2.4 In `lib/db.ts`, add `countSessionsForBundle` (bundle_id) that returns the number of sessions linked to that bundle
- [x] 2.5 In `lib/db.ts`, add `listBundlesWithSessions` that returns all bundles, each with its associated sessions attached, for history views

## 3. Verification

- [x] 3.1 Manually exercise `createBundle` twice and confirm the first bundle ends up with `active = false` and only the second has `active = true`
- [x] 3.2 Manually exercise `createSession` with an out-of-range `effort` value and confirm the insert is rejected by the CHECK constraint
- [x] 3.3 Manually exercise `countSessionsForBundle` and `listBundlesWithSessions` against seeded data and confirm the returned shapes match the `bundle-storage` spec scenarios
