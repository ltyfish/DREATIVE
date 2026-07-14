# Dreative Plan Mode — decide everything before the first line of code

This skill is for **drastic change** — a section, a page, or the whole site being
meaningfully redesigned or built. It is not for button tweaks or single-token
nudges unless the user explicitly invokes it for one.

**Plan Mode is MANDATORY.** Every Mode A request in scope runs this protocol —
do not ask "plan or build directly?", do not offer a skip, and do not silently
jump to code. “No plan,” “just do it,” “all decisions are up to you,” and
similar phrasing allow the agent to recommend a direction; they do not waive
concept and final-plan approval. Tiny isolated token, spacing, or component
fixes retain the lightweight exception.

The failure this file prevents: jumping into code with half a brief, discovering
mid-build that media/tools/structure are missing, and shipping a page that is
60% of what the user actually wanted.

Plan Mode is ONE planning pass → a short sequence of single questions (§3) → a
written plan → (optional) mockups for approval → execution in the plan's order.
Questions come one at a time so each is easy to answer, but the interview stays
short: only what the prompt genuinely leaves open, then build.

For from-scratch work, the minimum sequence is concept direction followed by
final plan approval. For redesigns, first render desktop/mobile and present the
agent's design-equity analysis for confirmation, then ask concept direction,
then final approval. Ask users to choose among concrete recommendations, not to
invent the design for you.

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
- Missing video, 3D, or separated source layers is not automatically a blocker.
  First plan the strongest honest treatment available from generated/sourced
  stills, local image processing, transparent cutouts, SVG, CSS, Canvas,
  generated keyframes, or existing project assets. Ask for a tool or source
  asset only when the requested result cannot be approximated convincingly;
  present the concrete best-effort fallback in that question. Never install a
  tool silently and never leave an "advanced animation later" placeholder.
- The probe result changes the blueprint: no video-gen → stills become layered
  scenes, masks, related keyframes, frame sequences, tiles/fragments, Canvas
  samples, or shader textures as the concept warrants; **no image-gen → media
  cells become `source-image` (DESIGN.md §7's priority: verified stock/CDN
  photography), every planned cutout prop becomes a sourced-and-matted photo
  or is cut, and any 3D of an organic real-world subject is re-planned as a
  photo billboard, a brand-native abstract instrument, or cut (3d.md §1–2 — coded
  organic geometry never becomes the fallback)**; no browser tools → the
  verification protocol's manual fallback (SKILL.md) must be declared up front.
  Missing tools change WHERE assets come from, never whether media/3D rules
  apply — sourced media carries the same treatment obligations (media.md §1–3).

## 2. The blueprint (section-by-section, media-first)

Draft the page as a compact table BEFORE asking anything — the decision phase
presents choices about a concrete plan, not abstractions. Per section:

| section | layout family | media + preparation | motion class/treatment | interaction | intensity | fallback |

