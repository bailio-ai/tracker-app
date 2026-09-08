## Context

See proposal.md - Why/What Changes for motivation. Relevant current state:
- `app/manifest.ts` already exists (added incidentally in the `db-schema` change) using Next.js App Router's native manifest convention — Next serves it at `/manifest.webmanifest` and injects the matching `<link rel="manifest">` and `<meta name="theme-color">` tags automatically. It has `name`, `short_name` (both currently "Bono Entrenos"), `start_url`, `display: standalone`, `background_color: #ffffff`, `theme_color: #000000`, and an `icons` array pointing at two PNGs that were never generated.
- `public/icons/README.md` is a placeholder noting the two missing icon files; no icon assets exist anywhere in `public/`.
- `app/layout.tsx` has no `viewport` export (Next defaults it: `width=device-width, initial-scale=1`, no `viewport-fit`) and no Apple-specific tags.
- The app's visual language elsewhere is black/white with zinc grays (buttons `bg-black`/`dark:bg-white`, cards on `bg-zinc-50`/`bg-black` in dark mode) and no existing logo or brand mark.
- `sharp` is present in `node_modules` (a transitive dependency), usable for icon rasterization without adding a new dependency.

## Goals / Non-Goals

**Goals:**
- Reuse and complete the existing `app/manifest.ts` rather than introducing a competing `public/manifest.json`.
- Produce real icon files (192, 512, 512 maskable, 180 apple-touch-icon) from a simple generated mark consistent with the app's existing black/white palette.
- Make the app installable on Chrome/Android and give it a standalone-looking icon/launch on iOS Safari.
- Register a service worker whose only purpose is satisfying Chrome's installability requirement.

**Non-Goals:**
- Offline support, background sync, or push notifications.
- Caching any page or data response — every page renders from live Postgres data, and stale cached data would be actively misleading (e.g. a session count that's wrong).
- A designed logo/brand identity — the icon is a simple placeholder mark, not a final brand asset.

## Decisions

**Keep `app/manifest.ts` as the single manifest source; do not add `public/manifest.json`.**
Next.js's App Router already generates the manifest route and its `<link rel="manifest">`/`theme-color` tags from `app/manifest.ts`. Adding a static `public/manifest.json` alongside it would create two manifest documents and ambiguity about which one browsers use. Alternative considered: delete `app/manifest.ts` and hand-write `public/manifest.json` as the user's request literally described — rejected because it throws away working, idiomatic Next.js metadata generation for no behavioral benefit.

**Icon mark: a simple monogram/symbol rendered as SVG, then rasterized to PNG at each required size.**
Since there's no existing logo, generate one flat-color SVG (e.g. a bold "B" or a simple dumbbell glyph) using the app's existing black (`#000000`) on white, and rasterize it with `sharp` (already available) to `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` (180×180, opaque background per Apple's requirement — transparent PNGs render with a black box on iOS). Alternative considered: hand-authoring PNGs in an external tool — rejected, not scriptable/reproducible and no design tool is part of this workflow.

**Maskable icon: same mark, redrawn with ~40% safe-zone padding on a solid background, as a separate 512×512 file.**
Maskable icons must tolerate aggressive cropping (circle, squircle, etc.); reusing the "any" icon directly risks the mark being clipped. A dedicated `icon-maskable-512.png` keeps the glyph inside the safe zone. Declared in the manifest as a second icons entry with `purpose: "maskable"`, alongside the existing entries kept as `purpose: "any"`.

**Service worker: a static `public/sw.js` with an empty `fetch` passthrough (or no `fetch` handler at all) and only `install`/`activate` handlers that call `skipWaiting()`/`clients.claim()`.**
Chrome's install heuristic requires a registered service worker but does not require it to serve anything from cache. A no-op worker (no `caches.open`, no interception of dynamic responses) satisfies installability while guaranteeing the app can't serve stale DB-backed data offline. Alternative considered: precaching the app shell (static assets only, never page data) — rejected as unnecessary complexity for a requirement that's purely "must exist and be registered," and it risks someone later extending the cache to pages by mistake.

**Service worker registration: a small `"use client"` component mounted once in the root layout, registering `/sw.js` in a `useEffect` guarded by `"serviceWorker" in navigator`.**
Keeps registration out of Server Components (registration is a browser-only API) without turning the whole layout into a client component.

**Viewport: add an explicit `viewport` export in `app/layout.tsx` with `viewportFit: "cover"` and `themeColor: "#000000"`, alongside the existing implicit width/initial-scale defaults.**
Next.js's default viewport already covers `width`/`initial-scale`; `viewport-fit=cover` needs adding for notch support. `themeColor` also belongs here, not in `manifest.ts`: confirmed by inspecting the installed page (`app/manifest.ts`'s `theme_color` only affects the manifest document itself, not an in-page `<meta name="theme-color">` tag) that no such tag was emitted without it — corrected from the original assumption in proposal.md. Both use Next's typed `Viewport` export rather than a hand-written `<meta>` tag, staying consistent with how `manifest.ts` already uses the typed Metadata APIs.

## Risks / Trade-offs

- [Generated placeholder icon is not a real brand mark] → Mitigation: accepted for this change; swapping in a designed logo later is a two-file replacement (regenerate the same sizes), not a structural change.
- [`short_name` change from "Bono Entrenos" to "Entrenos" affects any already-installed instance's label on next manifest fetch] → Mitigation: no one has installed it yet (icons never existed to make it installable), so there's no real installed base to disrupt.
- [A no-op service worker still occupies the service-worker registration for the origin, which could complicate adding real offline support later] → Mitigation: accepted — same file can be extended in place later; explicitly out of scope now per the proposal.
