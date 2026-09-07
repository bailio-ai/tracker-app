## Context

See proposal.md - Why/What Changes for motivation. Relevant current state:
- This project runs Next.js 16, which renamed the `middleware.ts` file convention to `proxy.ts` — this design uses `proxy.ts` directly.
- The file structure exists (empty/stub files) but none of the authentication logic has been implemented yet.

## Goals / Non-Goals

**Goals:**
- Close the one behavioral gap: an authenticated visitor hitting `/login` should land on `/`, not the login form.
- Keep the change confined to `proxy.ts`; no changes to the cookie shape, session token, or Server Actions.

**Non-Goals:**
- Rate limiting, lockouts, or brute-force protection on the login form.
- Rotating or randomizing the session token — the fixed HMAC-signed value is intentional (see Decisions).

## Decisions

**Extend `proxy.ts`'s matcher to include `/login`, and branch on session validity inside the function.**
Today's matcher (`"/((?!login|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons).*)"`) excludes `/login`, so proxy never runs there and an authenticated visitor can still see the login form. The fix: include `/login` in the matcher and, inside `proxy`, redirect to `/` when the request already carries a valid session cookie and the path is `/login`; otherwise keep the existing "redirect to `/login` when no valid session" behavior for every other path. Alternative considered: a second matcher entry just for `/login` — rejected, since a single matcher covering everything and branching in code is simpler than maintaining two matcher entries plus a shared cookie-validation call.

**Keep the fixed, HMAC-signed session token (no random per-login value).**
`createSessionToken()` derives a constant token from `APP_PASSWORD` via HMAC — the same value every login, compared with `timingSafeEqual`. This was already the implementation choice made for this app (see `lib/session.ts`) and this change does not revisit it: since there is one shared password and one session ever, a random per-login token would add complexity (needing server-side storage to validate it) without a corresponding security benefit.

**No changes to Server Actions or the login page.**
`login`/`logout` in `app/actions.ts` and the form in `app/login/page.tsx` already satisfy the spec's password-verification, cookie, and logout requirements as written — this design only touches `proxy.ts`.

## Risks / Trade-offs

- [A single fixed session token means anyone who obtains the cookie value has permanent access until it's rotated or expires] → Mitigation: accepted, matching the proposal's explicit scope (single trusted user, no rate limiting or rotation planned); the cookie is `httpOnly` and `secure` in production to limit exposure.
