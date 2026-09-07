## Context

See proposal.md - Why/What Changes for motivation. Relevant current state:
- `app/(app)/historial/page.tsx` calls `listBundlesWithSessions()`, which already orders bundles `start_date desc, id desc` (bundle ordering is already correct, untouched by this change) but orders each bundle's `sessions` array ascending (`bundle_id, session_date`) — the opposite of what this change needs for session display order.
- `components/EffortSelector.tsx` exports `EFFORT_LEVELS` (value, emoji, `color`, `className`) since `home-dashboard`; `components/RecentSessions.tsx` already shows the pattern for looking up a level by effort value and rendering its emoji/color badge.

## Goals / Non-Goals

**Goals:**
- Sort each bundle's sessions most-recent-first for display, entirely in the page — no query changes.
- Reuse the exact emoji/color lookup pattern `RecentSessions` already established, rather than reinventing it.

**Non-Goals:**
- Changing `listBundlesWithSessions`'s SQL or return shape.
- Editing/deleting bundles or sessions, or pagination.

## Decisions

**Sort sessions client-side (well, server-render-side) in `historial/page.tsx`, not in the query.**
Since `listBundlesWithSessions` is explicitly out of scope (it also backs any other future consumer expecting ascending order), each bundle's `sessions` array is copied and sorted with `[...bundle.sessions].sort((a, b) => ...)` comparing `session_date` descending, then `id` descending as a tiebreak — the same rule `home-dashboard`'s `getRecentSessions` query uses, kept consistent even though this one sorts in JS instead of SQL.

**Reuse the effort-badge rendering by extracting a tiny shared helper, not by duplicating `RecentSessions`'s inline lookup.**
`RecentSessions.tsx` has an `effortDisplay(effort)` function that finds the matching `EFFORT_LEVELS` entry. This change moves that lookup into a small exported helper in `components/EffortSelector.tsx` (e.g. `getEffortLevel(value)`), and both `RecentSessions` and the history page use it — avoiding a second copy of the same `find` logic. Alternative considered: leaving `RecentSessions`'s local helper as-is and duplicating it in the history page — rejected since the two are byte-for-byte the same lookup.

**Active badge: a small inline label, not a separate component.**
A `<span>` reading "Activo" shown conditionally when `bundle.active`, styled with the app's existing green-for-active convention (already used before this change, just needs to read as a clear badge rather than plain colored text).

**Sessions-of-total: computed in the page from data already returned by `listBundlesWithSessions`.**
`bundle.sessions.length` out of `bundle.total_sessions` — no new query needed, since `listBundlesWithSessions` already returns each bundle's full sessions array.

## Risks / Trade-offs

- [Sorting in the page means every consumer of `listBundlesWithSessions` that wants a different order must sort it themselves] → Mitigation: accepted — this is the explicit trade-off of keeping the query unscoped/reusable and out of this change's scope; if a second consumer needs the same order, extracting a shared sort helper at that point is a small follow-up, not a reason to change the query now.
