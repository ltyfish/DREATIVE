# Dreative Specialist Skill — Immersive Worlds & Spatial Transitions

## Contract

Follow `../references/SKILL_CONTRACT.md`. Dependencies: `motion`, `interaction`,
`media`, `ux`, `mobile`; add `3d` when the world uses WebGL geometry. Deliver a
named persistent-stage architecture, travel map, loading/route choreography,
performance budget, and non-spatial fallback. Do not load for ordinary parallax.
Done means every route, scroll stop, keyboard path, mobile translation, and
occlusion sweep passes.

Load this file when `plan.skills` includes `immersive`, or the brief/prompt asks
for an "award-site" feel, a site that behaves like a world/scene/space, spatial or
3D page transitions, "sites like epic.net / Awwwards winners", scroll-as-journey,
or "make it feel like an experience, not a webpage". This is the genre young
studios and portfolios use to signal craft: the page is a continuous SPACE the
visitor travels through, not a stack of sections.

It EXTENDS DESIGN.md (register, type, color still apply) and STACKS with
`motion.md` (timing vocabulary) and `3d.md` (WebGL craft) — read those too when
listed. This file is about the architecture and choreography that makes a site
read as one continuous world. It is universal: apply it to any codebase or
framework directly; the Dreative editor is never required.

## 0. Commit to the genre or don't enter it

Immersive is a REGISTER, not a garnish. A normal marketing page with one fancy
transition reads as broken; a world with one static utility page reads as
intentional. Decide up front:

- **Earns it**: portfolios, studios/agencies, campaign and launch sites, brand
  storytelling, exhibitions, games/entertainment — anywhere the site IS the proof
  of craft and visitors expect to explore.
- **Doesn't**: dashboards, docs, e-commerce checkout, anything task-first.
  Product register (DESIGN.md §1) hard-caps this genre to a hero moment.
- The genre demands a **spatial metaphor** named in one sentence before any code:
  "each project is a room off a corridor", "scroll descends through a tower",
  "the cursor is a flashlight over an archive", "works float in a void you orbit".
  No metaphor = you'll produce disconnected effects. The metaphor decides what
  transitions, camera moves, and layout make sense — everything below serves it.
- Immersive sites still need an **escape hatch**: visible menu with plain links,
  working back button, deep-linkable routes — all held to ux.md's working-page
  contract (the menu closes, links resolve, back plays reverse, nothing
  invisible eats clicks: run ux.md §7 on the world too). Lost visitors close tabs. On touch
  devices the escape hatch becomes the PRIMARY route (DESIGN.md §13): drag/
  spatial navigation conflicts with native scroll, so mobile gets the index-list
  world view or a swipe carousel, with the full world behind an explicit tap-in.

## 1. Architecture: one persistent stage

The defining trait of this genre is that navigation doesn't feel like page loads
— the world persists and the camera/content moves. Structure the app accordingly:

- **App shell + stage**: one persistent layer (WebGL canvas, fixed background
  scene, or shared layout chrome) mounted OUTSIDE the router's swap point. Routes
  change the DOM content layer; the stage transitions continuously underneath.
  React: canvas in the root layout, never inside a page component. Vanilla/MPA:
  use cross-document View Transitions (`@view-transition { navigation: auto; }`)
  or an SPA-ify layer (barba.js/Taxi.js-style: fetch next page, swap `<main>`,
  play the transition yourself).
- **Scene manager**: each route/section maps to a named scene state (camera pose,
  palette, fog, active objects). Transitions tween BETWEEN states — never unmount
  scene A and mount scene B. Keep one source of truth
  (`{ route → { cameraPos, lookAt, theme } }`) so transitions are data, not
  scattered code.
- **State machine for choreography**: preloading → intro → idle → transitioning.
  Input is locked during `transitioning` (ignore clicks, queue at most one). Every
  award-site jank bug is two transitions running at once.
- URLs stay honest: every "place" in the world has a route; refresh lands you
  there with the scene in the right state (read route on boot, snap camera, skip
  the travel animation).

## 2. The preloader (the genre's front door)

Heavy worlds need loading; the genre turns it into the first brand moment.

- Show a preloader ONLY if real assets need it (fonts+models+textures > ~1s).
  Faking a 3-second counter on a light page is user-hostile — banned.
- Real progress: count bytes/items from an asset manifest (`THREE.LoadingManager`
  `onProgress`, or Promise.allSettled over fetches), display as an oversized
  number (tabular-nums) or a filling wordmark — not a spinner.
