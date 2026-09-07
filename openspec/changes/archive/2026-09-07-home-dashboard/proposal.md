## Why

The home page currently shows only the remaining-sessions counter (`bundle-management`) and the log-session form (`session-logging`). There's no quick way to see what was logged recently without navigating to `/historial`, which lists every bundle's full history rather than a short at-a-glance view for the active bundle.

## What Changes

- Add a "últimos entrenos" section to `app/(app)/page.tsx`, between the remaining-sessions counter and `SessionForm` — the counter and form themselves are unchanged.
- Show the 5 most recent sessions of the active bundle, most recent first: date, effort (using the same emoji/color mapping as `EffortSelector`), and note if present.
- When the active bundle has no sessions yet, show a simple message: "Aún no hay entrenos registrados en este bono."
- Add `getRecentSessions(bundleId, limit = 5)` to `lib/db.ts` — a new, bundle-scoped query, rather than reusing `listBundlesWithSessions` (which fetches every bundle and every session, unscoped, and would mean discarding almost all of that data just to get 5 rows for one bundle).
- Export the emoji/color mapping already defined inside `EffortSelector` so the recent-sessions list can render the same face/color per effort level without duplicating it.
- Out of scope: editing or deleting sessions, pagination beyond the 5 most recent, and any change to the remaining-sessions counter or the existing log-session form.

## Capabilities

### New Capabilities
- `home-dashboard`: a compact "recent sessions" list on the home page for the active bundle.

### Modified Capabilities
(none — `bundle-management`'s "Home Page Reflects Bundle State" requirement is about the counter/empty-state and is unchanged; `session-logging`'s effort-selector requirement is unchanged, only its emoji/color data becomes exported for reuse)

## Impact

- **Code**: `lib/db.ts` (new `getRecentSessions`), `components/EffortSelector.tsx` (export the emoji/color mapping), `app/(app)/page.tsx` (render the new list between the counter and the form).
- **No changes** to `logSession`, `getRemainingSessions`, `createNewBundle`, the schema, or `SessionForm`'s fields.
- **Dependencies**: none new.
