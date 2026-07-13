# Dreative Specialist Skill — Cinematic WebGL & Experiential Interfaces

## Contract

Follow `../references/SKILL_CONTRACT.md`. Dependencies: `motion`, `interaction`,
`media`, `ux`, `mobile`; add `3d` only when spatial rendering is real. Deliver a
coherent living-surface system, gesture/keyboard parity, asset/audio consent
budgets, calm fallback, and runtime/performance evidence. Do not load merely for
a dark palette. Done means the experience still communicates and works without
sound, fine-pointer input, WebGL, or full motion.

Load this file when `plan.skills` includes `cinematic`, or the brief/prompt asks
for a dark cinematic shader-driven look, "sites like unseen.co", drag-to-explore
navigation, click-and-hold interactions, fluid/particle distortion effects,
sound design, or "experimental / experiential" interfaces. This is the genre's
high-fashion end: fewer elements, extreme polish, the interface itself behaves
like a graded film.

It STACKS with `immersive.md` (world architecture — read it when routes/scenes
are involved) and `3d.md` (shader craft). DESIGN.md still governs type and
accessibility floors. It is universal — apply directly to any codebase; the
Dreative editor is optional. This is an OPT-IN aesthetic: propose it only when
the brief supports it; it is never the default answer to "make it nicer".

## 0. The register: cinematic restraint

Where immersive.md builds a place, this genre builds a MOOD. Its rules:

