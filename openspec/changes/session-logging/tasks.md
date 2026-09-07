## 1. Effort Selector Component

- [x] 1.1 Create `components/EffortSelector.tsx`: 5 radio inputs (`name="effort"`, values 1-5), each paired with a label showing an emoji (😄🙂😐😣🥵) and a red-to-green gradient color (1 green → 5 red) via `has-*`/`peer-checked` Tailwind classes
- [x] 1.2 None of the 5 options is checked by default (no `required`), so the field stays optional

## 2. Session Form Component

- [x] 2.1 Create `components/SessionForm.tsx`: a form posting to `logSession` from `@/app/actions`, using `<EffortSelector />` for effort
- [x] 2.2 Add a date input (`name="date"`) defaulting to today's date, editable
- [x] 2.3 Add a note input (`name="note"`), optional, placeholder "Algo que recordar de este entreno (opcional)"
- [x] 2.4 Keep the existing submit button ("Registrar entreno")

## 3. Wire Into Home Page

- [x] 3.1 In `app/(app)/page.tsx`, replace the inline log-session form markup with `<SessionForm />`

## 4. Verification

- [x] 4.1 Typecheck the project (`npx tsc --noEmit`) and confirm no errors — clean, plus `eslint` on the changed/new files
- [x] 4.2 Manually verify the form renders the date field, 5 effort options with emoji/colors, and the note field — verified via `curl` (date defaults to today, 5 radios present, correct placeholder) and confirmed visually in a live browser screenshot
- [x] 4.3 Manually verify selecting an effort option highlights only that option, and another selection replaces it — verified live in browser: clicking 😣 (4) highlighted it orange, then clicking 😄 (1) highlighted it green and deselected 4
- [x] 4.4 Manually verify submitting with no effort selected succeeds and logs a session with a null effort — verified by POSTing directly to the real `logSession` Server Action (200 OK), confirmed the stored row has `effort: null`
- [x] 4.5 Manually verify submitting with a past date logs the session under that date, and it shows correctly on `/historial` — verified by POSTing `date=2026-08-20` to `logSession`, confirmed `/historial` renders "20/8/2026" with the matching note; test data cleaned up afterward
