# Dreative Specialist Skill — Functional UX (everything works)

## Contract

Follow `../references/SKILL_CONTRACT.md`. This universal foundation has no
specialist dependency; pair it with `mobile` for all web delivery. Deliver the
preservation manifest, state inventory, semantic/keyboard behavior, feedback,
and functional audit evidence. It may never be deselected to fund visual work.
Done means routes, controls, forms, states, focus, hit areas, and failure paths
work without visual effects.

Load this file when `plan.skills` includes `ux`, for ANY product-register page,
and whenever a redesign touches navigation, forms, or stateful views. It EXTENDS
DESIGN.md §9 (the product floor) into a full working-page contract. Its premise:
a beautiful page where the menu doesn't open, a link 404s, or an effect eats
clicks is a FAILED page — visual craft cannot compensate for broken function.
This skill is the reason "immersive but broken" never ships: it defines what
"works" means, mechanically, and the runtime verification pass (SKILL.md) tests
against it.

## 0. The working-page contract

Every page you ship satisfies, verifiably:

1. Every visible control does something real (or is explicitly disabled with a
   reason). No dead buttons, no `href="#"`, no `onClick={() => {}}`.
2. Every navigation target resolves — internal routes exist, anchors match real
   ids, external links open safely (`rel="noopener"`, `target="_blank"` only
   for true externals).
3. Every stateful view renders all its states (loading/empty/error/success),
   not just the happy path.
4. Keyboard alone can operate everything a pointer can.
5. Nothing decorative intercepts input, blocks scroll, or steals focus.

## 1. Navigation

- **Links resolve.** Before shipping, list every `href`/`to`/`navigate` target
  and check each exists (route table, file, or real URL). A designed 404 is
  still a 404.
- **Active state**: the nav marks the current page/section (aria-current +
  visual). Section-scroll pages update it via IntersectionObserver.