- **Atmosphere is the canvas.** Commit to ONE graded atmosphere and grade
  everything into it. Dark cinematic (near-black #0a0a0c-ish base, tinted, never
  pure #000, stage-light falloff on one subject) is the common form — but pale
  worlds are equally genre-valid: UNSEEN's actual site is a blush-pink flooded
  dream-room with prismatic dispersion on its arches and soft daylight. What
  makes it cinematic is not darkness but unity of light: one light temperature,
  one falloff logic, one grain, everything (DOM included) living inside it.
- **Radical reduction.** Each view holds ONE visual subject + a few lines of
  type + numbered chrome. If a section needs three columns of content, it does
  not belong in this register — move it to a conventional subpage.
- **Everything is graded.** One post-processing/color pass unifies DOM and
  canvas: film grain (3-6%), subtle vignette, bloom only on emissive accents,
  optional chromatic aberration at transition peaks ONLY (constant CA = broken
  monitor). The grade is one system — define it once, apply globally.
- **Typography as credits.** Restrained scale (this genre whispers where
  immersive shouts): refined grotesk or editorial serif, generous tracking on
  small mono/small-caps labels, and the signature **numbered index** chrome —
  `01 Index`, `02 Projects`, coordinates, timestamps — laid out like a film
  slate. Big type appears sparingly and is often distorted by the shader layer
  as it passes (see §2).

## 1. The living surface (the genre's engine)

The background is not decoration — it's a continuously-running simulation the
whole interface sits on. One fullscreen canvas, one of these families:

- **Fluid distortion** (the UNSEEN signature): GPGPU fluid sim or cheap
  velocity-buffer approximation; pointer movement injects velocity; the field
  distorts whatever sits under it — images, WebGL text copies of the headlines,
  the scene itself. Intensity tuned so idle = near-still, movement = silky wake.
- **Particle field**: 10k-100k GPU particles (FBO/GPGPU, see 3d.md §5) forming
  a subject — a logo, a face, a landscape — that disperses and reforms on
  interaction or route change. Curl noise for drift; mouse as attractor/repulsor.
- **Volumetric/raymarched fog + light**: a raymarched or layered-noise volume
  with one light source tracking the pointer or the active section.

Rules: ONE simulation per site, palette fed from the page tokens, `uTime` slow
(3d.md §4), sim pauses off-screen and on `document.hidden`, and pointer force is
damped — the surface reacts like water, not like a cursor-following gimmick.
Images/media on the page render INTO the canvas layer (texture planes synced to
DOM rects — measure, don't guess) so the distortion can touch them; keep real
DOM (invisible or fallback-visible) underneath for a11y/SEO/selection — the
full media-plane pattern, video textures, and the wired fallback rule live in
`media.md` §3. When a video-generation tool exists, the pre-rendered-loop
budget path (§6) becomes first-class: generate the sim-like loop instead of
building the GPGPU sim (media.md §1).

## 2. Interaction vocabulary

The genre replaces "click around a document" with deliberate, weighty gestures.
Pick 2-3, execute perfectly:

- **Drag to explore**: the primary surface pans on drag (inertia + rubber-band
  edges, damped) across a spatial arrangement of works. Cursor label says
  "Drag"; a minimap/index shows position. Wheel/trackpad maps to the same pan.
  ALWAYS pair with a conventional index list (the numbered menu) — drag is the
  scenic route, never the only route.
- **Click & hold**: press-and-hold to enter a project / reveal a layer — a ring
  or bar fills during the hold (400-700ms), releasing early cancels with a
  spring-back. Label it ("Hold"). Keyboard equivalent: Enter activates
  immediately — the hold is texture for pointer users, not a gate.
- **Velocity-reactive media**: scroll/drag velocity feeds shader intensity —
  images stretch, RGB channels split for a beat, grain agitates — settling with
  damped decay. Read velocity from Lenis/`useScroll`; clamp hard: peak effect at
  a fast flick should still be legible.
- **Cursor as instrument**: single dot that morphs into contextual labels
  ("Drag", "Hold", "Play", index numbers). In this genre the cursor may also
  cast light — the surface (§1) brightens around it. One cursor identity,
  fine-pointer devices only.
- **Idle cinematography**: after ~10s idle the scene performs — slow camera
  drift, sim breathing, a highlight reel. Any input snaps back (damped, 300ms).

## 3. Sound design (optional layer, genre-native)

The only web genre where audio is expected — still strictly opt-in:

- Entry gate offers the choice up front ("Enter with sound / without") or an
  always-visible mute toggle in the HUD (animated equalizer bars = the
  convention). NEVER autoplay audio; browsers block it and users hate it.
- One ambient loop (-30dB-ish, long crossfaded loop) + micro-SFX on primary
  interactions only (hover tick, hold-complete, transition whoosh). Web Audio
  API with a master gain; fade in/out over 400ms on toggle, duck during video.
- Persist the choice (localStorage), default OFF on return visits unless
  enabled; respect `prefers-reduced-motion` as a proxy for "calm mode" — start
  muted there.

## 4. Composition & transitions in this register

- Views compose like film frames: subject off-center (rule-of-thirds), type in
  the negative space, numbered label anchoring a corner. Symmetric centered
  compositions only for title-card moments.
- Route transitions are CUTS and DISSOLVES driven by the surface: the sim
  swallows the view (fluid floods, particles disperse) → beat at full abstraction
  (~200ms, the surface alone) → next view condenses out of it. The simulation is
  the transition medium — no white flashes, no generic slide-wipes on top of it.
- Section changes within a view: crossfade + parallax nudge, ≤ 500ms; let the
  surface do the drama, keep DOM motion quiet (this genre's DOM moves LESS than
  a normal site's — contrast is what reads as expensive).
- The loader (immersive.md §2 rules apply) is minimal here: percentage numeral +
  the sim warming up behind it. The sim visibly "becoming ready" IS the loader.

## 5. Performance & accessibility (non-negotiable, hardest here)

All of 3d.md §7 and immersive.md §6, plus:

- GPGPU sims are the most expensive thing on the web: cap sim resolution
  (fluid ≤ 256², particles per device tier), halve on mobile or replace the sim
  with a pre-rendered video loop of it — visually near-identical, free to play.
- Measure, don't assume: if frame time > 20ms for a sustained burst, degrade
  live (drop sim resolution → drop post-FX → static grade). Build the ladder in.
- `prefers-reduced-motion`: sim frozen to one still frame (it's the grade's
  texture now), velocity effects off, hold-to-enter becomes click, idle
  cinematography off. The site must remain fully usable and still look graded.
- Contrast discipline: dark register makes AA failures easy — body text ≥ 4.5:1
  against the DARKEST point of the animated surface behind it (test the worst
  frame, not the average); put text over a stabilized scrim when the sim is busy.
- Every drag/hold/spatial interaction has a boring equivalent: real links in the
  numbered index, tab order through works, Enter to open. Screen readers get the
  DOM document; the canvas is `role="img"` with a scene description.
- Battery/data respect: pause everything on `visibilitychange`, honor
  `prefers-reduced-data` by skipping the sim entirely (grade + posters only).

## 6. Recipes

- **UNSEEN-style studio home** (verified on the live site): letter-cycling
  loader (the wordmark's letters flip one at a time over the studio's one-line
  bio) → entry gate ("Enter" pill + quieter "ENTER WITHOUT AUDIO" underneath) →
  a pastel 3D room half-flooded with reflective water; drag pans the view and
  reveals chrome/reflective 3D display type STANDING IN the scene (italic serif
  + grotesk mixed in one headline), mirrored in the water. Scrolling dollies the
  camera forward through the room into a bright gallery hall — hero and works
  index are one continuous camera journey, with the route updating mid-flight.
  Work cards render as sheets of paper floating in the space, subtly warped,
  with chromatic fringing at their edges; filter pills carry counts (All 20 /
  Branding 5…); butterfly/petal particles drift through; HUD = wordmark
  top-left, Index/Projects/Contact top-right, globe "world" button bottom-center,
  © year bottom-right. Heavy uniform film grain glues all of it together.
- **Single-flower lab page (verified on unseen.co/labs/blossom)**: the minimal
  form of the genre — one WebGL subject (a blooming particle flower) on one
  canvas, Lenis smooth scroll, headlines split into `overflow-hidden` line
  masks (`splittext--line`) sliding up on arrival, and a two-family type system
  (light serif with true italics — SangBleu-style — mixed into a neutral
  grotesk). No drag, no sound, no HUD maximalism: one subject + line-mask type
  + smooth scroll already reads as the genre. Start here; add §2 gestures only
  if the brief earns them. (unseen.co's own home additionally runs a
  `webgl-rain` particle layer over the scene — weather as grade texture.)
- **Particle identity page**: brand mark as 50k particles that disperse on
  pointer force and reform; sections change the formation target; scroll
  velocity agitates; reduced-motion = the formed mark as a still.
- **Cinematic case study**: dark editorial page, media rendered through the
  distortion layer, velocity-reactive stretch on scroll, chapter numerals,
  one raymarched-light hero; DOM otherwise quiet and typographic.
- **Budget version (no GPGPU)**: pre-rendered fluid/particle video loops as
  background + `mix-blend-mode` type, CSS grain, velocity-reactive transforms
  on real DOM, click-and-hold in JS only. 70% of the mood, runs on anything —
  the right call below motion dial 8 or on content-heavy sites.

## 6.5 The unseen.co replication blueprint (build order)

When the brief is "make it like unseen.co" (or this genre at dial 9–10), build
in THIS order — each layer works before the next starts. Do not attempt it as
one monolithic rewrite; do not stop after step 2 and call it done.

**Manifest:** `npm i gsap lenis three @react-three/fiber @react-three/drei
@react-three/postprocessing` (React) or `gsap lenis three` (vanilla/OGL).
Wire Lenis + ScrollTrigger per motion.md §8 first.

**Layer stack (bottom → top):** persistent WebGL canvas (fixed, full-viewport)
→ real DOM content (the accessible document) → HUD chrome (fixed corners) →
grain overlay → custom cursor. Each is its own component/layer mounted in the
root layout, outside the router swap point (immersive.md §1).

1. **Smooth scroll + type system.** Lenis running, line-mask reveals on every
   heading (motion.md §8), the two-family type mix (grotesk + true-italic
   serif accents in one headline), numbered HUD chrome (`01 Index`…). The page
   should already feel 60% of the genre with zero WebGL.
2. **The living surface.** One canvas, one simulation family (§1). Start with
   the highest effort/impact ratio: a shader plane with fbm + domain-warp fed
   by palette uniforms and damped `uMouse` velocity (3d.md §4), or the
   pre-rendered-video budget path (§6). Grain overlay goes in now — it glues
   DOM and canvas into one graded image.
3. **Scroll = camera.** Tall scroll container drives a camera dolly / scene
   progress via damped scrub (immersive.md §4). Section copy floats in at
   progress stops. This is the "one continuous shot" that separates the genre
   from a parallax page.
4. **Media through the surface.** Sync DOM image/work-card rects to texture
   planes in the canvas (measure with `getBoundingClientRect` on resize +
   scroll, don't guess) so hover/velocity distortion touches them; keep the
   real DOM images underneath for a11y/fallback (§1). Velocity-reactive
   stretch/RGB-split on scroll flicks, hard-clamped (§2).
5. **Gestures + cursor.** Pick 2–3 from §2 (drag-to-explore, click & hold,
   cursor-as-instrument), each labeled, each with a keyboard/boring
   equivalent. Custom cursor: one dot, damped follow, contextual labels.
6. **Doors and passages.** Preloader (real progress, choreographed reveal into
   the idling scene — immersive.md §2), entry gate if sound ships (§3), route
   transitions driven by the simulation (§4).
7. **The floor.** Reduced-motion still frame, degrade ladder, contrast scrim,
   mobile strategy (poster or halved sim), pause on hidden (§5).

Ship checkpoint after every layer: run it, screenshot it, READ THE CONSOLE,
click through it (ux.md §7's audit on the touched surface), keep it working.
A failed step 4 must not take down steps 1–3 — each layer's fallback is the
previous layer, and the runtime gate (DESIGN.md §12.18) runs on the final
stack, not just the last layer added.

## 7. Changing an existing site into this

Same rule as immersive.md §8: this register cannot be CSS'd onto a conventional
page — it needs the canvas surface, the reduced composition, and usually a
content edit (views hold less). Use DESIGN.md §11's transformation-depth ladder;
this genre is almost always rung 3 (Restructure) or 4 (Reimagine). Offer the
ladder, get the user's pick, then rebuild for real — and offer the budget recipe
(§6) as the rung-2 alternative for users who want the mood without the rebuild.
