## Context

See proposal.md - Why/What Changes for motivation. Relevant current state:
- `app/(app)/page.tsx` renders the remaining-sessions counter and `<SessionForm />` when `getRemainingSessions()` returns `status: "active"`, which already carries `bundleId`.
- `lib/db.ts` has `listBundlesWithSessions()` (all bundles, all sessions, unscoped) and `countSessionsForBundle(bundleId)` (scoped, count-only) — neither fits "5 most recent sessions for one bundle" without either overfetching or missing the row data entirely.
- `components/EffortSelector.tsx` defines `EFFORT_LEVELS` (value, emoji, Tailwind class per level 1-5) as a module-private constant.

## Goals / Non-Goals

**Goals:**
- Add a bundle-scoped, limited query rather than adapting an unscoped one.
- Reuse `EffortSelector`'s emoji/color data for the recent-sessions list instead of redefining it.

**Non-Goals:**
- Touching `logSession`, `getRemainingSessions`, `createNewBundle`, or the schema.
- Any editing/deleting/pagination UI for sessions.

## Decisions

**New query `getRecentSessions(bundleId, limit = 5)` in `lib/db.ts`, not a reuse of `listBundlesWithSessions`.**
`listBundlesWithSessions` fetches every bundle and every session in the database with no scoping or limit — using it here would mean fetching the entire session history just to keep 5 rows for one bundle, which gets worse as the app accumulates history over time. A single `select * from sessions where bundle_id = $1 order by session_date desc, id desc limit $2` is a proper fit: scoped, bounded, and doesn't duplicate `listBundlesWithSessions`'s logic (that function still exists for the full-history `/historial` view, untouched by this change).

**Export `EFFORT_LEVELS` (or an equivalent lookup) from `EffortSelector.tsx` instead of duplicating the emoji/color map.**
Change the module-private `const EFFORT_LEVELS` to an exported constant (or add an exported `getEffortDisplay(value)` helper built on it), so the new recent-sessions row component looks up the same emoji/`className` pair `EffortSelector` uses per level. This directly satisfies `session-logging`'s existing "Reusable Effort Selector" intent — the data becomes reusable even though the selector's interactive radio markup isn't what's reused here (a session row shows a static face, not a picker).

**Rendering approach: a small server-rendered list, no new client component.**
The recent-sessions section is read-only and needs no interactivity, so it's rendered directly in `app/(app)/page.tsx` (or a small presentational component) as a Server Component, consistent with the rest of the page.

**Ordering tie-break: `order by session_date desc, id desc`.**
`session_date` is a `DATE` column (no time-of-day), so two sessions logged the same day would otherwise tie; ordering by `id desc` as a secondary key keeps "most recently created" as the tiebreak, matching user expectation for "most recent first."

## Risks / Trade-offs

- [If a user logs a same-day session with an earlier `session_date` than an already-existing later-dated one, the `id desc` tiebreak only orders by insertion order, not by any notion of "true" recency for backdated entries] → Mitigation: accepted — this is inherent to allowing editable past dates (`session-logging`), and matches how `/historial` already ties, sessions ordered chronologically first.
