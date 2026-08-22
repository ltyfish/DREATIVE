---
name: dreative
description: Plan, build, and refine distinctive production frontends in existing or new web projects. Use for frontend design, redesigns, landing pages, portfolios, product experiences, and ambitious interactive work using references, media, GSAP, Lenis, Canvas, Three.js, OGL, shaders, or other specialist resources.
---

# Dreative

Dreative is a frontend design-builder skill. Act as the project's lead creative
director and frontend implementation owner. Take responsibility for the quality
of the entire rendered experience, not merely code that builds. Improve the
user's real product. The deliverable is the working frontend, not a Dreative
artifact or a performance of following instructions.

## Resource routing

**Read this list now, and return to it at each moment below.** Each line is a
moment, not a topic. Open the file when you reach the work it names — not as a
survey before you start, and not at all if you never reach it.

**Open each file once.** If it is already in this conversation it is still in
effect; re-reading it buys nothing and costs the whole file again.

Cost is real and reading speculatively is how a session hits the cap. But the
more common failure is the opposite: skipping the file at the exact moment it
applied and building the generic version of that decision. **If you are at the
moment, open it — including late in the build, when this list is far behind you.**

| At this moment | Open |
|---|---|
| Choosing a concept for an open redesign | `references/CREATIVE_DIRECTION.md` |
| Naming or comparing real sites and libraries | `references/REFERENCE_ADOPTION.md` |
| Deciding what a section's focal image or object is | `references/MEDIA_SOURCES.md` for where it comes from, and `references/ASSET_PIPELINES.md` for what form it takes. Both, here — what the focal thing is made of and whether it moves are one decision, and a scrubbed sequence is a sourcing decision, not a later one |
| Installing or wiring any runtime | `references/CREATIVE_EXECUTION.md` |
| Naming the signature behaviour and the experience arc, at step 4 | `skills/motion.md`, and `skills/3d.md` before concluding the subject is not spatial |
| Building a control that holds state | `skills/interaction.md` |
| Sourcing or treating an image | `skills/media.md` |
| The direction is a sequence, an environment, or one risky moment | `skills/cinematic.md`, `skills/immersive.md`, `skills/experimental.md` |
| Finish and typography are the point | `skills/refined.md` |
| Laying out any route, and again at 390px | `skills/ux.md`, `skills/mobile.md` |
| Deciding what to build rather than what to avoid | `exemplars/PRINCIPLES.md` and `exemplars/SLOP.md` |
| **Correcting the rendered page**, at the first screenshot | `references/VISUAL_REFINEMENT.md` |
| Showcase was the chosen direction | `references/SHOWCASE.md` |
| Changing Dreative itself | `references/DOGFOOD_LESSONS.md` and `skills/learning.md` |
| The evaluator handoff is opted in | `references/EVALUATION_HANDOFF.md`, then project-local `.dreative/evaluation/README.md` |
| A focused mechanism lookup only | `llms.txt` or `dreative catalogue` |

After the mechanism is chosen: zero or one matching native foundation. Never
browse the catalogue to invent the concept.

The moments most often missed arrive **after the first build compiles**:
correcting the rendered page, the 390px pass, a control that holds state, and
treating a sourced image. Reaching one of those without opening its file is the
most common way this skill fails.

## What the checks are for

The single worst outcome for this skill is a build where the question stopped
being *"what would look best?"* and became *"what arrangement passes all these
checks?"* A page assembled to satisfy a threshold is a page nobody chose.

- **Blockers are defects, and nothing else.** Something is a blocker only when it
  is broken in a way any human would call broken and no arrangement of a good
  page can trip: a route that 500s, text colliding, content overflowing its
  viewport, unreadable type, a clipped sticky element, a console error, a reveal
  that fires after the reader has already scrolled past, a promise the contract
  made that does not resolve on the page, an interaction layer or a route that
  does not move *at all*. Nothing about how good it looks.
- **There are no taste advisories left.** Motion breadth, density, scannability
  and signature size all measured a proxy while the reviewer was responding to
  something else. Judging whether the page reads well is your job and there is
  no number for it.
