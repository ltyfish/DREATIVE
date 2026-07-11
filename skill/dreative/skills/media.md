# Dreative Specialist Skill — Media as Motion Material

Load this file when `plan.skills` includes `media`, when the plan's blueprint
contains any `generate-*` media cell, or when the brief involves imagery/video
on a page with motion dial ≥ 6. It EXTENDS DESIGN.md §7 (sourcing priority and
bans still apply) and STACKS with motion.md (timing), 3d.md (shader craft), and
cinematic.md (the living surface). This file exists because agents know how to
*embed* media but not how to *use* it: award-grade sites (unseen.co family)
treat images and video as the raw material the motion system acts on — media is
choreographed, distorted, revealed, and lit, never just placed.

## 0. The doctrine

- **The static-placement ban (any dial, whenever this file is loaded).** A
  generated or supplied image dropped in as `background-image`, a full-bleed
  `<img>` behind text, or a card thumbnail with zero behavior is a FAILURE of
  this skill, not a baseline. Every media element ships with at least one
  living quality — an entrance from §2/§2.5 (curtain, strip-slice, pixel/dither
  develop, print develop, fade-sweep…), an idle (loop, drift, ken-burns), or a
  response (hover wake, directional wipe, cursor torch, distortion). "Static on
  purpose" is allowed only when written into the plan blueprint with a reason
  (e.g. evidence screenshots in a refined register). At dial ≥ 8 with a canvas,
  media belongs on media planes (§3) moving in depth — parallax layers, curved
  sheets, velocity distortion — not pasted flat behind the DOM.
- **Edit the asset, don't just place it.** Generation is step one; the pipeline
  (§1) continues with real editing — grade/duotone to the palette, crop to the
  blueprint's aspect, cut video to the loop point, extract posters and frame
  sequences, composite masks/mattes (ffmpeg/sharp or your image tools). An
  asset that arrives on the page exactly as the generator emitted it usually
  reads as wallpaper.
- **No bare media at dial ≥ 7.** Every meaningful image/video gets three
  decisions: an **entrance** (how it arrives — reveal, wipe, materialize), an
  **idle** (what it does at rest — loop, drift, ken-burns, nothing-on-purpose),
  and a **response** (what interaction does to it — hover wake, distortion,
  parallax). "None" is a valid answer per axis, but it must be chosen, not
  defaulted.
- **Media and type arrive as one beat.** Time the media entrance with the
  section's line-mask type reveal (motion.md §4) — image and headline landing
  together reads as choreography; landing separately reads as two plugins.
- **One treatment vocabulary per page.** Pick 1-2 media treatments and stamp
  them consistently (all work cards hover-wake; all section images curtain-
  reveal). Five different reveal styles = assembled, not designed.
- **Invent, don't pick.** §2/§3 are springboards, not a menu — the signature
  media treatment should be COMPOSED for this brand and this prompt using the
  grammar in §2.5 (a torn-paper archive scrolls differently than a liquid
  fashion film). Stock-vocabulary media reads as template exactly like stock
  layouts do; if the user's prompt describes an effect ("images tear apart on
  scroll"), build THAT effect for real, at the tier it needs.
- **Real assets outrank generated ones** (DESIGN.md §7). Generated media fills
  gaps and creates atmosphere; it never replaces the client's product shots.

## 1. Production pipeline (generate → grade → compress)

When the plan calls for generated media, produce it BEFORE section code
(PLAN.md §4) and produce it correctly:

- **Prompt for the world, grade for the page.** Prompt the brand's physical
  subject (DESIGN.md §7) PLUS the page's light: temperature ("warm tungsten
  side-light", "cool overcast daylight"), palette anchors ("deep green shadows,
  bone highlights"), and grain/mood. Every asset on a page shares ONE lighting
  logic — mismatched light is the #1 generated-media tell.
- **Exact aspect ratios** from the blueprint (16:9 hero, 4:5 cards, 1:1
  thumbnails, 21:9 banners). Never generate square and crop-hope.
- **Video loops**: 5-10s, prompt explicitly for seamlessness ("seamless loop,
  continuous motion, no scene change") and slow motion content (drift, steam,
  fabric, water — fast action never loops cleanly). Generate or extract a
  **poster frame** for every video (first frame, same grade).
