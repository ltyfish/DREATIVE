# Dreative Plan Mode — decide everything before the first line of code

This skill is for **drastic change** — a section, a page, or the whole site being
meaningfully redesigned or built. It is not for button tweaks or single-token
nudges unless the user explicitly invokes it for one.

**Plan Mode is MANDATORY.** Every Mode A request in scope runs this protocol —
do not ask "plan or build directly?", do not offer a skip, do not silently jump
to code. The ONLY exception is the user explicitly saying "no plan / just do
it" this session; then note you're skipping and go straight to DESIGN.md +
doctrine defaults.

The failure this file prevents: jumping into code with half a brief, discovering
mid-build that media/tools/structure are missing, and shipping a page that is
60% of what the user actually wanted.

Plan Mode is ONE planning pass → a short sequence of single questions (§3) → a
written plan → (optional) mockups for approval → execution in the plan's order.
Questions come one at a time so each is easy to answer, but the interview stays
short: only what the prompt genuinely leaves open, then build.

## 1. Capability probe (before proposing anything)

Enumerate what your environment can actually produce, and write the result down
(one line per capability in the plan file, §4). Check for:

- **Image generation** — an image-gen tool/MCP, or a CLI that produces images.
- **Video generation** — a video-gen tool/MCP (seamless loops, image-to-video).
- **Browser tools** — screenshot + console + interaction (needed for the
  verification protocol; note it if absent).
- **Asset tooling** — anything for compression/conversion (ffmpeg on PATH,
  sharp/squoosh in the project) for posters, loops, and frame sequences.

Rules:
- Probe by LOOKING (list your tools, `which ffmpeg`, check MCP config), never by
  assuming. A capability you didn't verify doesn't exist.
- If a capability is missing but the design clearly wants it (e.g. a cinematic
  brief with no video-gen), you MUST ask a real question with a real choice —
  **stating the gap and moving on is not an offer, it's a disclosure.** The
  bug this catches: saying "video generation isn't available, so I'll use
  stills" and continuing is a FAILURE even though it's honest. The fix is a
  question with at least two live options: "install <concrete MCP/tool name>
  now and use it" vs "skip it, use <the specific fallback>". Ask it in the
  question round (§3), phrased as a genuine fork, not a heads-up. Never
  install tools silently; never silently degrade either.
- The probe result changes the blueprint: no video-gen → hero loops become
  generated stills + ken-burns or a shader surface; no browser tools → the
  verification protocol's manual fallback (SKILL.md) must be declared up front.

## 2. The blueprint (section-by-section, media-first)

Draft the page as a compact table BEFORE asking anything — the question round
presents choices about a concrete plan, not abstractions. Per section:

| section | layout family | media plan | motion treatment | interaction | fallback |

- **media plan** — one of: `generate-image` (subject + exact aspect + palette/
  light-temperature prompt notes), `generate-video` (loop subject, 5-10s,
  seamless), `generate-sequence` (N frames for scroll scrub), `real-asset`
  (exists in repo / user must supply — name it), `none`. Media enters through
  the motion system per `skills/media.md` — name the treatment (curtain reveal,
  mask-shaped, hover-woken, media-plane distortion…), never "add an image".
- **motion treatment** — from motion.md/immersive.md/cinematic.md vocabulary,
  with the dial-appropriate ambition. **motion.md §9's inventory is a hard
  plan gate, not a target:** at expressive/award-site ambition the blueprint
  must enumerate every §9 item for its dial — which element carries it, what
  triggers it — or explicitly name the item as cut with a reason. A plan that
  neither covers nor justifies a §9 item is incomplete; rework it before
  presenting, don't ship the gap to the build.
- **fallback** — for every ambitious cell (WebGL, sim, scrubbed sequence,
  generated video), the concrete boring version that ships if the fancy one
  fails runtime verification. A plan cell without a fallback is not ambitious,
  it's fragile.

Plus four page-level lines: register + design read (DESIGN.md §2), signature
element, animation stack (ONE system: GSAP+Lenis or motion/react — motion.md §0),
and the mobile strategy per ambitious effect (DESIGN.md §13).

## 3. The questions (ONE question per call, asked in sequence)