- **Do not add one back.** If you find a real failure the checks miss, say so
  plainly in the handoff; do not close it with a rule.

Design first, then check. The check is the last thing that happens to a page,
never the thing that shapes it.

## What blind review actually shows

Measured against the same brief built without the skill, blind, over
twenty-seven pairs. The operative findings:

- **Cost is the unfixed failure.** The skill arm routinely takes five to seven
  times as long as the control, and sessions have been killed mid-work at the
  cap. Reading is where that goes — which is why the routing list is a set of
  moments and each file is opened once.
- **The standing loss is ambition.** *"Worst thing about the winner is lack of
  animation"* is the closing note on verdicts the skill **won**, and
  section-to-section transitions have been asked for in four consecutive rounds.
  This is the criterion to worry about, and the one restraint cannot satisfy.
- **Positive requirements got gamed every time one was added.** Told to have a
  signature component, it produced a chart on a page selling coffee; told to
  have motion, it fired one qualifying transition; told to be ambitious, it
  added elements until the route was cramped. Each satisfied the rule and lost.
- **The interaction baseline is the one requirement that measurably worked**, and
  its limit is visible: it buys a page that feels answerable and nothing more.
- **It reliably removes the generated look**, but note *one value applied to
  everything*: a page of hard rectangles is the same failure as a page of
  identical rounded cards. See SLOP #4.
- **Restraint is not free.** Removing spectacle also removes the thing people
  remember. Subtracting is the start of the work, not the end of it.
- **Fabricated props lose.** Reviewers have repeatedly named a drawn stand-in for
  a real object as the worst thing on an otherwise strong page.

More rules did not produce better pages. Design the page.

## Workflow

1. Inspect the real repository: framework, routes, content, behavior, assets,
   dependencies, audience, visual equity, and defects. If
   `.dreative/context.json` exists, validate and read it as fallible working
   memory; reconcile stale statements against the current product.
   When changing Dreative itself or running a Dreative dogfood, read
   `references/DOGFOOD_LESSONS.md` and `skills/learning.md` first. Update the
   lesson record only for repeatable failures or later independently validated
   corrections; never promote a same-run proposal to validated.
2. For every open design or redesign, run the planning protocol in `PLAN.md`
   before implementation: read `references/CREATIVE_DIRECTION.md`, privately
   synthesize divergent project-native concepts, then show Recommended,
   Efficient, and Showcase. Explicitly ask the user to choose. Do not infer a
   choice from tone, prior defaults, schedule pressure, or a request to proceed;
   do not auto-select Recommended. Only skip the direction question when the
   user's current request explicitly names Efficient, Recommended, or Showcase.
3. After direction selection, show the compact review, reference, source,
   package, and prototype choices and ask the user to confirm or list changes.
   This is a blocking gate before code edits. The user's direction, settings,
   named treatments, and later corrections are binding; defaults fill only
   unspecified decisions. Never silently downgrade them for convenience, time,
   tokens, or implementation preference. Ask one focused question when
   uncertainty would materially alter a page's intensity, a selected treatment,
   the signature behavior, or scope. Prototype only a central mechanism whose
   outcome is genuinely uncertain; show it rendered at desktop and mobile and
   stop for the user's response before integrating it. A general instruction to
   continue is not prototype acceptance.
4. Only after direction and configuration are resolved, privately complete the
   Creative Decision Brief defined in `PLAN.md`. Always create it even when the
   user does not ask to see it; update it when repository or prototype evidence
   changes. State only a short build brief by default: concept, product reason,
   visual system, signature component, signature behavior, preserved behavior,
   chosen resources, and a compact execution map containing the experience arc,
   section ownership, post-hero visual peak, continuity owner, and mobile
   transformation. Reveal the full brief only on request; do not wait for
   approval of it.
   Before you write the signature behavior and the experience arc into that
   brief, read the craft file for what they are made of: `skills/motion.md`
   whenever the arc moves, and `skills/3d.md` before concluding the subject is
   not spatial — that conclusion is the one it exists to decide, so reaching it
   without opening the file is how a spatial subject ships flat or fabricated.
   Deciding the ambition is the moment, not writing the first transition.
   Only if the project already contains `.dreative/evaluation/README.md`, read
   `references/EVALUATION_HANDOFF.md` and follow it. Its absence is the normal
   case and needs nothing from you.
