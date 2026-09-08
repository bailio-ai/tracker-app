## 1. Icon Assets

- [x] 1.1 Create a simple flat-color SVG mark (black on white, consistent with the app's existing palette) to serve as a placeholder icon
- [x] 1.2 Rasterize the mark to `public/icons/icon-192.png` (192×192) and `public/icons/icon-512.png` (512×512), purpose "any"
- [x] 1.3 Create a maskable variant of the mark with ~40% safe-zone padding and rasterize it to `public/icons/icon-maskable-512.png` (512×512)
- [x] 1.4 Rasterize an opaque (non-transparent background) 180×180 `public/icons/apple-touch-icon.png`
- [x] 1.5 Remove the now-outdated `public/icons/README.md` placeholder

## 2. Manifest

- [x] 2.1 In `app/manifest.ts`, change `short_name` to "Entrenos"
- [x] 2.2 Update the `icons` array to reference the generated `icon-192.png` and `icon-512.png` with `purpose: "any"`, and add the `icon-maskable-512.png` entry with `purpose: "maskable"`

## 3. Layout Meta Tags

- [x] 3.1 In `app/layout.tsx`, add an exported `viewport` (Next `Viewport` type) including `viewportFit: "cover"` alongside the existing default width/initial-scale behavior
- [x] 3.2 Add `apple-touch-icon` link, `apple-mobile-web-app-capable: yes`, and `apple-mobile-web-app-status-bar-style: default` to the page metadata/head (via the `Metadata` export's `icons`/`other` fields or a direct `<link>`/`<meta>` in the root layout, whichever Next's App Router metadata API supports cleanly)

## 4. Service Worker

- [x] 4.1 Create `public/sw.js`: `install` handler calling `self.skipWaiting()`, `activate` handler calling `self.clients.claim()`, no `fetch` handler and no cache usage
- [x] 4.2 Create a `"use client"` component (e.g. `components/ServiceWorkerRegister.tsx`) that registers `/sw.js` in a `useEffect`, guarded by `"serviceWorker" in navigator`
- [x] 4.3 Mount that component once in `app/layout.tsx`'s root layout

## 5. Verification

- [x] 5.1 Typecheck the project (`npx tsc --noEmit`) and confirm no errors
- [x] 5.2 Run the app locally and confirm `/manifest.webmanifest` (or the path Next serves `app/manifest.ts` at) returns valid JSON with `short_name: "Entrenos"` and all three icon sizes
- [x] 5.3 Confirm in DevTools > Application that the service worker registers successfully with no console errors, and that it is not intercepting any `fetch` requests
- [x] 5.4 Confirm the root layout's rendered `<head>` includes the apple-touch-icon link and both `apple-mobile-web-app-*` meta tags
- [ ] 5.5 On a deployed (HTTPS) build, confirm Chrome/Android shows the "Add to Home Screen" / install prompt, and that opening the installed app shows no browser address bar (standalone mode)
- [ ] 5.6 On iOS Safari, confirm "Add to Home Screen" uses the apple-touch-icon and that opening it from the home screen launches without Safari's browser chrome
