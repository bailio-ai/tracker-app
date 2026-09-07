## 1. Data Layer

- [x] 1.1 In `lib/db.ts`, add `getRecentSessions(bundleId: number, limit = 5): Promise<Session[]>` querying `sessions` scoped to `bundle_id`, ordered `session_date desc, id desc`, limited to `limit`

## 2. Shared Effort Display Data

- [x] 2.1 In `components/EffortSelector.tsx`, export `EFFORT_LEVELS` (or an equivalent lookup) so the emoji/color per effort value can be reused outside the selector — also added a plain `color` (bg-*) field per level alongside the existing `has-[:checked]:` `className`, since a static display row needs an unconditional color, not a checked-state variant

## 3. Recent Sessions List

- [x] 3.1 In `app/(app)/page.tsx` (or a small presentational component it renders), fetch `getRecentSessions(bundleId)` for the active bundle and render up to 5 rows between the remaining-sessions counter and `<SessionForm />` — implemented as `components/RecentSessions.tsx`
- [x] 3.2 Each row shows the session's date, its effort's emoji/color (via the exported `EFFORT_LEVELS` mapping) when present, and its note when present
- [x] 3.3 When the active bundle has no sessions, show "Aún no hay entrenos registrados en este bono." instead of an empty list
- [x] 3.4 Style the list as a compact, mobile-friendly set of rows consistent with the rest of the page (no table)

## 4. Verification

- [x] 4.1 Typecheck the project (`npx tsc --noEmit`) and confirm no errors — clean, plus `eslint` on the changed/new files
- [x] 4.2 Manually verify the empty-sessions message shows for a freshly created bundle with no sessions — verified via `curl` against the local dev server
- [x] 4.3 Manually verify logging more than 5 sessions shows only the 5 most recent, most-recent first — verified by seeding 7 sessions and confirming exactly 5 rows rendered, ordered 25/8 → 5/8 (the 2 oldest excluded)
- [x] 4.4 Manually verify a session's emoji/color in the list matches the same effort value's appearance in the log-session form's selector — verified: effort 1→😄, 2→🙂, 3→😐, 4→😣, 5→🥵, matching `EFFORT_LEVELS`
- [x] 4.5 Manually verify the remaining-sessions counter and the log-session form are unaffected (same behavior as before this change) — verified: counter correctly showed "3 / 10" (10 total − 7 sessions), and the date field, 5 effort radios, and note placeholder all unchanged; test data cleaned up afterward