- Exit is a choreographed REVEAL, not a fade: counter completes → beat (~200ms) →
  curtain wipe (clip-path/transform panel slide) or mask expansion reveals the
  hero mid-motion (world already idling underneath). The hero entrance and the
  preloader exit are ONE timeline.
- Cache the visit (`sessionStorage`): returning visitors within a session skip to
  a ≤400ms version. Preloader shows once, not per navigation.

## 3. Spatial transitions (route ↔ route)

The signature move: leaving a page feels like traveling, not swapping.

Pick per the metaphor — every route pair uses the SAME transition language:

- **Camera travel** (persistent WebGL): tween camera along a path to the next
  scene anchor while DOM content of page A exits (fast fade + small offset) and
  page B's content enters after arrival. Travel 600–1200ms; longer feels like a
  loading screen.
- **Shared-element morph**: the clicked card/image IS the next page's hero.
  Same-doc: Motion `layoutId` or FLIP the element to its new bounds. MPA/simple
  SPA: `view-transition-name` on the pair. This is the highest-value transition
  per line of code — prefer it for list → detail (work index → project page).
- **Mask/wipe**: full-viewport panel or clip-path (`inset()`/`circle()` from the
  click point) sweeps over A, next route mounts underneath, sweep continues off.
  Two-phase with a color/texture beat at full-cover (~150ms hold) reads as
  premium; a plain crossfade reads as a slideshow.
- **WebGL texture transition**: page A screenshot/render and page B as two
  textures on a fullscreen plane, shader-blended with a noise/displacement mask
  (see 3d.md §4). For image-heavy portfolios.

Rules: exits ≤ 40% of the total; something from A must persist through the
transition (the stage, a morphing element, the nav) or it's just a fancy reload;
browser back plays the REVERSE direction (remember last direction); first paint
on a cold URL never plays a transition.

## 4. Scroll as travel (the world's main axis)

In this genre scroll is displacement through space, not document reading:

- Map document scroll to world motion: a tall scroll container
  (`height: N * 100vh`) drives camera position along a `CatmullRomCurve3` (or
  layered 2D transforms for a DOM-only world) via damped progress — Lenis +
  ScrollTrigger scrub, or `useScroll` + `useTransform`. The page height IS the
  journey length; native scrollbar, momentum, and a11y keep working. This is how
  you get the "flying through the site" feel WITHOUT scroll-jacking — wheel
  hijacking stays banned (motion.md §3).
- **Chapters**: divide the journey into named stops (sections). Each chapter owns
  a camera pose + palette shift + one content group. Snap gently
  (`scroll-snap-type: y proximity`, never `mandatory` on long chapters). Expose a
  progress rail / chapter index (dots or numerals, current chapter labeled) —
  spatial sites without one feel endless.
- Depth cues sell the space: atmospheric fade (fog / opacity by depth), scale +
  blur on far layers, parallax speed ordered by depth (bg slowest), a subtle
  camera sway on idle (≤ 2°, damped). 3–5 depth layers; more reads as soup.
- Horizontal chapters: translate a wide track from vertical scroll progress
  inside a pinned section (sticky wrapper) — one per page, ≤ 4 viewport-widths.
- DOM content floats IN the world: copy blocks fade/rise at their chapter,
  anchored to scene positions (drei `<Html>`, or absolutely-positioned blocks
  keyed to progress ranges). Text always real DOM — never baked into textures.

## 5. The dressing: what makes it read "award site"

The genre's supporting cast — apply 3–4, not all (checklist-complete = template):