- **Mobile menu is a component, not a hope**: opens AND closes (button, Esc,
  backdrop click, and on route change); scroll-locks the body while open
  (`overflow:hidden` on html, restore on close — with scrollbar-gutter
  compensation so the page doesn't shift); traps focus while open and returns
  focus to the trigger on close; the toggle reflects state
  (`aria-expanded`, icon morph). Test the open→navigate→back sequence — stale
  open menus after route changes are the #1 shipped-menu bug.
- **Anchors under fixed headers**: every in-page anchor target gets
  `scroll-margin-top` ≥ header height; smooth-scroll respects reduced-motion.
- **Logo → home. Back button works** — spatial/SPA transitions must not break
  history (immersive.md §1); modals and drawers close on back where users
  expect it (mobile especially).
- **Custom scroll (Lenis)** must not break anchors, keyboard scrolling
  (space/PgDn/arrows), or focus-into-view; wire `lenis.scrollTo` for anchor
  clicks and leave native behavior for the rest.

## 2. Forms

- Every form submits somewhere real, or is explicitly wired to a stub with a
  visible success simulation — never a button that swallows the click.
- Labels above inputs (placeholder-as-label banned, DESIGN.md §9);
  autocomplete attributes on identity fields; correct `type`/`inputmode`
  (email, tel, numeric) so mobile keyboards match.
- Validate on submit first (not on first keystroke); after first submit,
  re-validate per field on blur/change. Errors inline, next to the field,
  specific ("Enter a valid email"), with `aria-describedby` wiring and focus
  moved to the first invalid field.
- Submit feedback: button enters loading state (spinner inside, fixed width,
  interaction.md §5), double-submit prevented, success confirmed visibly
  (inline message or state change — not just a toast that may be missed),
  failure recoverable (inputs keep their values; never wipe a form on error).
- Enter submits single-field forms (newsletter). Required fields marked; the
  disabled-until-valid pattern only when errors show on hover/focus of the
  disabled button, otherwise keep the button enabled and validate on click.

## 3. State coverage (every data view)

For each list/table/feed/detail view, all four states are designed and
reachable: **loading** (skeleton shaped like the content, DESIGN.md §9),
**empty** (teaches the interface: what this will show + the action that fills
it — never a blank area or a lonely "No data"), **error** (what happened + a
retry affordance), **populated** (including the long-content case: 100 items,
40-character names, overflow handled per DESIGN.md §15). Async actions get
optimistic UI only when low-stakes (DESIGN.md §6); destructive actions get
confirmation and, ideally, undo instead of a scary modal.

## 4. Keyboard, focus, and the hit-area audit

- Full tab walk: every interactive element reachable in visual order, operable
  (Enter/Space), with a visible `:focus-visible` ring (interaction.md §0), and
  escapable (no traps outside intentional modal traps).
- Whatever hover reveals, focus reveals (cards' secondary actions, hover-woken
  media, dropdown menus). Custom gestures (drag, click-and-hold) always have a
  plain keyboard/click equivalent (cinematic.md §2).
- **The pointer-events audit** (the #1 cause of "cool but broken"): walk every
  overlay in the stacking order — canvases, gradient/grain layers, custom
  cursor layers, transition curtains, closed menus, preloaders — and verify
  each is `pointer-events: none` (or removed from the DOM) whenever it is not
  actively being interacted with. A finished preloader or a closed fullscreen
  menu sitting at `opacity:0` with pointer-events on is an invisible wall over
  the whole page. Then hit-test the controls: click every button/link at its
  visual position — if something above it swallows the click, that's a §15
  spatial-integrity fail, fix the layer not the button.
- Modals/drawers: focus trapped inside, Esc closes, focus returns to trigger,
  `aria-modal` + labelled; scrim click closes (unless data-loss risk).
- Semantic HTML first: real `<button>`/`<a>`/`<nav>`/`<main>`/headings in
  order — divs-with-onClick fail half this section automatically.

## 5. Scroll and layout stability

- Zero layout shift from async content: media boxes sized up front (media.md
  §5), fonts `swap` with metric-compatible fallbacks, skeletons the same size
  as what replaces them, no banners that push content after load.
- Scroll restoration: back/forward returns to the previous position (default
  browser behavior — don't break it with manual scroll-to-top on every route;
  scroll to top only on forward navigation to a NEW page).
- Fixed bars: content padded so nothing hides beneath them (DESIGN.md §15);
  100dvh not 100vh; no horizontal body scroll at 320px.
- Long pages get orientation aids: sticky nav or progress indication, and a
  footer that actually ends the page (no infinite-feeling voids).

## 6. Feedback and perceived performance

- Every async action acknowledges input within 100ms (pressed state, spinner,
  optimistic change) — silence after a click reads as broken even when it
  works.
- Toasts only for transient global events; they stack in ONE corner slot
  (DESIGN.md §15), auto-dismiss ≥ 4s, pause on hover, and are `aria-live`.
- Destructive/irreversible actions: confirm with specifics ("Delete 3 items?"),
  never bare "Are you sure?"; prefer undo-toast over confirm-modal when safe.
- Copy per DESIGN.md §8's UX-writing rules: buttons say what they do, errors
  say what to do next.

## 7. The functional audit (run at verification time)

This is the checklist the runtime verification pass (SKILL.md) executes with
browser tools — or walks mentally, file by file, when no browser exists:

1. Click every nav link + the logo; confirm each lands where labeled.
2. Open and close the mobile menu (both directions, plus Esc, plus navigate-
   while-open) at 390px width.
3. Submit each form empty → see inline errors; submit valid → see success
   state; confirm no double-submit.
4. Tab through the page start to finish; note any unreachable/invisible-focus/
   trapped stop.
5. Hit-test 5+ controls in effect-heavy regions (hero, canvas overlays,
   floating elements) — every click must land.
6. Trigger each data view's empty/error state if reachable (or verify the
   branch exists in code).
7. Console: zero uncaught errors during all of the above.

Report the result as a pass/fail list, fix fails, re-run the failed items once.
