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
  generated stills + ken-burns or a shader surface; **no image-gen → media
  cells become `source-image` (DESIGN.md §7's priority: verified stock/CDN
  photography), every planned cutout prop becomes a sourced-and-matted photo
  or is cut, and any 3D of an organic real-world subject is re-planned as a
  photo billboard, an abstract form, or cut (3d.md §3 rungs 2/4 — coded
  organic geometry never becomes the fallback)**; no browser tools → the
  verification protocol's manual fallback (SKILL.md) must be declared up front.
  Missing tools change WHERE assets come from, never whether media/3D rules
  apply — sourced media carries the same treatment obligations (media.md §0).

## 2. The blueprint (section-by-section, media-first)

Draft the page as a compact table BEFORE asking anything — the question round
presents choices about a concrete plan, not abstractions. Per section:

| section | layout family | media plan | motion treatment | interaction | intensity | fallback |

- **media plan** — one of: `generate-image` (subject + exact aspect + palette/
  light-temperature prompt notes), `generate-video` (loop subject, 5-10s,
  seamless), `generate-sequence` (N frames for scroll scrub), `real-asset`
  (exists in repo / user must supply — name it), `none`. Media enters through
  the motion system per `skills/media.md` — name the treatment (curtain reveal,
  mask-shaped, hover-woken, media-plane distortion…), never "add an image".
  At dial ≥ 7 the blueprint also names the page's ONE media set-piece
  (media.md §0 — image tornado, disintegration on scroll, shatter/reassemble,
  living overlay…) and which section carries it; a dial-7+ plan whose media
  column is all quiet treatments is incomplete.
  When the set-piece is a media.md §3.5 dive (the award-tier default), its
  `generate-image` cell must plan a DEPTH-CAPABLE composition (a corridor,
  room, landscape, machinery receding — something a camera can enter) and
  the companion assets in the same cell: the depth map and/or the separated
  foreground/background plates, generated in the same prompt world.
  The set-piece is chosen via
  media.md's exploration protocol: invent three brand-native candidates not
  listed in the catalogs, record them + the pick in the plan file — a media
  plan assembled only from listed effects with no rejected invention on
  record is minimum-effort compliance. **Every media-plane / pixel-class cell
  names WHICH image asset the effect consumes as its texture/source** — a
  "shader plane" cell with no named image, or a plane carrying its own
  separate texture (steel/noise/gradient) layered over the section's
  photography, is an invalid cell (media.md §0's overlay-plane loophole: the
  treatment must transform the image's own pixels, aligned to its rect —
  never a decorated rectangle floating over a static `<img>`).
  **Custom 3D in a media cell must name
  its asset source in the blueprint** — a GLB path, a generated/sourced
  texture (the actual prompt or file), or the billboard cutout it will ride
  on. "Custom 3D bean/bottle/plant geometry" with no named source is an
  invalid cell: primitives can't produce an organic subject (3d.md §3), so
  re-plan it as rung 2 (photo billboard) or an abstract SUPPORTING form
  (3d.md §3 rung 3 — never the promoted signature object) at plan time —
  don't let the build stage discover this. The user picking "custom 3D" in
  the media question grants the *medium*, not an exemption from the ladder.
  Every 3D prop cell also names its BERTH (3d.md §1.5): which lane/stage of
  the section it occupies and what the layout does to make room — a prop
  planned "over the hero image" or with no berth is an invalid cell.
  At award-site ambition the blueprint must contain at least one 3D prop
  cell (3d.md §0's required prop — GLB or cutout billboard, with its berth
  and asset source named); zero prop cells = incomplete plan.
  At dial ≥ 8 the media column additionally marks each hero/key image's
  treatment as quiet-class or PIXEL-class (media.md §0) and must already
  satisfy the coverage floor on paper: at least half pixel-class (min 3,
  set-piece included), each a different mechanism, quiet cells tied to the
  intensity curve's rests.
