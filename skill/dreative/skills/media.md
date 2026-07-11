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
- **Sourced media is media.** Everything in this file applies equally to
  images/video that were generated, supplied by the user, or sourced from
  stock/CDN when no generation tool exists — "we had no image-gen" changes the
  PRODUCTION path (§1), never the treatment obligations. A picsum/stock photo
  dropped in flat is the same failure as a generated one.
- **The zoom/fade floor is a floor, not a treatment plan.** Fade-in entrances
  plus ken-burns idles on every image = the minimum-compliance page, and at
  motion dial ≥ 6 it FAILS this skill: at that dial, hero + key section
  imagery each need at least one treatment that is scroll- or cursor-DRIVEN
  (curtain synced to type, strip-slice, inner-zoom parallax, directional hover
  wipe, cursor torch, velocity distortion, media plane — §2/§2.5/§3), where
  the visitor's input visibly pushes the media. Ken-burns-everywhere is the
  refined register's budget (refined.md), nobody else's.
- **One media SET-PIECE per page (dial ≥ 7 / expressive+).** Beyond the
  per-image floors, the page needs one moment where imagery itself IS the
  spectacle — a composed §2.5 exotic (or an invention in its spirit) that a
  visitor would describe to someone else: an image tornado/vortex the scroll
  spins through, a hero that disintegrates into particles as you scroll past,
  a gallery that shatters and reassembles, a melt/liquid exit between
  chapters. Quiet treatments (curtain, parallax, ken-burns) on every image
  with no set-piece = the page failed this skill even though each image
  technically "moves". The set-piece is named in the plan blueprint like a
  signature element, ONE per page (two set-pieces compete; refined register
  may skip with a stated reason). **At dial ≥ 8 / award tier the set-piece
  must transform the media at PIXEL level** — the image's own content visibly
  changes under scroll/input, not just its placement. Qualifying classes:
  particle/point-grid decomposition, shader displacement/dissolve/melt,
  scroll-scrubbed frame sequences, slice/shatter of the bitmap, live texture
  feedback or refraction, and the §3.5 immersion recipes (portal dive,
  depth-map dive, diorama, particle fly-through, scrub-dive). **At award-site
  ambition the default set-piece IS a §3.5 dive** — one moment where the
  visitor goes INTO an image or video rather than watching it move; choose a
  different pixel-transforming class only when a stated ASSET impossibility is
  recorded in the plan (no depth-capable asset exists AND none can be
  generated — with image-gen available this reason is almost never true, since
  a depth-capable composition can be prompted). Brand fit, taste, or "this
  concept links better" is NOT a valid skip reason: a masked reveal or curtain
  chosen over the dive on preference grounds fails the award-tier check. Choreographing whole rectangles (orbit, collapse,
  card fly-ins, grid reflow) is composition, not a set-piece at this tier —
  it may accompany one, never substitute for it. Evidence at verify: the
  sampled shader uniform / particle count / frame index changing with scroll.
- **Treatment classes, and a coverage floor at award tier.** Treatments split
  into two classes. QUIET class moves the rectangle or its window: curtain,
  inner-zoom parallax, ken-burns, hover wipe, strip entrance, floating drift.
  PIXEL class changes the image's own content: slice/shatter, particle
  disintegration or assembly, UV distortion/melt/ripple, RGB split, mosaic/
  pixel-assembly, living overlay, cursor torch, depth-map parallax, terrain
  displacement, tornado/vortex, frame scrub, print develop. **At dial ≥ 8 /
  award-site, ONE set-piece is not the whole show: at least half of the
  hero + key section images (minimum 3, set-piece included) carry a
  PIXEL-class treatment, each a DIFFERENT mechanism** — quiet class is
  reserved for the intensity curve's designated rest sections, chosen as
  rests on purpose. A page that is one set-piece plus curtains everywhere
  else reads exactly as static as no set-piece at all, and fails this floor.
  (Below dial 8 the §0 zoom/fade-floor and set-piece rules stand unchanged —
  this floor is what "award" buys.)
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

