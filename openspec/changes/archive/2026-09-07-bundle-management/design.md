## Context

See proposal.md - Why/What Changes for motivation. Relevant current state:
- `lib/db.ts` already has `createBundle`, `getActiveBundle`, `createSession`, `countSessionsForBundle`, `listBundlesWithSessions` (from `db-schema`), all operating on `bundles`/`sessions`.
- `app/actions.ts`, `app/(app)/page.tsx`, and `app/(app)/historial/page.tsx` still reference the old `bonos`/`entrenos` tables directly via `query()`, which is why `/` and `/historial` 500 today.
- The existing `crearBono`/`registrarEntreno` pattern (plain Server Actions bound to `<form action={...}>`, throwing a plain `Error` on invalid input) is the established convention in this codebase — this change follows it rather than introducing `useActionState`/error-state plumbing that the login form uses for a different reason (surfacing a validation message inline without a full page error).

## Goals / Non-Goals

**Goals:**
- Get `/` and `/historial` back to rendering without errors, backed by `bundles`/`sessions`.
- Keep the Server Action surface small: `createNewBundle`, `getRemainingSessions`, `logSession`, replacing `crearBono`/`registrarEntreno`.

**Non-Goals:**
- Editing or deleting bundles/sessions.
- Any change to `lib/db.ts`, the schema, or authentication.

## Decisions

**`getRemainingSessions()` returns a discriminated union, not `null`.**
`{ status: "active"; bundleId: number; remaining: number; totalSessions: number } | { status: "none" }`. Alternative considered: returning `null` for "no active bundle" (matching the proposal's "devolver null o un estado explícito" wording) — rejected in favor of the explicit tag because `page.tsx` needs to branch on this exact condition, and `status: "none"` reads unambiguously at the call site versus a `null` that could also mean "not loaded yet" in other contexts.

**`logSession` and `createNewBundle` throw a plain `Error` on invalid state, matching the existing `crearBono` convention.**
`logSession` throws `"No hay bono activo"` when `getActiveBundle()` returns nothing, instead of returning a result object. Alternative considered: a `useActionState`-based result type (like `login`) — rejected because these actions are fire-and-forget form submissions with no inline field-level error to show (the home page only ever renders the log-session form when an active bundle is already known to exist), so a thrown error surfaced by Next.js's default error handling is simpler and consistent with `crearBono`'s existing pattern.

**Home page calls the new Server Actions directly as async functions (no client-side fetch).**
`app/(app)/page.tsx` stays a Server Component; it `await`s `getRemainingSessions()` directly, the same way it previously awaited a local `getBonoActivo()` helper. Server Actions are plain async functions and are legal to call from Server Components.

**The log-session form no longer binds a bundle id.**
The old `registrarEntreno` took `bonoId` via `.bind(null, bono.id)` because the caller had already fetched it. `logSession` looks up the active bundle itself via `getActiveBundle()`, so the form only needs to submit `effort` and an optional `note` — simpler markup, and it can't accidentally log against a stale bundle id from a cached page.

**Remove `crearBono`/`registrarEntreno` and the `query` import from `app/actions.ts` once unused.**
Nothing else in the app references them after this migration; leaving dead code referencing dropped tables would be misleading.

## Risks / Trade-offs

- [Between reading "remaining sessions" and submitting a log, the active bundle could change out from under a stale page] → Mitigation: accepted as-is, matching the app's existing single-user, low-concurrency profile (same trade-off already accepted for `bundles_one_active` in `db-schema`'s design).