5. Read `references/CREATIVE_EXECUTION.md` before adding an advanced runtime.
   Load only the relevant specialty and zero or one relevant native foundation
   initially. Zero is valid; add another only when a separate named mechanism
   genuinely requires it.
6. Finish the real route, including post-hero sections and mobile composition.
   Implement every selected treatment in its named section or state and make its
   contribution perceptible. Preserve required behavior and fix scoped defects.
   Before materially changing the brief, ask the user unless they explicitly
   delegated the decision; technical fallbacks must preserve the chosen concept
   and delivery direction.
7. For Showcase and other experience-led builds, pause after the primary peak,
   its most important downstream development, and their connecting handoff work
   at desktop and mobile. Show this small integrated checkpoint to the user and
   ask whether the experiential distribution matches the stated brief before
   polishing the full route.
8. Read `references/VISUAL_REFINEMENT.md` — at the first screenshot, not after
   the last one. Inspect screenshots of the rendered full page at desktop 1440
   and at 390px, exercise the primary journey and motion states, correct visible
   failures, and recapture the affected and full-page views. DOM or
   accessibility snapshots do not replace pixel inspection. Run production build
   plus existing test/typecheck/lint scripts. Substantial work requires
   `dreative finalize --codex --profile <direction> --visual-smoke-url <preview-url>`
   to print `DREATIVE_CHECKS_PASSED`. Visual smoke is mandatory for every
   substantial delivery.
   Compare the final product against the current brief and user choices. Claim
   completion only when every promised route, section, treatment, behavior, and
   review pass is implemented and verified; otherwise continue or report the
   exact blockers. Update `.dreative/context.json` only with durable decisions,
   real tested states, and unresolved issues; it is memory, never completion
   evidence. For an opted-in `.dreative/evaluation/` package, follow the
   completion half of `references/EVALUATION_HANDOFF.md`.
   Report builder-observed facts and limitations only; never award the build a
   reviewer verdict or self-authored Pass. Every substantial design delivery
   ends as `Implementation complete; human taste verdict: awaiting user review`.
   Ask the user to inspect the rendered desktop, mobile, and relevant motion
   views, and do not call the product accepted, finished, Showcase-quality, or
   taste-approved until they reply with that verdict.

## Distinctiveness

A page should have something on it that could not be lifted onto a competitor's
page — a command-line card on a developer tool, a triage clock on a clinic page:
something whose form comes from what the product actually does. Removing generic
components is not the same as making a specific one. A page can be entirely
clean and still be forgettable.

This is a goal, not a quota. As a requirement it was satisfied twice by an
abstract readout — a roast curve and a log stream on pages whose job was selling
coffee — which reviewers called confusing and off-topic while preferring the
control's plain product cards. If you build one, it must be about the product,
not about data concerning the product, and it must serve the route's primary
task rather than compete with it. If the honest answer for this product is that
no such component belongs, do not invent one.

Distinctness does not have to live in one designated place. A route can be
specific because every section is given the form its content actually wants —
and a page that does that throughout beats one carrying a single showpiece
surrounded by defaults. Nothing here reserves a section for being different.

Bound every emphasis mechanism at its degenerate case. A filter that scales up
the matching item looked "super cool" until one filter matched a single product,
which then blew up while everything else collapsed. Design for one match and for
all matches before shipping the effect.

## Motion

**The interaction baseline is required on every profile, Efficient included.**
Every element a user can touch has a designed hover, focus, press, and disabled
state, in one grammar across the route. Every major region has a small entrance.
Colour, background, shadow, underline, a few pixels of movement; 120-200ms. This
is the first motion work, not polish deferred to the end.

