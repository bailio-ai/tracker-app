## Why

The tracker app has exactly one user and no need for accounts, roles, or password recovery — it just needs to keep the URL from being usable by anyone who finds it. A full auth library would be overkill; a single shared password checked server-side, backed by a long-lived session cookie, is enough and keeps the mobile experience from requiring frequent re-logins.

## What Changes

- Implement the `static-auth` capability from scratch: `APP_PASSWORD` (env var, no user table, no hashing) compared server-side inside a Server Action (`login` in `app/actions.ts`), never shipped to the client bundle.
- On a correct password, set an `httpOnly`, `sameSite=lax` cookie (`secure` in production) with a fixed, HMAC-signed session value (`lib/session.ts`) — no JWT, no per-login randomness — with a 30-day lifetime so mobile use doesn't require frequent re-logins.
- Build `app/login/page.tsx`: a form with a single password field calling the `login` Server Action.
- Build `proxy.ts` to gate every route except `/login` and static assets, redirecting unauthenticated requests to `/login`, and redirecting an already-authenticated visitor away from `/login` to `/`.
- Build `logout` Server Action to clear the session cookie and redirect to `/login`, wired to a "Salir" button in `app/(app)/layout.tsx`.
- Out of scope: multi-user accounts, password hashing/rotation, rate limiting on login attempts, and any UI beyond the login form.

## Capabilities

### New Capabilities
- `static-auth`: single shared-password authentication gate protecting the whole app (login, session cookie, route protection, logout).

### Modified Capabilities
(none — no existing specs cover authentication)

## Impact

- **Environment**: `APP_PASSWORD` must be set in `.env.local` for local development and in Vercel's production environment variables — an operational step, not a code change.
- **Dependencies**: none new — uses `node:crypto` (already in `lib/session.ts`) and Next.js's built-in cookie/proxy APIs.