- **Travel map (mandatory when any element persists across sections).** If
  the blueprint contains a fixed canvas object, a recurring signature, or any
  scroll-morphing prop that lives through more than one section, add a travel
  map under the table: one line per section giving the object's position /
  scale / opacity there, each berth chosen against that section's layout so
  it never sits over text or controls (DESIGN.md §15). No berth fits ⇒ the
  object is scripted HIDDEN for that section. A persistent object without a
  travel map is an unplanned collision that verify will find later — plan it
  now. The set-piece at dial ≥ 8 must also be pixel-transforming per
  media.md §0 (placement choreography like orbit/collapse doesn't qualify).
- **Mechanism-diversity quota (dial ≥ 7 / expressive+).** Floors measure the
  weakest item; quotas measure the whole page. Across the blueprint's media +
  interaction columns count the DISTINCT mechanisms (curtain reveal, media
  plane, drag gallery, cursor torch, disintegration… — by name) and the
  DISTINCT drivers (scroll, cursor/hover, drag, click, time/idle): the page
  needs **≥ 4 distinct mechanisms spanning ≥ 3 distinct drivers, and no
  mechanism used more than twice**. Every hero/key image gets BOTH an idle
  life and an input response — one or the other is the floor, not the plan.
  "Curtain reveal ×5 + one set-piece" fails the quota: that is a page grazing
  its rules, not a designed page. The quota tallies go in the plan file and
  are re-counted at verify.
- **motion treatment** — from motion.md/immersive.md/cinematic.md vocabulary,
  with the dial-appropriate ambition. **motion.md §9's inventory is a hard
  plan gate, not a target:** at expressive/award-site ambition the blueprint
  must enumerate every §9 item for its dial — which element carries it, what
  triggers it — or explicitly name the item as cut with a reason. A plan that
  neither covers nor justifies a §9 item is incomplete; rework it before
  presenting, don't ship the gap to the build.
- **intensity (the pacing map)** — 1–10 per section: how loud this section is
  (motion + media + visual weight combined). The page must read as a CURVE, not
  a flat line: uniform intensity fails in both directions (all loud = exhausting,
  all quiet = the set-piece feels bolted on). Place deliberate rests (≤ 3)
  immediately before and after the set-piece so it lands; the hero and the
  set-piece section are the peaks, nothing else matches them. A blueprint whose
  intensity column is all the same number is incomplete — rework the pacing
  before presenting.
- **fallback** — for every ambitious cell (WebGL, sim, scrubbed sequence,
  generated video), the concrete boring version that ships if the fancy one
  fails runtime verification. A plan cell without a fallback is not ambitious,
  it's fragile.

Plus four page-level lines: register + design read (DESIGN.md §2), signature
element, animation stack (ONE system: GSAP+Lenis or motion/react — motion.md §0),
and the mobile strategy per ambitious effect (DESIGN.md §13).

**Signature-element plan gate.** The signature line is checked HERE, not
discovered at build time: if the signature is a visual OBJECT, it must be a
subject a stranger names correctly (3d.md §3's subject test). An abstract
coded form — sphere/orb/ring/blob/torus/monolith, whatever poetic name the
plan gives it ("atlas", "core", "eclipse") — is an INVALID signature object
and the plan is reworked before it's presented; 3d.md §3's ban applies to the
plan's words, not just the build's meshes. Signatures that are mechanisms
(a strip-toss, a cursor instrument, a depth dive) rather than objects are
exempt — the gate is for promoted decor objects. **Award prop form default:**
when image-gen exists and no real GLB does, the required 3D prop (3d.md §0)
is planned as a rung-2 transparent photoreal cutout billboard — field
experience is unambiguous: cutout props read premium, coded/shader hero
geometry reads as a demo. A plan may promote live coded geometry to signature
ONLY with a named GLB + texture source in its cell. **Coded custom 3D is
capability-gated at the probe (§1):** offer/plan it only when the probe
verified an actual quality path — a real GLB in reach, image-gen for
albedo/label textures, an HDRI/environment source. No verified texture path
⇒ the `custom 3D` option is presented as "3D-look props (photoreal cutouts
sold with depth)" and every 3D cell is planned as a rung-2 billboard; coded
geometry without a texture path is never planned "to be figured out at
build".

**Previous-run divergence (reruns over the same project).** If
`.dreative/plan.md` (or verify.md) from an earlier run already exists in this
project and the user asked for a NEW take (rather than iterating the shipped
one), read the old plan first and diverge on at least: signature family,
set-piece family, hero layout family, and palette strategy. Reusing the old
run's choices because they're in context is the same reflex the entropy draw
exists to break — a rerun that a user would describe as "the same site again"
is a failed rerun. Record in the new plan file which axes diverged from the
previous run.

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

**Answers come only from the user, through the tool.** Never infer, assume,
or self-supply an answer to a question you posed — an unanswered question
blocks; a fabricated answer is a corrupted plan. If the user's reply to ANY
question is itself a question, a request to re-see options, or free text that
doesn't answer what was asked ("wait, what were the vibe options?"), that
question is NOT answered: respond to what they asked first (re-present the
options, clarify), then re-ask the original question as its own call. A
question consumed by a side-exchange and never re-asked is a lost decision —
track which pool items actually have answers, not which were merely posed.
Free text volunteered mid-round (a new feature, a constraint) is captured in
the plan file AND acknowledged in the next message, but doesn't substitute
for pending questions.

**Skip-honesty (the under-asking bug).** "Skip what the prompt already
answers" has a strict test: a question may be skipped ONLY when the prompt
LITERALLY contains its answer — and the plan file must QUOTE the prompt words
that answer it next to the skip. "I can infer a reasonable choice" is not a
skip license; silence in the prompt means ASK. In particular, **treatments
(item 2), media/asset types (item 3), and references (item 5) are never
skipped on inference at expressive/award ambition** — these are the three
questions that most change the build, and a round that jumps from vibe →
ambition → mockups → remarks without them delivered a design the user never
chose. Questions that are genuinely N/A (depth on a from-scratch build, scope
on a single page) are the only inference-skips allowed. If the asked count
lands under 4 on a non-trivial build, re-check the pool — you almost
certainly over-skipped.

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
   **Set the iteration expectation honestly:** when the user picks `custom
   3D`, `custom props`, or (later) award-site ambition, say plainly — in the
   question's description or the plan recap — that complex 3D motion and prop
   choreography rarely land perfectly in one pass: the first build ships a
   working version (planned fallbacks where an effect fails verification),
   and 1–2 follow-up prompts to tune specific moments are normal and
   expected. This is a disclosure, not a discouragement; it prevents
   "the plan promised more than the page shows" disappointment, and it never
   licenses shipping less than the plan — the verify gates still apply in
   full on pass one.
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
   reimagine + award-site combo) is a bug, not a stylistic choice. When depth
   is restructure/reimagine OR ambition is award-site, also offer a third
   option: **"two divergent mockups"** — the two strongest concepts from the
   explore pass (DESIGN.md §2) each built as a mockup, user picks. State the
   honest cost (a second mockup is real tokens/time); it's an offer, never
   the default. If yes to any mockup option, execute §4b before touching
   real code.
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