Ask with the structured question tool (AskUserQuestion), **one question at a
time** — never dump the whole pool in a single round; a wall of 4 simultaneous
questions is exactly the failure this section prevents. Each answer can change
what you ask next (e.g. a "cinematic" treatment pick makes the media question
matter more; "restyle" depth kills the mockup question).

**Skip what the prompt already answers.** Before asking anything, walk the pool
below against the user's prompt + attachments: a question whose answer is
already CLEAR in the prompt is never asked (asking it anyway is a bug). But
clear means clear — if the prompt touches a topic ambiguously ("make it
animated" — which treatments? how far?), ask that question anyway, narrowed to
the ambiguity ("you said animated — full scroll choreography, or calm
micro-interactions?"). Restate what you inferred from the prompt in the plan
file so silently-skipped questions are still auditable.

Order most-decision-changing first, keep the total short (typically 3–5 asked,
hard cap 7). Structured tools always offer an "Other" free-text option, so
every question doubles as a remarks channel — and the last question asked
should explicitly invite extra direction.

1. **Depth** (redesigns of existing code only) — the §11 transformation-depth
   ladder: restyle / re-layout / restructure / reimagine.
2. **Treatments** (multi-select — THE canonical skill-picker list). List every
   option **individually**, never pre-bundled into a combo choice (a
   "refined+motion+interaction+ux+mobile" single option is a bug — the user
   can't select a subset of a bundle). Mark the ones the request obviously
   implies "(Recommended)" on their own line, and always offer a literal
   **"select all"** option separately from any individual recommendation —
   for structured-question tools that support multiSelect, this is the
   multiSelect list itself; for text-mode fallback, spell out "say 'all' to
   pick every treatment below".
   **Word the options for a non-designer**: each label/description names what
   the VISITOR sees or feels, in plain words, with one concrete example —
   never bare technique jargon ("kinetic type", "editorial restraint",
   "scroll choreography" mean nothing to most users). The canonical list,
   with user-facing phrasing to adapt:
   - **motion** — "things move as you scroll: sections glide in, headlines animate, layers drift at different speeds"
   - **interaction** — "everything feels touchable: buttons react, cards respond to hover, small satisfying feedback everywhere"
   - **3d** — "real 3D on the page: an object or scene you can see depth in, lit and rendered live (like a product you scroll around)"
   - **immersive** — "the page feels like a place you travel through — scrolling is a journey with chapters, not a document"
   - **cinematic** — "dark, moody, movie-like atmosphere: glow, particles, fluid surfaces (think film title sequence)"
   - **refined** — "quiet luxury: lots of space, beautiful photography, very little movement — Apple/fashion-brand calm"
   - **media** — "AI-generated images/video made for this page and woven into the motion (hero film loop, images that come alive)"
   - **ux** — "everything actually works: menus, forms, cart, keyboard — pretty AND functional" (recommend by default)
   - **mobile** — first-class phone experience: bespoke mobile choreography and
     layout treatment beyond baseline responsiveness (thumb-ergonomic redesign,
     animations re-authored for touch, not just scaled down). **NOT recommended
     by default** — baseline responsive/working-on-phone is already guaranteed
     for every build via `ux` + DESIGN.md §13's required mobile strategy line,
     so don't mark this "(Recommended)" just because a build is ambitious.
     Recommend it only when the user asks for it, or the brief signals mobile
     is a primary surface (e.g. explicitly mobile-first, or a mobile-heavy
     audience/product).
   - **experimental** — user-facing phrasing: "go weird: images that tear/
     dissolve/reassemble as you scroll, the camera diving into scenes, one
     never-seen-before idea per section". Internally this is the
     creative-mindset dial (`skills/experimental.md`): full
     scroll-reactive assets (images that disperse/reform/refract as you
     scroll, not just sit still with particles in front), textured/materialed
     3D instead of smooth plain geometry, camera/dimension shifts on
     scroll/interaction (zoom into a scene, rotate to a new view, transition
     between spatial "worlds"), willingness to try a genuinely unusual idea
     per section rather than the safe default of that treatment. Recommend
     this whenever the user's language points at "crazy", "bizarre", "wow",
     "never seen before", or award-tier + immersive/cinematic/3d stacked
     together — it's the difference between effects *placed on* the page and
     the page *behaving* like the reference sites when you interact with it.
   Plus "none — plain design doctrine only". Skip only when the user already
   named the treatments or the request is trivially a restyle; read each
   chosen `skills/<name>.md` before designing.

   **Propose extra, request-specific skills beyond this fixed list** when the
   brief hints at something the 10 named treatments don't cover well (sound
   design, generative/procedural patterns, data-driven visuals, AR-ish
   camera tricks, a custom cursor system, easter eggs). Name each candidate
   in the same question as an extra option with a one-line description —
   don't invent a `skills/<name>.md` file for a one-off idea; fold ad hoc
   candidates into the blueprint under the closest existing skill (usually
   `experimental` or `interaction`) and note the specific technique inline.
3. **Media & asset types** (multi-select) — offer every asset class the probe
   found tools for, and let choices stack: `generated images` · `generated
   video loops` · `custom 3D` (real models/geometry, textures, and shaders
   built in code — top-tier 3D sites are made of custom 3D assets, not
   wallpaper images behind a canvas) · `custom props` (small isolated
   compositional elements — transparent-bg cutout images or lightweight
   textured 3D objects, per `skills/media.md` §1.5 — scattered/floating
   decoration distinct from hero/gallery media) · `real assets` (in repo /
   user supplies) · `placeholders only`. Mark the probe-backed recommendation
   "(Recommended)".
   **State the cost honestly: image/video generation is token-intensive** — say
   roughly how many assets the blueprint wants and that each costs real
   tokens/time, so "images only" or "placeholders" is a legitimate budget
   choice, not a downgrade. If a needed tool is missing, this is where the
   install offer goes ("I can add <X> MCP for video generation — ok?").
4. **Ambition tier** — present each tier with a plain description, a
   best-fit use case, AND its honest tradeoff (a user choosing blind between
   "cool-sounding" labels is the failure this wording prevents):
   - **safe** — polished, clean, light motion. *Best for:* dashboards, apps,
     content-heavy sites, corporate audiences, tight deadlines. *Tradeoff:*
     looks professional, won't turn heads.
   - **expressive** — rich scroll motion, 3D accents, everything still
     instantly usable. *Best for:* most product, e-commerce, and marketing
     sites — the show/usability sweet spot and the default recommendation.
     *Tradeoff:* heavier than safe, but visitors never fight the page.
   - **award-site** — the page becomes an experience: immersive 3D, cinematic
     pacing, experimental transitions (dial 9-10). *Best for:* portfolios,
     launches, brand showcases, agency work — anywhere wow IS the goal.
     *Tradeoff:* heaviest build, longest load, and deliberately unconventional —
     visitors explore rather than skim, so it can frustrate someone who just
     wants the price list. Say this plainly when offering it.
   Higher tiers also mean a longer build and a mandatory runtime verification
   pass — state that cost too.
   **Which option gets "(Recommended)" is computed, and the default bias is
   UP:** when the brief carries no strong signal either way, recommend
   **expressive** — unnamed ambition becomes beige (DESIGN.md §2), and this
   skill exists for drastic change. Recommend **safe** only on concrete
   counter-signals: explicit "minimal / corporate / clean / subtle" language,
   a product/app/dashboard surface rather than a marketing page, or a hard
   deadline constraint (item 7). Recommending safe to a signal-free brief is
   a bug, same class as the item-8 mockup inversion.
5. **References (ask unless the prompt already supplied them)** — "Do you have
   any reference — an image/screenshot, a website you love, or a video of a
   feel/motion to chase?" Options like: attach image(s) / paste a website URL /
   share a video (URL or file) / "surprise me — invent it from the brand" /
   match the existing brand. When a reference arrives, actually study it before
   designing (SKILL.md's references rule: fetch the site / read the image,
   distill what specifically to borrow — palette, type feel, layout family,
   motion cues — never guess a named site from memory). **Video references:**
   if the environment has no tool that can actually watch video, say so and
   recommend (optional, never required) installing a video-analysis MCP so you
   can study the clip's motion/pacing for real; if the user declines, fall back
   to their own description of the video plus any frames/screenshots they can
   paste — never pretend to have watched it.
6. **Vibe & audience** (when the brief is thin) — 3-4 contrasting directions
   as options, each a one-line register + palette + energy sketch ("quiet
   luxury: bone, near-black serif, almost no motion" vs "electric launch:
   drenched color, kinetic type"), plus who the page must convince (buyers /
   investors / recruiters / fans). This seeds DESIGN.md §2's design read.
   **Always include an explicit "describe your own theme" option** (own
   words: palette, mood, a brand they admire) alongside the presets — the
   presets are a starting menu, not the only path, and a user with a theme
   already in mind shouldn't have to force-fit one of 3-4 canned directions.
   If the user has already given any theme/description language in the
   prompt, skip the presets and just confirm what was inferred instead of
   re-asking.
7. **Scope & priorities** (multi-page or vague requests) — when the codebase
   has more than one page/route, always ask explicitly which are in scope:
   list the discovered pages by name and offer **"all pages"** as one option
   alongside individually-named pages (multi-select, so the user can pick a
   subset like "home + product page" without getting everything). Never
   assume "all" just because the brief said "redesign the site" — confirm it.
   Also capture what's in this pass vs later, and any hard constraints
   (existing brand tokens to keep, CMS/content that must survive, deadline
   implying the safe tier).
8. **Mockups first?** — offer to build 1:1 mockups BEFORE the full build:
   "Mockup the key pages first" / "Straight to build". **Which one is marked
   "(Recommended)" is NOT static — compute it from the depth + ambition
   answers already given:** reimagine or restructure depth, OR award-site
   ambition, mean this is among the biggest changes the tool can make, so
   **"Mockup first" is the recommended option.** Recommend "Straight to
   build" only when depth is restyle/re-layout AND ambition is safe/
   expressive. Getting this backwards (recommending straight-to-build on a
   reimagine + award-site combo) is a bug, not a stylistic choice. If yes,
   execute §4b before touching real code.
9. **Final remarks** — close the round with an open catch-all: "Anything else
   I should know or you'd love to see — specific effects, colors you hate,
   sections to add or kill?" Options: "no, go build" / "yes (write it in
   Other)". Everything written here lands verbatim in the plan file and is
   honored like the brief. **This question is asked on every single round,
   with no exception** — it is the fixed closer, never trimmed, never
   replaced by ending the round on whatever question happened to be last
   (e.g. references or mockups). If references was the last substantive
   question asked, final remarks still follows it as its own separate call.

When trimming to stay under the cap: depth / treatments / references / media
usually win; fold ambition into treatments' recommendations when crowded, and
vibe/scope into the blueprint you present for approval. **Mockups (§8) and
final remarks (§9) are never trimmed** — they are the last two questions of
every round, in that order, regardless of how many others got cut. Never
re-ask a question already answered (in the prompt or in an earlier answer);
ambiguity discovered mid-build resolves by the plan's spirit + doctrine
defaults.

### Calibration references (what the top tiers actually look like)

When the user picks award-site ambition or 3d/immersive/cinematic treatments,
these are the bar (fetch and study whichever is closest before designing):

- https://www.experiencethebestyou.com/en-GB/ — coordinated scroll choreography
  + heavy custom 3D/motion throughout.
- https://unseen.co/projects/contra/ and https://unseen.co/projects/letter/ —
  WebGL media planes, shader transitions, kinetic type (browse
  https://unseen.co/projects for more in the same family).
- https://25residences.com/ — luxury real-estate register, cinematic pacing.
- https://www.ciaoenergy.com/ — THE reference for a real 3D product on the
  page (stack verified from source): ONE `can.glb` + a small `base.glb`, an
  `.hdr` environment map for lighting, `MeshPhysicalMaterial`, and six
  per-flavor **label textures** (AVIF) swapped onto the same geometry via
  `TextureLoader` — one model, N palettes. Scroll drives it with plain
  `ScrollTrigger.create`; backgrounds are pre-rendered per-flavor video
  loops, not live sims. Lesson: photoreal product 3D = real GLB + real label
  texture + HDRI environment — never coded geometry (3d.md §3) — and the
  cheap parts (backgrounds) are pre-rendered video.
- https://www.cinetica.studio/ — the "composed chaos" register (stack
  verified): Webflow + the FULL GSAP plugin suite (ScrollTrigger, SplitText,
  ScrambleText, Flip, Draggable, InertiaPlugin, Observer, CustomEase) +
  Lenis + embedded WebGL shader scenes (Unicorn Studio) + Spline + video.
  Lesson: the crazy feel is mostly ELABORATE TEXT/LAYOUT CHOREOGRAPHY
  (scramble, split-line, flip transitions, drag/inertia) layered over a few
  shader surfaces — not one giant 3D scene.
- https://www.penguin-capital.co.jp/en and https://designxhand.com/experience
  — the clean-expressive pole: Next.js/custom builds with three.js + GSAP +
  Lenis (+ Lottie), a single full-page background canvas
  (`pointer-events: none`) behind calm editorial type. Lesson: one quiet
  WebGL layer + disciplined type can read premium-crazy without cinematic
  darkness.

Common thread: their 3D is **custom models, textures, and shaders**, not
generated wallpapers behind text. If the environment has 3D-capable tooling and
the user opted in, build real 3D material (geometry, materials, lighting,
shader surfaces per `skills/3d.md`); reserve generated images/video for what
3D can't do. This tier only happens when the user explicitly chose it in the
question round — never impose it.

## 4. Write the plan, then execute it

Persist the approved plan to `.dreative/plan.md` (or the scratchpad if
`.dreative/` doesn't exist): capability manifest, the **full Q&A transcript**
(each question asked + the answer, verbatim, including free-text remarks),
each SKIPPED question with the inference drawn from the prompt, references
studied with the distilled borrow-list, blueprint table, stack, mobile
strategy, fallbacks. Long sessions lose context; the plan file is the re-entry
point — a resumed session re-reads it instead of re-deciding or re-asking.

**Then show the plan to the user in chat, before touching code.** Writing
`plan.md` is not the same as the user having seen it — after the last
question (§3.9) is answered, post a readable recap in the same conversation:
the blueprint table (§2), the ambition/depth/treatments chosen, the asset
plan and its honest cost, references studied and what was borrowed, and any
install offers taken. This is a plan RECAP, not another approval gate — don't
block on it unless mockups (§4b) were opted into — but skipping straight from
the last answer to "building now" without ever surfacing the plan is a bug:
the user answered several questions and is owed a look at what they add up to
before code starts. Keep it scannable (the table + a few bullets), not a
restatement of this whole file.

## 4b. Mockups (when the user opted in)

Pick the page(s) with the **biggest/most important planned change** (usually
1–2; the blueprint tells you which). For each, build a mockup that is a **1:1
replica of exactly what the full build would produce** — same stack, same
markup structure, same type/color/spacing, same motion and effects actually
running (real GSAP/Lenis/three.js code, not a note saying "animation here").
It is built for VISUAL judgment, not function: strip data fetching, handlers,
and routing to representative literals — like SKILL.md's replica/design-page
files (single file, default export, self-contained). The rule is: what the
user sees in the mockup is what they'd see in the shipped page; nothing in the
mockup that the build wouldn't do, nothing in the build's look that the mockup
hides.

Write mockups to `.dreative/mockups/<page>.tsx` (or the scratchpad), serve or
screenshot them for the user, and ask one approval question: approve / tweak
(what) / rethink. Approved mockups become the source of truth — the full build
replicates them exactly and extends the system to the remaining pages. Fold
tweak feedback into the plan file before building.

**Execution order (always):**

1. **Assets first.** Generate every planned image/video/sequence NOW, at the
   blueprint's aspect ratios, graded to the palette (media.md §1). Sections get
   designed around real assets, not around placeholders that "will be swapped".
2. **Foundation.** Install and WIRE the animation stack (motion.md §8), fonts,
   tokens, providers — before any section code.
3. **Sections** in blueprint order, each honoring its row (skills tagged per
   section apply to that section).
4. **Effects + choreography** across sections (page-level timelines, transitions,
   the signature element).
5. **Verification** — the full runtime protocol (SKILL.md §V: runtime gates +
   self-critique, mobile first, evidence written to `.dreative/verify.md`).
   Any effect that fails gets its planned fallback, and the final report says
   so: "shipped the §2 fallback for X because Y".

Report against the plan when done: each blueprint row → shipped / fallback /
cut (with reason), plus the motion inventory (motion.md §9) and the preservation
ledger when §11 applies. A build that silently diverges from its approved plan
is a bug even when it looks good.