- **Image sequences** for scroll scrubs: 40-80 frames of one continuous
  transformation (assemble/rotate/morph). Image-to-video tools can produce
  these from a single generated still; export frames with ffmpeg
  (`ffmpeg -i loop.mp4 -vf fps=12,scale=1280:-1 frames/f_%03d.webp`).
- **Compress before committing**: images → WebP/AVIF at the largest displayed
  size ×2 max; video → H.264 + AV1 sources, CRF ~28-32, no audio track, ≤ 2-4MB
  per loop (`ffmpeg -i in.mp4 -an -c:v libx264 -crf 30 -movflags +faststart`).
  A 40MB hero loop fails the plan even if it's beautiful.
- Textures too: grain tiles, masks, mattes, displacement maps — generate them
  instead of hand-rolling SVG (which is banned, DESIGN.md §7).
- **Asset manifest (`.dreative/assets.json`) — generation is expensive; never
  pay twice.** Before generating anything, read the manifest; an entry whose
  prompt/aspect/grade matches the need means REUSE the file, don't regenerate.
  After each generation+edit, append one entry:
  `{ "file": "assets/hero-loop.mp4", "kind": "video-loop", "prompt": "<the
  exact generation prompt>", "aspect": "16:9", "grade": "warm tungsten, deep
  green shadows", "poster": "assets/hero-poster.webp", "bytes": 2400000 }`.
  A re-run, a mockup→build transition, or a resumed session regenerates only
  what the manifest doesn't already have.

## 1.5 Custom props (isolated compositional elements)