- **media plan** — one of: `generate-image` (subject + exact aspect + palette/
  light-temperature prompt notes), `generate-video` (loop subject, 5-10s,
  seamless), `generate-sequence` (N frames for scroll scrub), `real-asset`
  (exists in repo / user must supply — name it), `none`. Media enters through
  the motion system per `skills/media.md` — name the treatment (curtain reveal,
  mask-shaped, hover-woken, media-plane distortion…), never "add an image".
  At dial ≥ 7 the proven default is one meaningful media set-piece and the
  blueprint names which section carries it. The outcome is a memorable moment
  where media itself becomes the visitor-controlled spectacle, not a specific
  catalog effect. A different solution uses a registered planning-time
  substitution with observable success criteria and evidence IDs.
  When a concept-led set-piece uses a depth dive, its
  `generate-image` cell must plan a DEPTH-CAPABLE composition (a corridor,
  room, landscape, machinery receding — something a camera can enter) and
  the companion assets in the same cell: the depth map and/or the separated
  foreground/background plates, generated in the same prompt world.
  The set-piece is chosen via
  media.md's exploration protocol: invent three brand-native candidates not
  sourced from recipes, record them + the pick in `conceptExploration`, then
  load recipe references only for feasibility/implementation/fallback and log
  them in `recipeAccess`. A media plan assembled from listed effects before
  original exploration is invalid. **Every media-plane / pixel-class cell
  names WHICH image asset the effect consumes as its texture/source** — a
  "shader plane" cell with no named image, or a plane carrying its own
  separate texture (steel/noise/gradient) layered over the section's
  photography, is an invalid cell (media.md §2's treatment-identity rule: the
  treatment must transform the image's own pixels, aligned to its rect —
  never a decorated rectangle floating over a static `<img>`).
  **Custom 3D in a media cell must name
  its asset source in the blueprint** — a GLB path, a generated/sourced
  texture (the actual prompt or file), or the billboard cutout it will ride
  on. "Custom 3D bean/bottle/plant geometry" with no named source is an
  invalid cell: primitives can't produce an organic subject (3d.md §1), so
  re-plan it as rung 2 (photo billboard) or an abstract SUPPORTING form
  (3d.md §2 — never a generic promoted signature object) at plan time —
  don't let the build stage discover this. The user picking "custom 3D" in
  the media question grants the *medium*, not an exemption from the ladder.
  Every 3D prop cell also names its BERTH (3d.md §3): which lane/stage of
  the section it occupies and what the layout does to make room — a prop
  planned "over the hero image" or with no berth is an invalid cell.
  At the `award` tier the outcome gate is one unmistakable spatial, media,
  typographic, or material signature that shapes the journey. If the concept
  calls for a recognizable physical subject, use a real GLB or photoreal cutout
  with a berth and source. Typography, layered photography, data, SVG/Canvas,
  or a scene instrument may be the stronger direct choice; no substitution is
  needed merely because 3D is absent. Generic orbs/blobs/toruses remain invalid.
  At expressive/award, the media column records whether each hero/key image
  stays flat or becomes motion-ready through cutouts, depth layers, masks,
  fragments, maps, alternate states, a frame sequence, or a Canvas/WebGL
  texture. Transform only where it strengthens the concept; a still may remain
  flat as an intentional rest. The default in `media.keyAssetTreatment` is a
  coherent asset-preparation decision, not a pixel-effect quota.
- **Travel map (mandatory when any element persists across sections).** If
  the blueprint contains a fixed canvas object, a recurring signature, or any
  scroll-morphing prop that lives through more than one section, add a travel
  map under the table: one line per section giving the object's position /
  scale / opacity there, each berth chosen against that section's layout so
  it never sits over text or controls (DESIGN.md §15). No berth fits ⇒ the
  object is scripted HIDDEN for that section. A persistent object without a
  travel map is an unplanned collision that verify will find later — plan it
  now. When the set-piece claims transformation, its pixels, layers, form, or
  role must visibly change; placement choreography alone does not qualify.
- **Diversity or development (dial ≥ 7 / expressive+).** Choose and record one
  path in `creativeStrategy`. Diversity uses only the mechanisms and drivers the
  concept needs, tied together by a shared language. Development evolves one
  coherent signature through materially different roles with quieter support.
  The same reveal repeated with different values is neither path. Do not add
  unrelated mechanisms to satisfy a count.
- **motion treatment** — from motion.md/immersive.md/cinematic.md vocabulary,
  with dial-appropriate ambition. At `expressive`/`award`, complete every
  `motionTreatment` field below and name the element/driver for each planned
  moment. A generic or incomplete treatment is reworked before presentation.
- **intensity (the pacing map)** — 1–10 per section: how loud this section is
  (motion + media + visual weight combined). The page must read as a CURVE, not
  a flat line: uniform intensity fails in both directions (all loud = exhausting,
  all quiet = the set-piece feels bolted on). Place deliberate rests around
  hero moments where the content permits so they land; supporting sections
  should not compete with them. A blueprint whose
  intensity column is all the same number is incomplete — rework the pacing
  before presenting.
