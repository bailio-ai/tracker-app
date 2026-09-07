## 1. Server Actions

- [x] 1.1 In `app/actions.ts`, add `createNewBundle(price, startDate, totalSessions?)` calling `createBundle` from `lib/db.ts`, then `revalidatePath("/")` and `revalidatePath("/historial")` — implemented as `createNewBundle(formData: FormData)`, matching the existing `crearBono` FormData-action convention documented in design.md
- [x] 1.2 In `app/actions.ts`, add `getRemainingSessions()` returning `{ status: "active", bundleId, remaining, totalSessions }` when an active bundle exists (using `getActiveBundle` + `countSessionsForBundle`), or `{ status: "none" }` when it doesn't
- [x] 1.3 In `app/actions.ts`, add `logSession(effort, note?, date?)` that looks up the active bundle via `getActiveBundle`, throws `"No hay bono activo"` if there is none, otherwise calls `createSession` and revalidates `/` and `/historial` — implemented as `logSession(formData: FormData)` reading `effort`/`note`/`date` fields, same FormData convention
- [x] 1.4 Remove `crearBono` and `registrarEntreno` from `app/actions.ts`
- [x] 1.5 Remove the now-unused `query` import from `app/actions.ts` (keep `SESSION_COOKIE`/`createSessionToken` imports for `login`/`logout`)

## 2. Home Page

- [x] 2.1 Rewrite `app/(app)/page.tsx` to call `getRemainingSessions()` instead of the local `getBonoActivo`/`bonos` query
- [x] 2.2 When `status === "active"`, render remaining/total sessions and a "Registrar entreno" form calling `logSession` (effort input, optional note, no bundle id needed)
- [x] 2.3 When `status === "none"`, render an empty state with a form calling `createNewBundle` (price and start date inputs)

## 3. History Page

- [x] 3.1 Rewrite `app/(app)/historial/page.tsx` to call `listBundlesWithSessions()` instead of querying `bonos`/`entrenos`
- [x] 3.2 Render each bundle (price, start date, active/completed status) together with its list of sessions (date, effort, note)

## 4. Verification

- [x] 4.1 Typecheck the project (`npx tsc --noEmit`) and confirm no errors in the changed files — clean, plus `eslint` on the changed files
- [x] 4.2 Manually verify `/` loads without a 500, in both the "active bundle" and "no active bundle" states — verified via `curl` against the local dev server (both 200)
- [x] 4.3 Manually verify `/historial` loads without a 500 and reflects created bundles/sessions — verified via `curl`, both empty and populated
- [x] 4.4 Manually verify creating a bundle, logging a session against it, and seeing both reflected on `/` and `/historial` — verified by POSTing directly to the real `createNewBundle`/`logSession` Server Actions over HTTP (replicating the no-JS progressive-enhancement form submit protocol, using the actual `$ACTION_ID_*` hidden fields rendered in the page), confirming remaining sessions went 8 → 7 on `/` and the new bundle/session appeared on `/historial`; test data cleaned up afterward