- **Oversized display type** as an object in the space: 10–20vw headlines that
  clip, sit behind/in front of the 3D subject (z-sandwiching via two text layers
  or `occlude`), or run off-canvas. Line-mask reveals on arrival (motion.md §4).
  The full-commitment version (unseen.co's hero) puts the headline INSIDE the
  scene as reflective 3D type — chrome material, mirrored in the environment,
  revealed by dragging/panning the world; pair a keep-real-DOM copy underneath
  for a11y/SEO.
- **Custom cursor**: small dot + trailing ring (damped follow, ~0.15 lerp),
  morphs over interactives (scales up with a label: "View", "Drag", "Play").
  Hide only the visual cursor layer via CSS on fine pointers; touch devices get
  none of it and lose nothing. Magnetic pull on nav/CTAs (interaction.md).
- **HUD chrome**: fixed corners used as an instrument panel — wordmark top-left,
  menu top-right, chapter index + local time / coordinates bottom corners, mono
  small-caps microtype. The frame stays put while the world moves — it's what
  makes the motion legible.
- **Fullscreen menu** as a scene: menu button flips a full-viewport overlay with
  oversized nav links (staggered line-mask entrance), hover previews (image or
  scene tint per link). The overlay is part of the world (same palette/texture),
  not a white sheet.
- **Textural grain**: one fullscreen noise/grain layer (CSS `mask` over an SVG
  turbulence tile or a tiny shader) at 3–6% opacity unifies WebGL and DOM into
  one photographic surface. Cheap, high-impact.
- **Easter eggs** (epic.net's signature): 1–3 hidden delights — a konami code, a
  clickable mascot, an idle-timeout animation. Never gate content behind them.

## 6. Performance & accessibility (the genre's hard mode)

Everything in motion.md §6 and 3d.md §7 applies, plus genre-specific:

- Budget the WHOLE experience: ≤ 4–5MB initial including models/fonts; stage
  code lazy-loaded behind the preloader; route content prefetched on hover so
  spatial transitions never wait on network mid-flight.
- One rAF loop owns the world (scene + cursor + scroll damping share it). Two
  competing loops = the micro-stutter that separates good from great here.
- `prefers-reduced-motion` gets a REAL alternative, not a broken world: static
  scene per chapter, instant route swaps (crossfade ≤ 200ms), scroll returns to
  plain document reading. Decide this layout up front — retrofitting it is why
  most immersive sites fail the audit.
- Keyboard path through the world: chapter index and nav focusable, focus moved
  to incoming page's `<h1>`/main after a route transition, skip-link to content
  over the intro. Announce route changes (`aria-live="polite"` region).
- Low-power fallback ("flat mode"): detect weak GPU/`navigator.deviceMemory`/
  first dropped-frame burst → swap stage for poster art + gradients, keep ALL
  content and transitions-lite. Content is never hostage to the world. Offer the
  same switch as a visible toggle if the brief allows.
- SEO/no-JS: every route server-renders its real copy; the world enhances it.

## 7. Recipes

- **Scroll-dolly index (verified on unseen.co)**: one scroll axis dollies the
  camera from the hero space directly into the works gallery — a bright hall
  whose section heading and filter pills are DOM floating in front of the
  scene, work cards as gently-warped paper planes hovering in depth. The route
  updates mid-journey while the world persists. One continuous shot, zero page
  loads.
- **Chapter theme inversion (verified on bdsn.club)**: an editorial case-study
  page where each full-viewport project chapter flips the ENTIRE page theme
  (white → black → brand indigo…) as it scrolls in, with an oversized grotesk
  project title and one product render per chapter; HUD (local time top-left,
  CTA top-right, awards rail on the edge) stays fixed through every inversion.
  DOM-only, no WebGL — the spatial feel comes purely from theme travel + scale.
- **World portfolio**: persistent canvas; works as textured planes arranged in
  depth (DOM-synced media planes per media.md §3 — real images underneath);
  scroll flies the camera past them; hover tilts a plane + cursor says
  "View"; click = camera dives to the plane which morphs into the project hero
  (shared-element). Back = reverse flight.
- **Scene-hopping studio site (epic-style)**: stylized environment as stage;
  each route = a location; nav travels the camera between locations with a
  velocity blur beat; DOM copy floats per location; playful idle animations +
  1–2 easter eggs; HUD chrome + fullscreen menu.
- **One-page descent**: 6–8 chapter tall-scroll journey down one axis (tower,
  ocean, timeline); palette darkens/shifts per chapter; progress rail with
  chapter names; ends on a contact "floor" that snaps.
- **DOM-only spatial site (no WebGL)**: layered `translateZ`-style parallax with
  scale/blur depth cues, View Transitions for shared-element route morphs,
  clip-path wipes, grain overlay, custom cursor, oversized type. 80% of the feel
  at 5% of the cost — the right call below motion dial 8 or without 3D subject
  matter.

## 8. Changing an existing site into this

An existing conventional site cannot become immersive through CSS — this genre
requires the app-shell/stage architecture (§1), which means restructuring markup,
routing, and component boundaries. Follow DESIGN.md §11's transformation-depth
ladder: present the depth options, and on user confirmation restructure for real
— move the router swap point, introduce the stage layer, rebuild sections as
chapters. Never simulate the genre by decorating the old structure; a restyled
static page with a custom cursor is the uncanny valley of this genre.