- **fallback** — for every ambitious cell (WebGL, sim, scrubbed sequence,
  generated video), the concrete boring version that ships if the fancy one
  fails runtime verification. A plan cell without a fallback is not ambitious,
  it's fragile.

### Motion treatment and complexity budget

At expressive/award, write a coherent scene sequence before implementation. For
every major section record in `motionTreatment`:

- static composition and motion class (`none`, `decorative`, `structural`, or
  `transformational`);
- starting and ending visual states;
- what changes, persists, pins, enters, transforms, combines, fragments, or exits;
- the handoff into the next composition;
- narrative/emotional purpose;
- rendering mechanism;
- mobile translation and reduced-motion state.

Decorative motion introduces or responds. Structural motion controls hierarchy,
pacing, pinning, and composition. Transformational motion changes form or turns
one composition into the next. Opacity, translate, scale, and light parallax are
not sufficient evidence of structural or transformational motion.

Record `motionComplexityBudget`: normally two or three hero moments (one is valid
for a short page), calm sections around them, shared motion language, target-
device limits, and progressive enhancement. Spend complexity where the story
changes state; do not distribute medium-complexity effects evenly.

Choose the simplest mechanism capable of producing the intended transformation
convincingly. Simplicity means implementation suitability, not visual blandness.
Choose deliberately among CSS, Motion, GSAP/ScrollTrigger, SVG masks/filters,
`clip-path`, DOM fragments, Canvas 2D, WebGL/shaders, image sequences, video,
Lottie/vector animation, and 3D. Neither basic transforms nor WebGL/3D/pixels are
an unexamined default.

Before approving the plan, record `antiDefaultReview` answers: are images mostly
fading/scaling/sliding; are sections independent reveals; where is the major
composition handoff; how does motion change visual state; could this system fit
an unrelated site; what is memorable; and how does movement express the concept?
If the result is generic at expressive/award, revise the scene plan now.

Plus four page-level lines: register + design read (DESIGN.md §2), signature
element, animation stack (ONE system: GSAP+Lenis or motion/react — motion.md §2),
and the mobile strategy per ambitious effect (DESIGN.md §13).

