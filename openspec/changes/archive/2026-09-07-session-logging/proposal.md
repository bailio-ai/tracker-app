## Why

`bundle-management` wired the "Registrar entreno" form to the real `logSession` Server Action, but with a minimal UI — a plain effort `<select>` and a text input, no date field. The form needs its intended design: a visible/editable date, a touch-friendly 1-5 effort selector with emoji and a red-to-green color gradient, and an optional note — without touching the Server Action or data layer that already work correctly.

## What Changes

- Add a date input to the log-session form, defaulting to today, editable so a past session can be logged (the database already defaults `session_date` to `CURRENT_DATE`, but the UI didn't expose the field).
- Replace the generic effort `<select>` with a row of 5 selectable buttons (radio-style, not a dropdown, for comfortable mobile tapping), each showing an emoji and a color from a red-to-green gradient: 1 😄 green, 2 🙂 yellow-green, 3 😐 yellow, 4 😣 orange, 5 🥵 red. Selecting none is valid — `effort` stays optional, matching the nullable column.
- Keep the note field, switched to a placeholder that reads "Algo que recordar de este entreno (opcional)".
- Extract this into reusable components — `components/SessionForm.tsx` for the form and `components/EffortSelector.tsx` for the 1-5 selector specifically — instead of leaving it inline in `app/(app)/page.tsx`, so the effort selector can be reused later (e.g. editing a past session).
- Out of scope: `lib/db.ts`, `logSession`, the schema, and the active-bundle logic — this is UI-only over the existing, working Server Action.

## Capabilities

### New Capabilities
- `session-logging`: the log-session form's UI — date, effort selector, and note fields — as a reusable component.

### Modified Capabilities
(none — `bundle-management`'s "Log Session Against Active Bundle" requirement covers the business logic and is unchanged; this only changes what the form looks like)

## Impact

- **Code**: new `components/SessionForm.tsx` and `components/EffortSelector.tsx`; `app/(app)/page.tsx` renders `<SessionForm />` instead of its inline form markup.
- **No changes** to `app/actions.ts`, `lib/db.ts`, or the database schema.
- **Dependencies**: none new — plain HTML radio inputs and Tailwind classes, no new libraries.
