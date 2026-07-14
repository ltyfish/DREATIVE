# Dreative Specialist Skill — Mobile Excellence

## Contract

Universal foundation: ux and baseline mobile apply to every web page.

Follow `../references/SKILL_CONTRACT.md`. Dependency: `ux`. This skill is
universal for web work. Deliver a section-by-section mobile translation, touch
targets, responsive media/effect budgets, a page-level mobile blueprint, and
390×844 plus 320px verification.
It is never satisfied by shrinking desktop. Done means navigation, content,
forms, orientation/viewport behavior, performance, and reduced motion pass on a
coarse pointer.

Load this file when `plan.skills` includes `mobile`, when the brief says
mobile-first / most users are on phones / "make the mobile version great", or
when an app-register product is primarily used on mobile. It EXTENDS DESIGN.md
§13 (which governs how desktop effects DEGRADE); this file is about designing
mobile as a first-class surface in its own right — clean, tidy, and still
genuinely animated and premium, just calibrated to a 390px viewport, a thumb,
and a battery. It STACKS with whatever treatments were chosen: motion/3d/
immersive briefs get their mobile-native expression here, never a cropped
desktop.

## 0. The register: calm confidence, not shrunken desktop

Mobile premium reads differently from desktop premium: less simultaneous
motion, more focus per viewport, perfect ergonomics. The dial translation:
desktop ambition N ≈ mobile ambition N−2. A desktop dial-8 site ships a
dial-6 phone experience that feels JUST as crafted — one hero moment, silky
scroll reveals, tactile presses — rather than a stuttering copy of the desktop
choreography.

- **One idea per viewport.** The phone viewport is a frame; compose each
  screenful like one (hero = one headline + one visual + one CTA, nothing
  else). If a desktop section held three things, the mobile version stacks
  them as three clean beats or cuts to the strongest one.
- **Task pages are task-first.** The first viewport exposes what the user needs
  to act, the current state, and the primary action. Supporting explanation
  follows; promotional or decorative panels never block the task without a
  page-specific reason recorded in the blueprint.
- **Tidy is the aesthetic.** Consistent gutters (20-24px), one column
  discipline, generous vertical rhythm (56-80px between sections), no element
  closer than 8px to another. Clutter reads twice as loud at 390px.
- **Type recalibrated, not just clamped**: hero 2-3rem (2 lines max with the
  REAL copy), body stays ≥16px, line-length falls out of the gutters — check
  headlines don't orphan single words (`text-wrap: balance`).

## 1. Layout patterns that are mobile-native

- Asymmetric desktop grids collapse to intentional single-column ORDER
  (decide what comes first — usually visual → headline → support → CTA), not
  DOM-order accidents. Check the collapsed order reads as a story.
- Horizontal scroll is mobile's extra axis: card shelves, galleries, and
  chip rows as swipeable strips (`overflow-x-auto` + `scroll-snap-type: x
  mandatory` on short strips, edge inset, visible peek of the next card —
  the peek IS the affordance; no scrollbars, no arrows).
- Sticky bottom bar for the primary action on conversion/product pages
  (add-to-cart, main CTA): thumb-reach beats footer CTA; respect
  `env(safe-area-inset-bottom)`.
- Accordions/tabs for secondary density (specs, FAQs) instead of long walls;
  tables become stacked cards or a scrollable container with sticky first
  column — never squeezed 6-column tables.
- Nav: the fullscreen menu is mobile's one theatrical moment — staggered
  link entrance (line-mask, 60ms stagger), big touch-sized links (≥ 48px
  rows), contact/socials in the footer of the overlay. Wired per ux.md §1
  (focus trap, scroll lock, Esc/back closes).

## 2. Motion on mobile (shorter, lighter, still authored)

The motion inventory scaled to touch (extends motion.md §5):

- **Keep**: the experience's defining transformation in a shorter form when it
  remains readable, plus line-mask headline reveals, selected in-view moments,
  and press states on
  EVERYTHING tappable (`active:scale-[0.98]` — on mobile this is the main
  interaction feedback, since hover doesn't exist), marquees (pause
  off-screen), counters, accordion springs.
- **Translate**: parallax halves or dies (§13); pinned sequences → short
  measured sticky sections, clip-path/layer handoffs, or plain stacked beats; hover-woken media
  → in-view-woken (loop plays while ≥ 60% visible, pauses off-screen) or
  tap-to-play; magnetic/cursor effects → gone entirely, replaced by press
  feedback; drag-to-explore → swipe carousel or index list as PRIMARY
  (DESIGN.md §13).
- **Avoid on mobile**: smooth-scroll libraries at full strength (Lenis: disable
  or `syncTouch` carefully — fighting native momentum feels broken), competing
  scrubbed sequences, dense simultaneous animation, and any effect that misses
  the measured frame-time target on a mid-range phone.
- Scroll reveals trigger earlier (`margin: "-10% 0px"` not -20%) — mobile
  viewports are short and users scroll fast; late reveals = users see blank.

## 3. 3D and heavy media on mobile

- Choose from a simplified live scene, a pre-rendered loop, layered DOM/SVG, or
  an intentional poster composition according to concept and measured device
  cost (3d.md §5, media.md). Do not simply erase the defining moment.
- If live 3D ships: dpr capped at 2, sim/particle counts halved, post-FX off,
  `frameloop="demand"` where possible, pause on scroll-out and
  `document.hidden`. Test the thermal story: 30s of idling must not heat the
  phone (no full-rate rAF on static scenes).
- Video: one playing loop per viewport, ≤ 2MB mobile variants
  (`<source media>` or renditions), `playsinline` mandatory, poster always.
- Images: serve mobile-sized renditions (`srcset/sizes`) — a 2400px hero on a
  390px screen is a failed budget even when it looks fine.

## 4. Ergonomics (the thumb is the cursor)

- Tap targets ≥ 44px (48px preferred) with ≥ 8px gaps; small text links get
  padded hit areas. Primary actions in the bottom half on app-register
  screens; destructive actions OUT of easy thumb reach.
- Respect the gesture map: horizontal edge swipes (back), bottom edge (home)
  — don't hang custom gestures on them; carousels stop 16px short of edges.
- Inputs: correct `type/inputmode/autocomplete` (ux.md §2), font-size ≥ 16px
  (iOS zoom), the focused field scrolls above the keyboard, forms in one
  column, no fixed elements covering inputs while the keyboard is up.
- Safe areas: `viewport-fit=cover` + `env(safe-area-inset-*)` padding on
  fixed bars/corners; nothing under the notch or home indicator.
- No hover-dependent anything: whatever desktop hover revealed is visible by
  default, in-view-triggered, or behind an explicit tap (DESIGN.md §13).

## 5. Mobile verification (part of the runtime pass)

At 390×844 (plus one small check at 320px):

1. Walk every section: no horizontal body scroll, no clipped text/controls,
   no element under fixed bars (DESIGN.md §15 at mobile widths).
2. Run ux.md §7's audit at this width (menu, forms, taps, console).
3. Scroll the full page fast: reveals keep up, nothing janks, sticky elements
   behave through the URL-bar resize.
4. Confirm the motion translation shipped (§2): press states everywhere, hero
   timing stays readable and responsive, heavy effects use their mobile strategy — name what runs
   on mobile vs desktop in the final report.
5. If media/3D shipped: posters load, loops play inline (not fullscreen),
   pause off-screen.
