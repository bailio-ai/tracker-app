## Why

`db-schema` introduced the `bundles`/`sessions` tables and base queries in `lib/db.ts`, but the app's Server Actions and pages still read and write the old prototype tables (`bonos`/`entrenos`), which no longer exist after that schema was applied — `/` and `/historial` currently 500. The app needs its business logic and UI wired to the new schema so the tracker is usable again.

## What Changes

- Migrate `app/actions.ts` off `bonos`/`entrenos` entirely, replacing direct SQL with the `lib/db.ts` query functions (`createBundle`, `getActiveBundle`, `createSession`, `countSessionsForBundle`, `listBundlesWithSessions`). The old tables are not touched or dropped — out of scope, per `db-schema`'s proposal.
- Add `createNewBundle(price, startDate, totalSessions?)`: creates a bundle via `createBundle` (which already deactivates the previous active bundle).
- Add `getRemainingSessions()`: for the active bundle, returns `total_sessions - countSessionsForBundle(bundle.id)`; returns an explicit "no active bundle" result when there is none.
- Add `logSession(effort, note?, date?)`: records a session against the active bundle via `createSession`; fails in a controlled way (no session recorded) when there is no active bundle.
- Rework `app/(app)/page.tsx` to read the active bundle and remaining sessions through the new Server Actions instead of querying `bonos`. When there's no active bundle, show an empty state with a form to create one (price + start date).
- Rework `app/(app)/historial/page.tsx` to render `listBundlesWithSessions()` output instead of querying `bonos`/`entrenos` directly.
- Remove the now-unused `crearBono`/`registrarEntreno` Server Actions and the `query` import from `app/actions.ts` once nothing references them.
- Out of scope: any UI beyond what's needed to create a bundle and log a session; edit/delete of bundles or sessions; anything about authentication (`static-auth`) or the schema itself (`db-schema`).

## Capabilities

### New Capabilities
- `bundle-management`: business logic and UI for creating bundles, tracking the active bundle's remaining sessions, and logging sessions against it.

### Modified Capabilities
(none — `bundle-storage`'s persistence requirements are unchanged; this change only consumes them)

## Impact

- **Code**: `app/actions.ts` (replace `crearBono`/`registrarEntreno` with `createNewBundle`/`getRemainingSessions`/`logSession`, drop the `query` import), `app/(app)/page.tsx`, `app/(app)/historial/page.tsx`.
- **Verification**: after this change, `/` and `/historial` must load without a 500 error.
- **Dependencies**: none new — uses the `lib/db.ts` functions added by `db-schema`.
