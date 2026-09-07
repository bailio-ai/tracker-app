## 1. Session & Password Logic

- [x] 1.1 Create `lib/session.ts`: `createSessionToken()` (HMAC of a fixed value using `APP_PASSWORD` as key) and `verifySessionToken(token)` using `timingSafeEqual` — already present and committed (`c9c0843`) as `createSessionToken()` / `isValidSessionToken()`; functionally satisfies this task, kept as-is to avoid breaking existing imports
- [x] 1.2 In `app/actions.ts`, add `login(formData)` Server Action: compares submitted password to `process.env.APP_PASSWORD`, sets the session cookie on success — already present and committed, unchanged
- [x] 1.3 In `app/actions.ts`, add `logout()` Server Action: clears the session cookie and redirects to `/login` — already present and committed, unchanged

## 2. Login UI

- [x] 2.1 Create `app/login/page.tsx` with a password field and submit button calling `login` — already present and committed, unchanged
- [x] 2.2 Add a "Salir" button to `app/(app)/layout.tsx` calling `logout` — already present and committed, unchanged

## 3. Route Protection

- [x] 3.1 Create `proxy.ts` with `config.matcher` covering all routes except `_next/static`, `_next/image`, `favicon.ico`, `manifest.webmanifest`, `icons` — matcher previously also excluded `/login`; removed that exclusion so proxy runs on `/login` too
- [x] 3.2 In `proxy`, redirect unauthenticated requests (no valid session cookie) to `/login` — already present, preserved
- [x] 3.3 In `proxy`, redirect authenticated requests hitting `/login` to `/` — implemented (the one real gap)

## 4. Verification

- [x] 4.1 Manually verify: visiting `/login` while authenticated redirects to `/` — verified via `curl` against the local dev server with a validly-signed session cookie (307 → `/`)
- [x] 4.2 Manually verify: visiting `/login` while unauthenticated still shows the login form — verified via `curl` (200, no redirect)
- [x] 4.3 Manually verify: visiting a protected route while unauthenticated redirects to `/login` — verified via `curl` (307 → `/login`) for both `/` and `/historial`
- [ ] 4.4 Manually verify: logging in with the correct `APP_PASSWORD`, then logging out, returns to the unauthenticated state — NOT verified end-to-end: browser automation was blocked by this session's permission classifier, so the actual login form submission (a Next.js Server Action) couldn't be exercised through the UI. The "logout returns to unauthenticated" half is implied by 4.3 (no valid cookie → redirected to `/login`) plus the unchanged `logout()` code, but the login form submission itself is unverified live