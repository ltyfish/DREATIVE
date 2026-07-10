# Dreative Plan Mode — decide everything before the first line of code

Run this protocol at the start of ANY non-trivial Mode A request (new page/site,
redesign at rung 2+, any request implying motion/3d/immersive/cinematic/media, or
"make it amazing/like <reference>"). Skip it only for trivial single-element
restyles and rung-1 token refreshes — and even then run §1's capability probe
once per session. The failure this file prevents: jumping into code with half a
brief, discovering mid-build that media/tools/structure are missing, and shipping
a page that is 60% of what the user actually wanted.

Plan Mode is ONE planning pass → ONE structured question round → a written plan
→ execution in the plan's order. Never turn it into a long interview; the user
answers once and you build.

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
3. **Generated media** — the concrete offer from your probe: e.g. "Generate a
   hero video loop + 4 section images (Recommended)" / "Images only" /
   "Placeholders, I'll supply assets". If a needed tool is missing, this is
   where the install offer goes ("I can add <X> MCP for video generation — ok?").
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
8. **Final remarks** — close the round with an open catch-all: "Anything else
   I should know or you'd love to see — specific effects, colors you hate,
   sections to add or kill?" Options: "no, go build" / "yes (write it in
   Other)". Everything written here lands verbatim in the plan file and is
   honored like the brief.

Cap at 4 per round: depth/treatments/media/references usually win; fold
ambition into treatments' recommendations when crowded, and vibe/scope into
the blueprint you present for approval. Never re-ask in later rounds;
ambiguity discovered mid-build resolves by the plan's spirit + doctrine
defaults.

## 4. Write the plan, then execute it

Persist the approved plan to `.dreative/plan.md` (or the scratchpad if
`.dreative/` doesn't exist): capability manifest, every answer verbatim
(including references studied — with the distilled borrow-list — and all
free-text remarks), blueprint table, stack, mobile strategy, fallbacks. Long sessions lose context; the plan file is
the re-entry point — re-read it instead of re-deciding.

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
