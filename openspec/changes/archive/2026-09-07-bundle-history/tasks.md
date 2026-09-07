## 1. Data Layer / Sorting

- [x] 1.1 In `app/(app)/historial/page.tsx`, sort each bundle's `sessions` array descending (most recent first) after fetching from `listBundlesWithSessions()` — no changes to the query itself

## 2. Effort Display

- [x] 2.1 Import the exported effort/emoji/color mapping from `components/EffortSelector.tsx` and use it to render each session's effort in `app/(app)/historial/page.tsx`, replacing any plain text/number display

## 3. Bundle Cards

- [x] 3.1 Add an "Activo" badge/label to the bundle whose `active` field is `true`
- [x] 3.2 Display each bundle's price, start date, and sessions logged out of total (e.g. "6 de 10")
- [x] 3.3 Style each bundle as a compact card/row consistent with the rest of the app (no dense table), containing its list of sessions (date, effort emoji/color, note if present)

## 4. Verification

- [x] 4.1 Typecheck the project (`npx tsc --noEmit`) and confirm no errors
- [x] 4.2 Manually verify the active bundle shows the "Activo" badge and past bundles don't
- [x] 4.3 Manually verify each bundle's sessions display most-recent-first
- [x] 4.4 Manually verify effort emoji/color in the history list matches the same value's appearance in the log-session form
- [x] 4.5 Manually verify the page renders correctly on a narrow (mobile) viewport