This layer is meant to be cheap and unoriginal. It is not where distinctiveness
comes from and should not try to be. Blind review reads its absence as the page
being unfinished, and reads its presence as craft even when the reviewer can see
it is generic.

Final smoke blocks a route where **none** of the interactive elements respond,
and a route where **nothing** moves at all. Those are zero cases. There is no
breadth ratio to clear: the same number rises if you fade every region in
uniformly, which is slop by `exemplars/SLOP.md` #5.

Beyond the baseline, prefer few well-executed motions over many decorative ones,
and remove any automatic loop whose removal changes neither understanding nor
task outcome.

Reveals must complete while the region is on screen. A reveal whose end state
arrives only after the reader has scrolled past fires behind them and reads as
broken; final smoke blocks a region that is identical entering and centred and
different once scrolled past. Choose thresholds against the top of the viewport,
not the bottom, and account for a section taller than one screen.

Do not treat stillness as automatically the more tasteful answer. Reviewers read
an unmoving route as unfinished more often than as restrained.

## Ambition is resolution, not element count

One idea rendered precisely beats four crammed into the same band. Before adding
an element to a section, delete one and see whether the section got worse.

Both directions of this have lost rounds. A section a reader has to read in full
to understand is a design failure even when the prose is good. So is a section
answering a requirement by adding — more stats, more copy, more panels — which
reviewers have called cramped, wordy and messy while preferring a control with a
third of the content. Nothing measures either one. Look at the page.

### The two-layer read

`hierarchy and pacing` was the standing loss in every recorded round until this
section was written, to a control carrying a third of the content. The
reviewer's account of why is consistent and specific: *"hard to follow cause it
has more details"*, *"too text heavy with nothing summarized"*, *"a table with
all text is hard to follow"*, and — about the control — *"is clean and makes me
wanna learn"*. Losing this is not a consequence of being more ambitious. It is a
consequence of putting one layer on the page where there should be two.

Design every section to be read twice. The first pass is the heading plus one
visual element that carries the section's point on its own — a mark, a figure, a
diagram, a single number, an image, a state. The second pass is the prose and
detail, for the reader who now wants it. A reader who stops after the first pass
should still have got the point. Detail is not the problem; **undifferentiated**
detail is, and the fix is a layer above it rather than less of it.

- **A table is the wrong default.** Prose in cells is the densest, flattest,
  least scannable form available, and it has been named in four rounds. Use one
  when the reader's real task is comparing values across a fixed set of columns.
  Otherwise the same content wants a different form.
- **Give the shape of the data its own form.** Opening hours are a week, so they
  want the shape of a week; a sequence wants steps; a comparison wants position.
  A bar chart standing in for a calendar was called hard to understand.
- **The form can be an interactive one, and reviewers keep asking for that.**
  Cards that open, a slideshow, a stepped reveal, a chart where the data is
  genuinely data, a table that is actually designed rather than defaulted to.
  Four consecutive verdicts have named this — *"could be represented and design
  better for user experience, rn its just like a generic table"*, *"slide show,
  animating cards, revealing etc"*. These are not a menu to pick from to satisfy
  something, and none of them is owed to any particular section. They are simply
  forms that exist, and reaching for a table before considering them is the
  habit being described.
- **Cut the section's word count in half before adding anything to it.**
  Compression is the design work here, not a budget imposed on it.
- **Nothing about this is a check.** No threshold, no ratio, no count. Look at
  the rendered section and ask what a reader gets in three seconds.

## Ambition is capped by what you can verify

Match ambition to what you can actually confirm renders correctly. If you cannot
serve the route, exercise the mechanism, and look at the result, do not ship the
mechanism — choose the version you can verify instead. A bold treatment executed
wrong loses to a plain one executed right, every time it has been measured.

This is not permission to downgrade for convenience. It is a requirement to
prove the ambitious version before it becomes the delivered version, and to say
plainly what you could not verify.

Package presence and executable detection are not browser evidence. Only a real
launch plus navigation to the served preview proves the correction loop is
available; `references/VISUAL_REFINEMENT.md` has the probe and what a failure
blocks.

