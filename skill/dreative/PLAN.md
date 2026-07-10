# Dreative Plan Mode — decide everything before the first line of code

This skill is for **drastic change** — a section, a page, or the whole site being
meaningfully redesigned or built. It is not for button tweaks or single-token
nudges unless the user explicitly invokes it for one.

**The plan gate (ask EVERY time).** At the start of ANY Mode A request in scope,
your FIRST action is one structured question: **"Plan it first, or build
directly?"** with "Plan first (Recommended)" as the leading option. Say plainly
why plan wins: you'll probe capabilities, agree on treatments/media/mockups up
front, and the result lands far closer to what they wanted on the first build.
"Build directly" skips to DESIGN.md + doctrine defaults. Never silently skip the
gate — even a request that looks simple gets asked; only skip when the user
already said "no plan / just do it" this session. When plan is accepted, run the
protocol below.

The failure this file prevents: jumping into code with half a brief, discovering
mid-build that media/tools/structure are missing, and shipping a page that is
60% of what the user actually wanted.

Plan Mode is ONE planning pass → ONE structured question round → a written plan
→ (optional) mockups for approval → execution in the plan's order. Never turn it
into a long interview; the user answers once and you build.

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
  brief with no video-gen), include an **offer to install** in the question round
  (§3): name the concrete option (an MCP server the user can add, or
  falling back to generated stills / pre-rendered loops from image sequences)
  and let the user decide. Never install tools silently; never silently degrade
  either — the user must know the fancy version was available.
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
  with the dial-appropriate ambition (motion.md §9 inventory is the target).
- **fallback** — for every ambitious cell (WebGL, sim, scrubbed sequence,
  generated video), the concrete boring version that ships if the fancy one
  fails runtime verification. A plan cell without a fallback is not ambitious,
  it's fragile.

Plus four page-level lines: register + design read (DESIGN.md §2), signature
element, animation stack (ONE system: GSAP+Lenis or motion/react — motion.md §0),
and the mobile strategy per ambitious effect (DESIGN.md §13).

## 3. The question round (one AskUserQuestion call, ≤4 questions)

Bundle EVERYTHING the user must decide into one structured round (multi-select
where choices stack). The pool below holds more than 4 questions — pick the
ones the request leaves genuinely open, most-decision-changing first; skip any
the request already answers. Structured tools always offer an "Other" free-text
option, so every question doubles as a remarks channel — and the round's last
question should explicitly invite extra direction.

1. **Depth** (redesigns of existing code only) — the §11 transformation-depth
   ladder: restyle / re-layout / restructure / reimagine.
2. **Treatments** (multi-select) — the specialist skills with one-line plain
   descriptions, obvious ones marked "(Recommended)":
   motion · interaction · 3d · immersive · cinematic · refined · media
   (generated images/video woven into the motion system) · ux (make every
   control, form, and state actually work — recommended by default) · mobile
   (first-class phone experience, calmer but equally crafted) · none.
3. **Media & asset types** (multi-select) — offer every asset class the probe
   found tools for, and let choices stack: `generated images` · `generated
   video loops` · `custom 3D` (real models/geometry, textures, and shaders
   built in code — top-tier 3D sites are made of custom 3D assets, not
   wallpaper images behind a canvas) · `real assets` (in repo / user supplies)
   · `placeholders only`. Mark the probe-backed recommendation "(Recommended)".
   **State the cost honestly: image/video generation is token-intensive** — say
   roughly how many assets the blueprint wants and that each costs real
   tokens/time, so "images only" or "placeholders" is a legitimate budget
   choice, not a downgrade. If a needed tool is missing, this is where the
   install offer goes ("I can add <X> MCP for video generation — ok?").
4. **Ambition tier** — safe (clean + light motion) / expressive (full motion.md
   dial 7-8 inventory) / award-site (dial 9-10, immersive/cinematic
   architecture). State the cost honestly: higher tiers mean heavier builds and
   a mandatory runtime verification pass.
5. **References** — "Do you have a reference — a website you love, a
   screenshot, a brand whose feel to chase?" Options like: paste a URL /
   attach screenshots / "surprise me — invent it from the brand" / match the
   existing brand. When a URL or image arrives, actually study it before
   designing (SKILL.md's references rule: fetch the site / read the image,
   distill what specifically to borrow — palette, type feel, layout family,
   motion cues — never guess a named site from memory).
6. **Vibe & audience** (when the brief is thin) — 3-4 contrasting directions
   as options, each a one-line register + palette + energy sketch ("quiet
   luxury: bone, near-black serif, almost no motion" vs "electric launch:
   drenched color, kinetic type"), plus who the page must convince (buyers /
   investors / recruiters / fans). This seeds DESIGN.md §2's design read.
7. **Scope & priorities** (multi-page or vague requests) — which pages/flows
   matter most, what's in this pass vs later, and any hard constraints
   (existing brand tokens to keep, CMS/content that must survive, deadline
   implying the safe tier).
8. **Mockups first?** — offer to build 1:1 mockups BEFORE the full build:
   "Mockup the key pages first (Recommended for big changes)" / "Straight to
   build". If yes, execute §4b before touching real code.
9. **Final remarks** — close the round with an open catch-all: "Anything else
   I should know or you'd love to see — specific effects, colors you hate,
   sections to add or kill?" Options: "no, go build" / "yes (write it in
   Other)". Everything written here lands verbatim in the plan file and is
   honored like the brief.

Cap at 4 per round: depth/treatments/media/mockups usually win; fold
ambition into treatments' recommendations when crowded, and vibe/scope into
the blueprint you present for approval. Never re-ask in later rounds;
ambiguity discovered mid-build resolves by the plan's spirit + doctrine
defaults.

### Calibration references (what the top tiers actually look like)

When the user picks award-site ambition or 3d/immersive/cinematic treatments,
these are the bar (fetch and study whichever is closest before designing):

- https://www.experiencethebestyou.com/en-GB/ — coordinated scroll choreography
  + heavy custom 3D/motion throughout.
- https://unseen.co/projects/contra/ and https://unseen.co/projects/letter/ —
  WebGL media planes, shader transitions, kinetic type.
- https://25residences.com/ — luxury real-estate register, cinematic pacing.

Common thread: their 3D is **custom models, textures, and shaders**, not
generated wallpapers behind text. If the environment has 3D-capable tooling and
the user opted in, build real 3D material (geometry, materials, lighting,
shader surfaces per `skills/3d.md`); reserve generated images/video for what
3D can't do. This tier only happens when the user explicitly chose it in the
question round — never impose it.

## 4. Write the plan, then execute it

Persist the approved plan to `.dreative/plan.md` (or the scratchpad if
`.dreative/` doesn't exist): capability manifest, every answer verbatim
(including references studied — with the distilled borrow-list — and all
free-text remarks), blueprint table, stack, mobile strategy, fallbacks. Long sessions lose context; the plan file is
the re-entry point — re-read it instead of re-deciding.

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
5. **Verification** — the full runtime protocol (SKILL.md self-critique +
   runtime gates). Any effect that fails gets its planned fallback, and the
   final report says so: "shipped the §2 fallback for X because Y".

Report against the plan when done: each blueprint row → shipped / fallback /
cut (with reason), plus the motion inventory (motion.md §9) and the preservation
ledger when §11 applies. A build that silently diverges from its approved plan
is a bug even when it looks good.