- **Cutout image props**: with no image-gen tool, source instead of generate —
  a verified real photo of the subject, matted to transparency (rembg / sharp /
  ImageMagick if available); if no photo source and no matting path exists, the
  prop is cut, never approximated with coded organic geometry (3d.md §3 rung 4).
  When generating: generate on a transparent background — prompt
  explicitly ("isolated on pure transparent background, studio product
  lighting, no backdrop, no shadow baked in") and REQUEST alpha-channel PNG
  output. **Verify the alpha is real**, not a white/checkerboard fill the
  model painted in: sample a corner pixel programmatically or view at 100%
  over a colored backdrop — a prop with a faint white halo is a failed
  generation, regenerate or matte it out (rembg/similar if available). Add a
  drop shadow / contact shadow yourself in CSS (`filter: drop-shadow(...)`),
  never bake it into the generation — a baked shadow breaks when the prop
  moves or the section behind it changes color.
- **3D props**: when a prop lives inside a WebGL scene, the DEFAULT is still a
  cutout image — on a billboard plane per 3d.md §3 rung 2 (alpha-tested plane,
  parallax + damped rotation + contact shadow), which is photoreal by
  construction. Coded geometry is reserved for ABSTRACT prop shapes (shards,
  ribbons, orbs-as-design-objects) and must carry a real textured material per
  `experimental.md` §1 (generated albedo + bump/roughness map, rim light,
  environment reflection) — never model an organic real object (bean, leaf,
  bottle…) from primitives; 3d.md §3 bans it. Either flavor is reusable: the
  SAME prop instanced multiple times (different scale/rotation) reads as a
  coherent motif, not repetition.

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
- **Image tornado / vortex**: 8-20 image cards on a helical path (WebGL
  planes, or DOM: `rotateY` + translate on a cylinder via per-card
  `--angle`), scroll progress spins and tightens/loosens the helix; cards
  face the camera (billboard) or shear with velocity. Entry/exit: cards fly
  in from scatter, settle into the vortex, then one card breaks out and
  expands into the next section's hero. Gallery/archive/portfolio registers;
  damp the spin (never raw-set), cap DPR, poster fallback.
- **Disintegration on scroll/click**: the image dissolves into particles that
  drift away along scroll direction — WebGL: draw the texture as a point grid
  (one point per NxN texel block, ≤ 10k), scroll/click drives `uProgress`
  which displaces points along noise + directional velocity while alpha
  fades; reverse the uniform to reassemble. Budget DOM version: the image
  sliced into a coarse tile grid, tiles translate/rotate/fade with staggered
  randomized offsets. Click-to-destroy variants pair with a rebuild on
  scroll-back — destruction must be reversible, content is never lost.
- **Pixel assembly on scroll**: the reverse of disintegration as an ENTRANCE —
  the image begins as scattered pixel blocks/particles (WebGL point grid ≤10k,
  or DOM: a coarse tile grid at randomized scatter positions/rotations) and
  scroll progress converges them into the finished picture; `uProgress` lerps
  each point from its noise-scattered origin to its texel home, alpha ramping
  up, optionally staggered radially or along a directional sweep. Pair with
  the headline resolving in the same beat. Scroll-back re-scatters
  (reversible). Variants: assemble from RGB-split ghosts converging, from
  mosaic chunks sharpening (§2 pixel swap driven per-tile), or from another
  image's dispersed particles (image A dissolves → its particles re-form as
  image B: a particle CROSSFADE between chapters).
- **Pixel sort / smear on velocity**: scroll velocity smears the image's
  pixels along one axis (shader: offset UV lookup by per-column noise ×
  velocity, or stretch bright bands glitch-style), decaying to sharp at rest
  — agitation that answers the visitor's speed. Digital/editorial registers.
- **Halftone/ASCII materialize**: media enters as its own halftone dots,
  scanlines, or character grid and resolves to the photograph on scroll or
  in-view — resolution as narrative. Budget: CSS `mask` with a dot pattern
  scaling down; full: a LUT/threshold shader ramping cell size to zero.