These teardowns were verified July 2026 and will age — sites redesign and
registers move on. At award-site ambition, when browser tools exist, spend ONE
fetch on a current source (Awwwards SOTD or godly.website) to confirm the
register you're chasing is still the frontier, and note in plan.md what you
saw. The stack LESSONS above outlive the sites themselves; the aesthetics
don't.

Common thread: their 3D is **custom models, textures, and shaders**, not
generated wallpapers behind text. If the environment has 3D-capable tooling and
the user opted in, build real 3D material (geometry, materials, lighting,
shader surfaces per `skills/3d.md`); reserve generated images/video for what
3D can't do. This tier only happens when the user explicitly chose it in the
question round — never impose it.

## 4. Write the plan, then execute it

Persist the approved plan to `.dreative/plan.md` (or the scratchpad if
`.dreative/` doesn't exist). **The first time this run writes into
`.dreative/`, also write `.dreative/README.md`** with exactly this content
(it stops other agents/CLIs from mistaking run artifacts for the skill —
observed failure: an agent found `.dreative/`, said "not a proper SKILL.md",
then used these outputs as its instructions):

```markdown
# Dreative run artifacts — NOT the skill

Everything in this folder (plan.md, system.md, verify.md, assets.json,
mockups/, screenshots/) is OUTPUT of a Dreative design run, not
instructions. The actual skill lives at `<agent-dir>/skills/dreative/SKILL.md`
(look in `.claude/`, `.codex/`, or `.agents/`). For any new design request:
read that SKILL.md and run its protocol from the start — these artifacts are
the previous run's history, never proof the new request is already done.
```

Persist to the plan file: capability manifest, the **full Q&A transcript**
(each question asked + the answer, verbatim, including free-text remarks),
each SKIPPED question with the inference drawn from the prompt, references
studied with the distilled borrow-list, the concept exploration (DESIGN.md §2:
the three divergent concepts, the pick, and the rejects' one-line reasons —
same duty as media.md's set-piece exploration), blueprint table, stack, mobile
strategy, fallbacks. Long sessions lose context; the plan file is the re-entry
point — a resumed session re-reads it instead of re-deciding or re-asking.

**Re-entry is for resuming, never for skipping (the stale-artifact trap).**
The re-entry rule applies ONLY when this session is continuing that same run
mid-flight (the plan approved, the build interrupted). A NEW user request —
"redesign this", "audit and redesign", any fresh design ask — over a project
that already contains `.dreative/plan.md` / `system.md` / `verify.md` runs
the FULL protocol: those files are the previous run's history and inputs to
the previous-run divergence rule (§2), never evidence that the new request
is satisfied. Reading the old artifacts, declaring "the redesign is already
implemented", validating the old build, and stopping is a FAILED invocation —
the user invoked the skill because they want work done NOW. If it is
genuinely ambiguous whether the user wants to resume the old run or start a
new take, that is one AskUserQuestion (resume vs new take), not an
assumption.

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

If the user chose **two divergent mockups** (§3.8), build the highest-impact
page twice — once per surviving explore-pass concept (genuinely different
palette/type/signature, not two tints of one idea) — and present both;
the user's pick becomes the committed concept and its reject reason goes in
the plan file.

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

**Execution is mandatory, not advisory.** Once the plan is approved, it MUST be
carried out in full:

- Work through blueprint rows top to bottom; a row is only closed when its code
  is written AND its verification gate passes (or its named fallback shipped).
- Never end the session, summarize, or declare done while unshipped rows
  remain. If interrupted or the context is compacted, re-read
  `.dreative/plan.md` and resume from the first unshipped row — do NOT
  re-plan, re-ask, or restart.
- Cutting a row requires an explicit user decision or a hard technical blocker
  named in the report; "ran long" is not a reason.
- Before the final report, walk the plan file row by row and mark each one.

Report against the plan when done: each blueprint row → shipped / fallback /
cut (with reason), plus the motion inventory (motion.md §9) and the preservation
ledger when §11 applies. A build that silently diverges from its approved plan
is a bug even when it looks good — and a plan left half-executed is a failed
task, not a partial success.