**Signature-element plan gate.** The signature line is checked HERE, not
discovered at build time: if the signature is a visual OBJECT, it must be a
subject a stranger names correctly (3d.md §1–2's subject test). An abstract
crude coded organic form is a hard-gate failure. Generic spheres/orbs/rings/
blobs/toruses with no brand-native function remain invalid signatures. The
award work chooses the medium that makes the signature most legible and
concept-specific. A real GLB or rung-2 transparent photoreal cutout is preferred
when the signature is a recognizable physical subject; spatial typography,
layered photography, data structure, or an interactive instrument can be the
direct plan when the concept supports it. **Coded custom 3D is
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

## 3. The decision phase

Run one short decision phase containing several sequential single-question
calls. Use the environment's structured question tool when available; otherwise
ask in chat. Never dump the whole pool in one message: each answer can change
what comes next (for example, a cinematic treatment makes the media question
matter more, while restyle depth can remove the mockup question).

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
   Record it independently from ambition. For every page, write the current and
   proposed models/paradigms, material changes, surviving/rebuilt boundaries,
   preserved contracts, retained patterns with rationale, forbidden carryovers,
   and a depth-honesty assessment. Then write the page-level mobile blueprint
   (task, first viewport, exact order, thumb action, safe areas, navigation,
   desktop translations, media/motion/forms, 390px and 320px compositions, and
   why it is not desktop DOM stacking). Classify the page register before
   composing; transactional, account, admin, and utility pages do not inherit a
   marketing shell.
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
   - **cinematic** — "scene-based pacing, atmospheric transitions, living media, and intentional framing — bright, dark, playful, documentary, or editorial as the concept requires"
   - **refined** — "exceptional finish: precise spacing, typography, materials, and restraint, compatible with calm or expressive motion"
   - **media** — "AI-generated images/video made for this page and woven into the motion (hero film loop, images that come alive)"
   - **ux** — "everything actually works: menus, forms, cart, keyboard — pretty AND functional". This is always included; show it as locked/included rather than optional.
   - **mobile** — first-class phone experience: thumb-ergonomic layout and
     effects re-authored for touch, not merely scaled down. This is always
     included at baseline; mark it as an emphasized treatment only when mobile
     is the primary surface or the user explicitly asks for a mobile-first take.
   - **experimental** — user-facing phrasing: "explore unusual section ideas,
     then ship only the strongest coherent peaks rather than making every
     section compete". Internally this is the
     creative-mindset dial (`skills/experimental.md`): full
     scroll-reactive assets (images that disperse/reform/refract as you
     scroll, not just sit still with particles in front), textured/materialed
     3D instead of smooth plain geometry, camera/dimension shifts on
     scroll/interaction (zoom into a scene, rotate to a new view, transition
     between spatial "worlds"), willingness to try a genuinely unusual idea
     during exploration rather than accepting the safe default. Recommend
     this whenever the user's language points at "crazy", "bizarre", "wow",
     "never seen before", or award-tier + immersive/cinematic/3d stacked
     together — it's the difference between effects *placed on* the page and
     the page *behaving* like the reference sites when you interact with it.
   Plus "none — no optional treatments" (`ux` and `mobile` still apply). Skip only when the user already
   named the treatments or the request is trivially a restyle; read each
   chosen `skills/<name>.md` before designing.

   **For multi-page work, follow selection with one page-assignment matrix.**
   Rows are pages and columns are the user-selected optional treatments. Let the
   user pin any treatment to specific pages. For unpinned selections, propose a
   distribution based on page purpose and intensity, then ask for one approval
   of the complete matrix. User pins are authoritative; routing cannot move
   them or activate unselected optional skills. `ux` and baseline `mobile` apply
   to every page. Selecting all means every skill is used somewhere in the
   overall plan—not that every page receives every effect.

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
   3D`, `custom props`, or (later) the `award` tier, say plainly — in the
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
   - **Solid (`solid`)** — polished, complete, responsive, and light on custom
     effects. *Best for:* dashboards, apps,
     content-heavy sites, corporate audiences, tight deadlines. *Tradeoff:*
     looks professional, won't turn heads.
   - **Premium (`premium`)** — a strong design read, deliberate media, and one
     signature detail with restrained motion. *Best for:* business, commerce,
     and marketing work that should feel distinctive without becoming an
     experience site. *Tradeoff:* more craft and media work than solid.
   - **Expressive (`expressive`)** — coordinated composition, motion, and
     interaction with clear usability. *Best for:* product, commerce, and
     marketing sites that need visible authorship without becoming an
     experience site. *Tradeoff:* more choreography and testing than premium.
   - **Award (`award`)** — a distinctive spatial, media, typographic, or
     interactive system shapes the whole journey; 3D is optional. *Best for:*
     portfolios, launches, brand showcases, and agency work where exploration
     serves the message. *Tradeoff:* the most involved build and verification;
     unconventional behavior must remain understandable and performant.
   Higher tiers also mean a longer build and a mandatory runtime verification
   pass — state that cost too.
   **Which option gets "(Recommended)" is computed, and the default bias is
   UP:** when the brief carries no strong signal either way, recommend
   **expressive** — unnamed ambition becomes beige (DESIGN.md §2), and this
   skill exists for drastic change. Recommend **solid** only on concrete
   counter-signals: explicit "minimal / corporate / clean / subtle" language,
   a product/app/dashboard surface rather than a marketing page, or a hard
   deadline constraint (item 7). Recommending solid to a signal-free brief is
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
   implying the solid tier).
8. **Mockups first?** — offer three honest workflows:
   "Build after plan, with visual checkpoint" / "Mockup first" /
   "Two divergent mockups". **Which one is marked
   "(Recommended)" is NOT static — compute it from the depth + ambition
   answers already given:** reimagine or restructure depth, `award` ambition,
   OR a polished/exceptional existing baseline
   ambition, mean this is among the biggest changes the tool can make, so
   **"Mockup first" is the recommended option.** Recommend "Build after plan,
   with visual checkpoint" only when depth is restyle/re-layout AND ambition is solid/premium/
   expressive. Getting this backwards (recommending the checkpoint build on a
   reimagine + award combo) is a bug, not a stylistic choice. When depth
   is restructure/reimagine OR ambition is `award`, also offer a third
   option: **"Two divergent mockups"** — the two strongest concepts from the
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
   (e.g. references or mockups). “No, go build” closes remarks but does not
   replace the final plan-approval decision. If references was the last substantive
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

When the user picks the `award` tier or 3d/immersive/cinematic treatments,
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
  texture + HDRI environment — never crude organic coded geometry (3d.md §1) — and the
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
registers move on. At the `award` tier, when browser tools exist, spend ONE
fetch on a current source (Awwwards SOTD or godly.website) to confirm the
register you're chasing is still the frontier, and note in plan.md what you
saw. The stack LESSONS above outlive the sites themselves; the aesthetics
don't.

Common thread: their 3D is **custom models, textures, and shaders**, not
generated wallpapers behind text. If the environment has 3D-capable tooling and
the user opted in, build real 3D material (geometry, materials, lighting,
shader surfaces per `skills/3d.md`); reserve generated images/video for what
3D can't do. This tier only happens when the user explicitly chose it in the
decision phase — never impose it.

## 4. Write the plan, then execute it

Persist the approved plan first to `.dreative/plan.json` using
`references/ARTIFACTS.md` and `schemas/plan.schema.json`; this is the delivery
contract consumed by `dreative audit`. Render the same decisions as a readable
`.dreative/plan.md` for the user and session re-entry. Keep section and asset
statuses synchronized in JSON as the build progresses. Set `version: 4` and
`doctrineVersion: 4`,
record `implementationStartedAt` immediately before code changes, and ensure all
rule exceptions predate it and final approval predates it. For substantial work,
persist the typed approval, scope/project kind, compact execution brief, and
common-pattern review. Redesigns reference `design-equity.json`; restructure and
reimagine also reference `checkpoint.json` and include creative parity plus
section visual blueprints. **The first time this run writes into
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
 new take, ask one structured question when available (resume vs new take), not an
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

If the user chose **Two divergent mockups** (§3.8), build the highest-impact
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
   blueprint's aspect ratios, graded to the palette (media.md §4). Sections get
   designed around real assets, not around placeholders that "will be swapped".
2. **Foundation.** Install and wire the animation stack (motion.md §2 and the
   motion recipe reference), fonts,
   tokens, providers — before any section code.
3. **Sections** in blueprint order, each honoring its row (skills tagged per
   section apply to that section).
4. **Effects + choreography** across sections (page-level timelines, transitions,
   the signature element).
5. **Verification** — the full runtime protocol (SKILL.md §V: runtime gates +
   self-critique, mobile first, evidence written to `.dreative/verify.json` and
   summarized in `.dreative/verify.md`).
   Any effect that fails gets its planned fallback, and the final report says
   so: "shipped the §2 fallback for X because Y".

**Execution is mandatory, not advisory.** Once the plan is approved, it MUST be
carried out in full:

- Work through blueprint rows top to bottom; a row is only closed when its code
  is written AND its verification gate passes (or its named fallback shipped).
- Never end the session, summarize, or declare done while unshipped rows
  remain. If interrupted or the context is compacted, re-read
  `.dreative/plan.json` (using `plan.md` for narrative context) and resume from
  the first unshipped row — do NOT
  re-plan, re-ask, or restart.
- Cutting a row requires an explicit user decision or a hard technical blocker
  named in the report; "ran long" is not a reason.
- Before the final report, walk `plan.json` row by row, mark each one, and run
  `dreative audit`.

Report against the plan when done: each blueprint row → shipped / fallback /
cut (with reason), plus the motion inventory (motion.md §5) and the preservation
ledger when §11 applies. A build that silently diverges from its approved plan
is a bug even when it looks good — and a plan left half-executed is a failed
task, not a partial success.