- **Living overlay**: a shader/canvas layer ON TOP of the media that reacts
  while the image stays legible beneath — flowfield streaks along the
  subject's edges, scanline/glitch bursts on scroll velocity, a displacement
  ripple radiating from the cursor, halftone dots that swell near the
  pointer. The overlay is the same §3 plane sampling the same texture —
  never a second copy of the asset.
- **Print develop**: media enters as paper-white → exposure/contrast/duotone
  ramps to full grade (CSS `filter` keyframes or a LUT shader), timed with
  the headline reveal. Photography/portfolio registers.

### The exploration protocol (run it before choosing anything)

The catalogs in this file are calibration, not a menu — the failure mode they
create is pattern-matching to the nearest listed effect. At dial ≥ 7, before
committing the media column of the blueprint, generate **three candidate
treatments that do not appear verbatim in this file**, each derived from the
brand's world (what does this subject physically DO? beans pour and tumble;
fabric folds and drapes; ink bleeds; glass refracts; records spin; steam
rises). Write the three candidates + the pick into the plan file with one
line each on construction cost. Pick the boldest one that clears §5's floors
and the register — if all three are weaker than a §2.5 exotic, use the
exotic, but the exploration must have happened. A media plan assembled purely
from listed effects, with no rejected invention on record, is minimum-effort
compliance.

### Exploration catalog (further constructions — steal the mechanics, reskin the idea)

Images beyond the frame:

- **Physics gallery**: images as draggable/throwable bodies (Rapier 2D or
  a spring sim) that collide, settle, and stack; scroll shakes the pile.
- **Infinite drag canvas**: a 2D plane of scattered media the visitor pans
  through (drag + inertia), items waking (scale/unblur/play) near the
  viewport center — the exploration-museum pattern.
- **Image as terrain**: the photo's luminance drives vertex displacement on
  a plane — the image becomes a relief the camera glides over on scroll.
- **Fake-3D depth parallax**: one still + a (generated or estimated) depth
  map; UV offset by depth × cursor/gyro = a photo with real parallax inside.
- **Cursor echo trail**: moving the cursor across a gallery leaves a decaying
  trail of image fragments/duplicates that fade behind it.
- **Collage assembly**: a section's imagery enters as scattered scraps
  (rotated, layered, torn edges) that scroll pulls into a composed collage —
  the reverse of disintegration.
- **Lens/magnifier**: a draggable optic over a large image or dense contact
  sheet, refracting (WebGL) or scaling (CSS) what's beneath.

Video beyond autoplay:

- **Scrub-as-transition**: a 1-2s generated clip scrubbed by route/section
  transition progress — the page change IS the video (door opens, liquid
  pours, light sweeps).
- **Video-lit scene**: sample the playing video's average/dominant color per
  frame (offscreen canvas) and drive ambient page tint/glow from it — the
  video becomes the room's light source.
- **Timeline flipbook**: N generated stills of one subject across time/states
  flipped by scroll — a bean roasting darker, a garment assembling — the
  narrative version of a scrub sequence.

Props beyond floating (§1.5 behaviors, upgraded):