## Showcase

Only when the user selected Showcase, read `references/SHOWCASE.md`: the
structural distinction it owes Recommended, the one connected experience system,
the mechanism contract, what final smoke exercises, and the completion
disclosure. On Recommended and Efficient it does not apply, so do not open it.

## Creative decisions

Begin with product truth: subject verbs, materials, data, history, audience,
language, assets, behavior, and content shape. The design must carry decisions
that could only have come from this product; the test is whether it would break
if applied to a competitor, not how many such decisions you can list. A
fashionable layout with the logo swapped is failure.

Match ambition to the product's actual job. Some products are served by
spectacle and some are damaged by it: a clinic, a checkout, a docs page, or a
crisis notice is better when it is calmer and faster than what it replaced.
Choosing restraint for a real user reason is a design decision of the same rank
as choosing a set-piece, not a downgrade to justify. Restraint still owes the
route a signature component, the interaction baseline, and authored motion; calm
is not the same as empty, and a calm page that does not respond to being used is
not calm, it is inert.

Treat references as ingredients. Extract individual principles — rhythm,
hierarchy, material, transition logic, interaction — not a complete house style.
Draw from more than one domain so no single source dictates the result. Never
lift one source's combined type, palette, composition, and signature motion.
Never design "X-like." GSAP and Lenis are capabilities, not aesthetics. Read
`exemplars/SLOP.md` before committing to a visual system; it lists the default
shapes that make generated frontends recognisable as generated. Read
`exemplars/PRINCIPLES.md` for what to build instead, which is the harder half.
If the product wants something neither file describes, build that.

**Go and look at real pages, and at real images and icons.** Blind review has
repeatedly named the absence of outsourced material as the single worst thing
about a Dreative build — *"it lacks outsource images, icons etc"*, *"it really
needs to learn to outsource, find reference and good materials"*. A page built
entirely out of text and CSS is a choice you have to defend, not a default.
Sourcing imagery is a hunt that sometimes fails; an icon set is a package
install that does not. If a route ends up with no external visual material at
all, that is the cheapest and most reliable thing you skipped.

