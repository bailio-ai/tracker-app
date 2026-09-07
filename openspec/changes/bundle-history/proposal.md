## Why

`/historial` already lists bundles and their sessions via `listBundlesWithSessions` (`bundle-management`), but it predates `session-logging`'s visual effort selector and `home-dashboard`'s recent-sessions list — it still shows effort as a plain number, doesn't order sessions within a bundle, and doesn't flag which bundle is active. It needs to look and read consistently with the rest of the app.

## What Changes

- Replace each session's plain-number effort with the same emoji/color from `EFFORT_LEVELS` (exported from `components/EffortSelector.tsx`) that `session-logging` and `home-dashboard` already use, so effort looks the same everywhere in the app.
- Sort each bundle's sessions most-recent-first (`session_date desc, id desc`) for display — `listBundlesWithSessions` returns them ascending; this change sorts them in the page, not in the query, since the query's ordering is out of scope.
- Add a visible "Activo" badge/label on the bundle with `active = true`, distinguishing it from past bundles at a glance.
- Show sessions-logged-of-total per bundle (e.g. "6 de 10") alongside price and start date.
- Restyle as compact, mobile-friendly cards/rows consistent with the home page and `RecentSessions`, not a dense table.
- Out of scope: editing/deleting bundles or sessions, pagination, and any change to `listBundlesWithSessions`, `getRecentSessions`, or any Server Action.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `bundle-management`: the "History Page Reflects All Bundles" requirement gains detail — session ordering within a bundle, an active-bundle indicator, and sessions-logged-of-total — without changing the underlying data source.

## Impact

- **Code**: `app/(app)/historial/page.tsx` only.
- **No changes** to `lib/db.ts`, `app/actions.ts`, or the schema.
- **Dependencies**: none new — reuses `EFFORT_LEVELS` from `components/EffortSelector.tsx`.