- **Flocking swarms**: 20-80 instanced prop cutouts with boids/noise motion
  that scatter from the cursor and reform into a loose formation (or the
  brand mark's silhouette) at rest.
- **Pour/emit systems**: props emitted from a source object (beans from a
  bag, petals from a stem) on scroll or click, falling with gravity + drag,
  settling into a pile that persists per session.
- **Props as UI**: the prop IS the control — a bean that drags along a
  roast-level slider, a bottle that tilts to pour the page to the next
  section. One per page; must keep an obvious conventional equivalent.

Same law as §2.5: every construction here still clears §5's floors, earns one
sentence of communication value, and ONE set-piece per page — an exploration
catalog is not permission to ship five spectacles.

Discipline stays the law: the composed treatment must still clear §5's floors,
DESIGN.md §6's "one sentence of communication value", and one-signature-
per-page — an inventive effect stamped on every image is as loud as a marquee
on every section.

## 3. WebGL tier — the media plane (the unseen.co mechanic)

When dial ≥ 8 or cinematic/immersive is active, media renders THROUGH the
canvas so shaders can touch it. **At award-site ambition this section is a
REQUIREMENT, not an option**: the hero image and at least one gallery/section
image set must be live media planes whose shader visibly responds to scroll
(velocity distortion, dissolve, RGB split, curvature — pick from §2.5) — a
page whose images all sit in flat DOM rectangles has not met the tier, no
matter how much 3D floats around them. Verification must prove it: sample a
plane's driven uniform (e.g. `uVelocity`, `uProgress`) or its rect-synced
transform during a scripted scroll and record two differing values in
verify.md. The core pattern, in order:

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

## 3.5 Going INSIDE the media (immersion recipes)

The strongest media moment on the modern web is not looking AT an image —
it's the camera going INTO it: the photo stops being a rectangle on a page
and becomes, briefly, the space the visitor is in. These are the recipes,
cheapest first; at dial ≥ 8 with a canvas, prefer one of these as (or inside)
the set-piece over any flat treatment:

1. **The portal dive (DOM tier — no WebGL needed).** Pin the section; scroll
   scales the image from framed rectangle past 100% of the viewport while a
   `clip-path` aperture opens, until its interior IS the background — and the
   next section's content fades in already "inside" it (its palette sampled
   from the image's deep tones so the world feels continuous). Reverse on
   scroll-back. Layer 2-3 depth children (see recipe 3) inside the frame and
   the dive reads as truly spatial, not as a zoom.
2. **The depth-map dive (WebGL, the real thing).** Get a depth map for the
   image: generate one (prompt the image tool for "depth map of this scene,
   white near black far" alongside the still), or approximate from luminance/
   a vertical gradient for scenes with obvious near-ground/far-sky structure.
   Subdivided plane (~128×128), vertex shader displaces z by depth × uDolly;
   scroll drives the camera INTO the displaced relief (dolly + slight fov
   ease) while pointer shifts a ±3-5° parallax. Near pixels slide past the
   camera edges as you enter — that edge-slide is what sells "inside".
   Occlusion artifacts at the silhouette are hidden with fog/vignette matched
   to the image's palette.
3. **The diorama (matted layers).** Cut the image into 2-4 real layers
   (subject / midground / backdrop — matte with the §1.5 cutout pipeline, or
   generate the layers separately in the same prompt world). Place them at
   real z-depths (WebGL planes or CSS `translateZ` with perspective on the
   parent) and move the camera between them on scroll: passing a foreground
   layer's edge as it exits the frame is the moment the brain accepts depth.
   The generated-layers path beats matting: ask the image tool for the same
   scene as "foreground elements only, transparent background" + "empty
   background plate".
4. **The particle fly-through.** Build the image as a point cloud (§2.5
   disintegration budget: ≤ 10k points sampled from the texture, point size
   by luminance). Scroll doesn't just dissolve it — it drives the camera
   THROUGH the cloud: points ahead grow, pass the camera plane, and exit
   behind (kill/respawn them past z=camera). Halfway through, the cloud
   re-forms into the NEXT image — one continuous flight from picture to
   picture is a set-piece by itself.
5. **The scrub-dive (video/frames).** A scroll-scrubbed frame sequence
   (generate-sequence, or frames extracted from video via ffmpeg) whose
   camera already moves INTO the scene (prompt the generation that way:
   "dolly forward into…"); pin the section, map scroll → frame index
   (preload + draw to a canvas, never seek a `<video>` per frame), and the
   visitor's scroll finger literally walks the camera in. Exit the pin at
   the deepest frame into a section graded to that frame's palette.

Wiring rules: these are still media planes — DOM element stays for a11y and
the fallback is the graded flat image (§3's rules apply unchanged). ONE dive
per page (it's a set-piece-class moment; two dives cheapen both). The dive
target must be an image whose composition has actual depth to enter (a
corridor, a room, a landscape, machinery receding) — prompt/choose the asset
for that; diving into a flat-lit product shot reads as a zoom, which is the
failure this section replaces.

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