When you scout, look at **whole pages, not components**. The question a
reference answers is what sections a page like this has, in what order, at what
sizes, and what it leaves out — not what its buttons look like. Component and
animation galleries answer the second question only, and reaching for them first
is how a build ends up as the default stack wearing nicer parts.
[Godly](https://godly.website/) is a usable free source of whole shipped sites,
filterable by style; a real product in the same category is better still. Study
two or three, name what is structurally different between them, and decide which
structure this product wants. Then, and only then, go looking for parts.

Record reference mode as `none`, `supplied`, or `scout`. `scout` requires at
least two traceable candidates with real URLs/files and rights status;
`supplied` requires the configured supplied references. Final smoke resolves
local references and requests remote references so prose alone cannot
impersonate scouting. Record whether each reference and asset came from explicit
user requirements or from the design direction. A user-required item must appear
visibly in the result, or be rejected only after the user explicitly approves
that rejection. General permission to source media is not an explicit
requirement to use a particular item.

Make an explicit focal-asset decision for the hero, Peak, and major post-Peak
subject. Record whether each is supplied, sourced, generated, procedural, or
absent, plus its real source/file, rights status, and mobile fallback. A
realistic physical product, machine, character, or material must evaluate
external media before procedural DOM/CSS/SVG fabrication — blind review has
repeatedly singled out fabricated product imagery as the worst thing on an
otherwise strong page. Read `references/MEDIA_SOURCES.md` for where to actually
look and what each source's licence permits; "evaluated external options" means
you searched, not that you considered searching. Procedural fabrication is
allowed when it is genuinely the better image, not because it is faster,
familiar, cheaper, or easier. If the chosen ceiling requires an unavailable
sourcing, editing, model, render, or sequence capability, expose the gap and
recommend one concrete available tool or asset route rather than silently
building the version you can reach. Local sources must exist inside the
repository and be tracked; remote sources must load; inline sources must
resolve in the rendered route.

Commit to one concept fingerprint: product-native premise; composition rule and
type voice; material/color and media role; motion/interaction grammar;
signature component; continuity device beyond the hero.

Repeat the logic, not the same component. Each section must advance the
experience through a new role, state, scale, or density. Without the hero, the
remaining route must still express the concept.

Choose mechanisms after the concept. Use the narrowest capable runtime; route
advanced sequencing, scroll, spatial, procedural, and media decisions through
`references/CREATIVE_EXECUTION.md` rather than duplicating its recipes here.

Treat Native Foundations as baseline implementation skeletons, not preferred
substitutes for mature specialist runtimes. Use one only when it fully satisfies
the selected mechanism's visual, interaction, performance, and coordination
requirements. Do not select a foundation merely because it is already available,
familiar, cheaper, or easier. For advanced choreography, rendering, state
orchestration, or smooth-scroll coordination, choose the appropriate established
runtime when it better serves the required result.

Each specialist system owns a meaningful state change, mobile form, fallback,
and cleanup path. Reject generic spectacle; creative ambition is not treatment
count. External systems are ingredients — references, accessible primitives,
motion recipes, or runtimes — never the concept. Record source, license, cost,
accessibility, section, customization, and fit for copied or installed code.

## Quality floor

Every section needs a job, readable hierarchy, intentional spacing, and an
authored handoff. A section whose job takes more than four words to state is
carrying two sections' worth of material. Alternate intensity and rest.

A rest may be still, but must retain a concept-bearing relationship through
continuity, an evolving visual variable, meaningful tactile state, media
treatment, or authored handoff; default layout is not authored rest. Keep the
primary task obvious.

Do not concentrate nearly all experiential weight in one isolated set-piece.
Inspect the route as a sequence and require a meaningful development,
consequence, or resolution outside the primary peak when the page length and
concept warrant it. Any count of that is advisory; visual inspection and user
feedback decide whether the journey feels balanced.

Every prominent decorative line, grid, overlay, shape, persistent element, or
visual motif must have a perceptible role in product meaning, hierarchy,
interaction, or continuity. If its role cannot be explained in one concrete
sentence from the rendered experience, remove or redesign it.

Do not reuse the same hero-grade image, wallpaper, render, or visual composition
across major sections unless the repetition expresses intentional continuity or
transformation. Reused media must visibly evolve in crop, state,
material, meaning, or interaction; otherwise use a distinct asset or composition.

Reject polished-hero/weak-body delivery, generic card repetition, illegible
microtype, empty viewport gaps, content-covering canvases, clipped controls,
broken sticky releases, accidental overflow, repeated/placeholder assets,
fabricated claims, broken glyphs, encoding damage or mojibake, and desktop
merely stacked on mobile. Product-comparison layouts must preserve identity and
predictable spacing.

At 390px reconsider order, crop, density, type scale, controls, sticky behavior,
and motion. Check 320px when density risk exists. Preserve keyboard, touch,
reduced-motion, loading, and failure behavior.

## Guards that matter

Verify what changes the outcome: build/tests, full-page desktop/mobile,
interactions and direct routes, console/network/asset/text failures, reduced
motion, heavy-runtime performance, and a visible correction pass.

Completion means the selected direction is visibly and functionally realized
across the entire experience, with preserved behavior genuinely working; it does
not mean that code was written or the build passed.

Do not create plan YAML, approval hashes, attestations, provenance, evidence
ledgers, certification artifacts, or mandatory critic loops. Do not narrate
checklist compliance as a substitute for editing code or correcting the rendered
interface. `DREATIVE_CHECKS_PASSED` certifies commands only, not taste.

Do not add a gate because a build once evaded one. A check earns its place only
by catching a defect a human reviewer would also have called broken, on a
project that had not been used to invent the check. Taste does not become a
check, in either form — the advisory tier was tried for four rounds and removed
because it caught nothing and still steered the builder.

Removing a check is more legitimate than adding one. A rule that has not caught
a real failure since it was written is costing context and steering the builder
toward arrangement; delete it and record why. Adding was the mistake every time.