Distinct from hero/gallery media (§1-2, which fill a frame): a **prop** is a
small, isolated object — a single coffee bean, a steam wisp, a leaf, a bottle,
an icon-scale object — used as scattered COMPOSITION around content, not as
the content itself. Props are what make a page feel art-directed rather than
stocked with rectangles; they're cheap to generate/build and reused as a
recurring motif across sections (the visual equivalent of a signature element,
motion.md's terms).

Two flavors — pick per section from the blueprint, they can mix on one page:

- **Cutout image props**: generate on a transparent background — prompt
  explicitly ("isolated on pure transparent background, studio product
  lighting, no backdrop, no shadow baked in") and REQUEST alpha-channel PNG
  output. **Verify the alpha is real**, not a white/checkerboard fill the
  model painted in: sample a corner pixel programmatically or view at 100%
  over a colored backdrop — a prop with a faint white halo is a failed
  generation, regenerate or matte it out (rembg/similar if available). Add a
  drop shadow / contact shadow yourself in CSS (`filter: drop-shadow(...)`),
  never bake it into the generation — a baked shadow breaks when the prop
  moves or the section behind it changes color.
- **3D props**: lightweight custom geometry (primitives, simple extrusions, or
  a small generated/coded mesh) with a real textured material per
  `experimental.md` §1 (roughness/normal map, rim light, environment
  reflection) — cheaper to build and render than a scene centerpiece, and
  reusable: the SAME prop model instanced multiple times (different scale/
  rotation) reads as a coherent motif, not repetition.

Placement and behavior:

- Compose as a **floating layer** (§2's floating-media technique) around
  content: corners, margins, trailing a section's edge — never covering the
  content's readable area. 3-6 instances per page is a motif; more reads as
  clutter.
- Give props real behavior, same floors as any media (§0): idle drift/rotate,
  parallax depth differential, and at least one response (cursor-follow with
  lag, scroll-linked rotation, hover nudge, scatter-and-reform on scroll
  velocity). A prop that just sits pinned in a corner is decoration nobody
  asked for; a prop that visibly reacts is what sells the "crafted" feel.
- One prop VOCABULARY per page — pick one subject family (all beans/leaves/
  steam, not a random mix of unrelated objects) and one behavior language, the
  same discipline as §0's "one treatment vocabulary" rule.
- Record each in the asset manifest (§1) with `"kind": "prop-image"` or
  `"kind": "prop-3d"` — props get reused across sections, never regenerated
  per-section.

## 2. DOM-tier treatments (no WebGL — the budget vocabulary)

80% of the effect at 5% of the cost; the right tier below dial 8 or without a
canvas already on the page. All honor the floors in §5.

- **Curtain / inset reveal**: media enters behind a wipe —
  `clip-path: inset(100% 0 0 0) → inset(0)` (or 2-4 panel slides), 900ms
  expo-out, triggered in-view once, synced to the headline's line-mask.
- **Hover-woken loop**: still poster crossfades to its video loop on
  hover/focus (240ms), `video.play()` on enter, pause + reset to poster on
  leave. The "living thumbnail" for work/product cards. Preload `metadata`
  only; play() only after the crossfade starts.
- **Mask-shaped video**: the loop plays inside display type
  (`background-clip: text` on 10vw+ headlines), an arch/circle `clip-path`, or
  the brand mark (SVG mask). Video becomes identity, not a rectangle. One per
  page.
- **Floating media**: 3-5 images hovering in depth — slow damped drift
  (±6-10px, 4-8s loops, each phase-offset), parallax differential by depth
  layer, soft tinted contact shadow. The "paper sheets in space" look, pure CSS
  + one IntersectionObserver.
- **Ken-burns**: slow scale 1.0→1.06 over 12-20s inside a fixed frame,
  alternate direction per instance. The refined register's entire motion budget
  for imagery (refined.md).
- **Pixel/dither swap**: stepped `image-rendering: pixelated` downscale swap
  (24px mosaic → full res in 4-6 steps) on scroll progress or hover. Digital-
  craft registers.
- **Inner-zoom parallax**: image at 115% height inside `overflow-hidden` frame,
  `object-position` or translateY driven by scroll (-8%→8%). Media moves, frame
  doesn't — never parallax the frame itself past text.
- **Scroll-scrubbed `<canvas>` sequence**: preload frames (§1), draw the frame
  for the current damped scroll progress; sticky wrapper ≤ 2.5 viewports
  (motion.md §7's scrub showcase). No WebGL needed.

## 2.5 The invention grammar (compose the signature treatment)

Every media effect — including any the user describes in their own words — is
three choices multiplied together. Compose deliberately:

- **PROPERTY** (what changes): position/scale · opacity · clip/mask SHAPE
  (inset, circle, arch, brand mark, jagged polygon) · slices/fragments (the
  media cut into strips, tiles, or shards that move independently) · UV
  distortion (WebGL: ripple, stretch, melt, swirl) · resolution (mosaic →
  sharp) · color channels (RGB split, duotone → full color) · blend/exposure
  (media develops like a photo print).
- **DRIVER** (what pushes it): scroll progress (scrubbed) · scroll VELOCITY
  (agitation that decays) · in-view trigger (one-shot) · hover/focus ·
  cursor position within the element (directional!) · drag · hold · time.
- **SHAPE OF PROGRESSION** (how it travels across the media): uniform ·
  directional sweep (left→right, top→bottom) · radial from a point (often the
  cursor's entry point) · per-slice stagger · noise-mask (organic, torn) ·
  along the brand mark's silhouette.

The user's prompt usually fixes one or two axes; you compose the rest from the
brand's world. "Tearing" = slices + jagged noise-mask edges, driven by scroll.
"Video fades from left to right on hover" = opacity/mask, hover-driven,
directional sweep — a gradient `mask-image` whose position animates, 400ms,
from the edge the cursor entered. Name the composed treatment in the plan
blueprint like a signature element, and stamp it consistently (§0).

**Worked exotics (copy the construction, not the skin):**

- **Paper tear on scroll**: image duplicated into 2-3 layers, each clipped by
  a jagged `clip-path` polygon sharing torn edges; scroll progress translates/
  rotates the pieces apart (±2-6°) with a hairline of background showing
  through; WebGL version displaces UV along a noise seam. Archive/editorial/
  punk registers.
- **Strip-slice reveal**: media as 5-9 vertical strips (repeated
  `background-image` with offset `background-position`, or plane-per-strip);
  strips slide in staggered from alternating directions, or shear on scroll
  velocity. The classic award-site gallery entrance.
- **Directional hover wipe**: detect the pointer's entry edge (compare
  enter coordinates to bounds); the reveal (opacity mask, color→duotone,
  still→video crossfade) sweeps FROM that edge. Feels alive because it
  answers the gesture's direction.
- **Cursor-torch reveal**: media sits dimmed/blurred/halftoned; a radial mask
  tracking the (damped) cursor reveals it sharp and graded — the flashlight
  over an archive. Pair with a "drag to explore" label.
- **Melt/liquid exit**: on section leave or route change, UV y-displacement
  grows by a noise column pattern — the image drips out of frame (WebGL), or
  budget version: per-strip translateY with eased random offsets.
- **Shatter/scatter**: media as an instanced tile grid (WebGL) that explodes
  along scroll velocity and reassembles at rest — the §3 plane system with a
  per-instance offset uniform; cap tiles ≤ 400.
- **Print develop**: media enters as paper-white → exposure/contrast/duotone
  ramps to full grade (CSS `filter` keyframes or a LUT shader), timed with
  the headline reveal. Photography/portfolio registers.

Discipline stays the law: the composed treatment must still clear §5's floors,
DESIGN.md §6's "one sentence of communication value", and one-signature-
per-page — an inventive effect stamped on every image is as loud as a marquee
on every section.

## 3. WebGL tier — the media plane (the unseen.co mechanic)

When dial ≥ 8 or cinematic/immersive is active, media renders THROUGH the
canvas so shaders can touch it. The core pattern, in order:

1. **Sync planes to DOM rects.** Real `<img>`/`<video>` elements stay in the
   document (a11y, SEO, layout, fallback) but render invisible
   (`opacity: 0`, NOT `display:none` — layout must persist). For each, a
   textured plane in an orthographic/fitted scene copies its
   `getBoundingClientRect()` every scroll/resize (rAF-batched; lerp the
   position for the floaty feel). Texture from `TextureLoader` or
   `new THREE.VideoTexture(videoEl)` (video must be `muted playsinline` and
   playing; `texture.colorSpace = SRGBColorSpace`).
2. **Distortion in the fragment/vertex shader**, uniforms driven by input:
   - *Hover ripple/lens*: damped `uMouse` + `uHoverStrength` 0→1 spring; UV
     displacement by radial falloff or noise.
   - *Velocity stretch / RGB split*: scroll or drag velocity (from Lenis /
     `useScroll`) → vertex bend + per-channel UV offset, hard-clamped, damped
     decay to zero (cinematic.md §2). Peak effect at a fast flick stays legible.
   - *Transition dissolve*: two textures + noise mask `mix()` for gallery/
     route image swaps (3d.md §4).
3. **Curved/warped planes**: subtle vertex bend (unseen's floating paper
   sheets) — displace z by a small curve of UV.x + scroll velocity.

Rules: ONE media-plane system per page owning all planes (one scene, one rAF —
never a canvas per image); planes pause syncing when off-screen; the DOM
element remains the interaction target (click/focus/hover listeners on the DOM,
effects on the plane); reduced-motion and WebGL-failure both fall back to
simply un-hiding the DOM media (set `opacity: 1`) — this fallback must be
wired, not theoretical, and it's the first thing runtime verification checks.

## 4. Choosing the treatment (the reasoning frame)

Per media element, walk this in one line each — it's the media ledger the plan
blueprint (PLAN.md §2) captures:

1. **Role**: hero atmosphere / product evidence / work-card / texture / story
   beat? Evidence media (screenshots, product photos) gets QUIET treatments —
   curtain reveal, ken-burns; atmosphere media can take the loud/invented ones.
2. **Tier**: does the page already pay for WebGL? If yes, media planes (§3);
   if no, a DOM treatment (§2) or the DOM construction of a §2.5 invention —
   never add a canvas only to distort one image.
3. **Entrance / idle / response** per §0, matched to register and dial.
4. **Failure path**: poster/static version named (reduced-motion, load
   failure, mobile tier).

## 5. Floors (every treatment, non-negotiable)

- `prefers-reduced-motion`: poster frame / static image, no autoplaying loops,
  no scrub (static end-state). Test by toggling it.
- Videos: `muted autoplay loop playsinline preload="metadata"` + `poster`;
  pause when off-screen (IntersectionObserver) and on `document.hidden`; no
  audio tracks ever on ambient loops.
- Loading: explicit `width/height` or `aspect-ratio` on every media box (zero
  CLS); LCP image/poster preloaded, everything below the fold lazy; a media box
  is never blank — poster, dominant-color fill, or blur-up while loading.
- Hover treatments have focus equivalents; touch gets the tap/visible-default
  story (DESIGN.md §13); media planes and canvases are `pointer-events-none`
  unless they ARE the control.
- Budgets: one video loop playing per view, ≤ 2-4MB per loop, sequences ≤
  ~6MB total, `dpr` capped on media-plane canvases (3d.md §7).
- Alt text carries voice on images; videos that convey content (not
  atmosphere) get a text alternative nearby.
