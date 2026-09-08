## Why

The app is used on a phone during a gym session, but today it only opens as a browser tab. Making it installable (Android home screen via Chrome's install prompt, "Add to Home Screen" on iOS Safari) gives it a standalone, no-address-bar experience closer to a native app for that use case.

## What Changes

- Extend the existing `app/manifest.ts` (Next.js App Router's native manifest route — already present with a basic `name`/`start_url`/`display: standalone`/`theme_color` but no real icons) rather than adding a separate `public/manifest.json`, since the two would conflict as duplicate manifest sources for the same app. Set `short_name` to "Entrenos" (currently duplicates the full name, too long under a home screen icon) and add a maskable icon entry.
- Generate real icon assets under `public/icons/` (currently only a placeholder README, referenced files were never created): 192×192 and 512×512 standard icons, a 512×512 maskable icon, and a 180×180 `apple-touch-icon.png` — from a simple generated mark, since the app has no existing logo.
- Add PWA meta tags to `app/layout.tsx`: `apple-touch-icon` link, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, and extend the viewport export to include `viewport-fit=cover` and `theme-color` (the manifest's `theme_color` only affects the installed PWA's own chrome, not the in-page `<meta name="theme-color">` tag — that needs its own `viewport.themeColor` entry, reusing the same `#000000`).
- Add a minimal `public/sw.js` service worker — registered from a small client component mounted in the root layout — whose only job is to be an installability signal for Chrome/Android; it does not cache any pages or data.
- Out of scope: full offline support, push notifications, and caching of dynamic/DB-backed pages (every page depends on live database state, so there is nothing sensible to serve offline).

## Capabilities

### New Capabilities
- `pwa-install`: the app is installable to a device home screen with a standalone display mode, a home-screen icon, and iOS-specific meta tags, backed by a registered (non-caching) service worker.

### Modified Capabilities
(none)

## Impact

- **Code**: `app/manifest.ts`, `app/layout.tsx`, `public/icons/` (new PNG assets), `public/sw.js` (new), a new small client component to register the service worker.
- **No changes** to `lib/db.ts`, `app/actions.ts`, existing page behavior, or any Server Action.
- **Dependencies**: none new at runtime — icon generation during implementation uses tooling already available locally (e.g. `sharp`, already present in `node_modules`), not a new app dependency.
