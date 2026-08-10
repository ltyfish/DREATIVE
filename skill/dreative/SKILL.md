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

## What blind review actually shows

Dreative has been measured against an identical brief built without it. Read
this before you build, because it says where the skill helps and where it has
been losing:

- It reliably removes the generated look — the repeated rounded cards, the
  stock gradient, the same five sections every product gets.
- It has lost, repeatedly, on three things: **too little motion**, **no single
  component that could only belong to this product**, and **prose and tables
  where the reader needed something scannable**.
- Restraint is not free. Removing spectacle also removes the thing people
  remember. Subtracting is the start of the work, not the end of it.

Design against those three, not just against slop.

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
   package, and prototype choices and ask the user to confirm the recommended
   settings or list changes. This is a blocking gate before code edits. Treat
   the user's direction, settings, named treatments, and later corrections as
   binding; direction defaults fill only unspecified decisions. Never silently
   downgrade them for convenience, time, tokens, or implementation preference.
   Ask one focused question when uncertainty would materially alter a page's
   intensity, a selected treatment, the signature behavior, or scope.
   Prototype only a central mechanism whose outcome is genuinely uncertain and
   could change the build. When you do prototype, show it rendered at desktop
   and mobile and stop for the user's response before integrating it. A general
   instruction to continue is not prototype acceptance. If a prototype turns
   out to be cheaper as a real route, build the real route.
4. After configuration, present a compact, project-specific **Experience Map**
   before editing code. Show every major page or section with Dreative's
   recommended role, craft intensity from 1–5, simple journey rhythm
   (`Rest`, `Build`, `Peak`, or `Release`), user agency (`Watch`, `Influence`,
   or `Control`), and connection to the surrounding journey. Intensity is the
   section's quality and transformation ambition, not an instruction to keep it
   moving. A user may choose 5 for every section while Dreative preserves a
   clear Peak through the rhythm field. Lead with
   `Use Dreative's recommended approach`; let the user change a row with
   `more animated`, `calmer`, `change layout`, `change interaction`,
   `keep static`, or a plain-language instruction. Add one to three targeted
   recommendations about where more motion would strengthen the journey and
   where it would create competition. Ask the user to confirm the recommended
   map or list changes. This is the concrete design proposal, not another set of
   abstract global dials.
5. Compile the accepted map into the obligations defined by
   `schemas/experience-map.schema.json`: section role, input state, visible
   start and end states, mechanism owner, connection, desktop behavior, mobile
   behavior, reduced-motion behavior, and evidence target. Rows assigned
   meaningful Influence/Control agency or an explicit transformation additionally
   name a real selector, trigger, owned properties, and meaningful outcome so
   rendered verification can exercise the promise. Intensity 5 may instead be
   exceptional composition, imagery, typography, pacing, or material craft; it
   does not itself require interaction. A route normally has one clear Peak,
   because two competing peaks usually means neither lands; depart from that
   when the content genuinely has two arcs, and say why — the map accepts it and
   raises an advisory rather than refusing. The schema makes promises traceable;
   it is not an approval artifact and does not prove taste. Let architecture fit
   the promised complexity; do not impose a generic scene registry, timeline
   controller, or folder structure.
6. Only after the user has explicitly resolved direction, configuration, and
   Experience Map, privately complete the full project-specific Creative
   Decision Brief defined in `PLAN.md`. Always create and use this working
   blueprint even when the user does not ask to see it; update it when
   repository or prototype evidence changes. State only a short build brief by
   default: concept, product reason, visual system, signature component,
   signature behavior, preserved behavior, chosen resources, and a compact
   execution map containing the experience arc, section ownership, post-hero
   visual peak, continuity owner, and mobile transformation. Reveal the full
   brief only on request. Do not wait for its reveal or approval; proceed to
   build.
   If the project already contains `.dreative/evaluation/README.md`, treat that
   as an explicit opt-in review contract: read it and update its designated
   current-run decision record with the prompt, selected direction, concise
   rationale, implementation promise, and later material decision changes.
   Identify the exact current branch and commit (or explicitly say `uncommitted`
   until one exists), and update them after the final commit. Treat only files
   designated by that README as evaluator input. Legacy `.dreative` critic,
   verify, certification, trace, or evidence files are not current evidence;
   remove stale untracked copies before handoff so they cannot be mistaken for
   the submitted build.
   Record inspectable conclusions, never hidden chain-of-thought, private
   exploration, raw transcripts, or discarded scratch work.
7. Read `references/CREATIVE_EXECUTION.md` before adding an advanced runtime.
   Load only the relevant specialty and zero or one relevant native foundation
   initially. Zero is valid; add another only when a separate named mechanism
   genuinely requires it.
8. Finish the real route, including post-hero sections and mobile composition.
   Implement every selected treatment in its named section or state and make
   its contribution perceptible. Preserve required behavior and fix scoped
   defects. Before materially changing the brief, ask the user unless they
   explicitly delegated the decision; technical fallbacks must preserve the
   chosen concept and delivery direction.
9. For Showcase and other experience-led builds, pause after the primary peak,
   its most important downstream development, and their connecting handoff work
   at desktop and mobile. Show this small integrated checkpoint to the user and
   ask whether the experiential distribution matches the accepted map before
   polishing the full route.
10. Read `references/VISUAL_REFINEMENT.md`. Inspect screenshots of the rendered
   full page at desktop and 390px, exercise the primary journey and motion
   states, correct visible failures, and recapture the affected and full-page
   views. DOM or accessibility snapshots do not replace pixel inspection. Run production
   build plus existing test/typecheck/lint scripts. Substantial work requires
   `dreative finalize --codex --profile <direction> --visual-smoke-url <preview-url>`
   to print `DREATIVE_CHECKS_PASSED`. Showcase contracts and the required
   project-local Experience Map must be portable tracked files; ignored,
   untracked, missing, absolute-machine, or inline-only evidence blocks
   completion. Visual smoke is mandatory for every substantial delivery.
   Compare the final product against the current brief and user choices. Claim
   completion only when every promised route, section, treatment, behavior, and
   review pass is implemented and verified; otherwise continue or report the
   exact blockers.
   Update `.dreative/context.json` only with durable decisions, real tested
   states, and unresolved issues; it is memory, never completion evidence.
   For an opted-in `.dreative/evaluation/` package, also update its designated
   review record with what actually shipped, observable verification results,
   corrections, limitations, and current screenshot paths. Follow the local
   package's size and naming rules. Never create or accumulate evaluation files
   in projects that did not opt in, and never route prototypes, bundles, caches,
   traces, browser profiles, or raw evidence into the review package.
   Report builder-observed facts and limitations only; never award the build a
   reviewer verdict or self-authored Pass. Every substantial design delivery,
   regardless of direction, ends as `Implementation complete; human taste
   verdict: awaiting user review`. Ask the user to inspect the rendered desktop,
   mobile, and relevant motion views. Do not call the product accepted,
   finished, Showcase-quality, or taste-approved until the user replies with
   that verdict; technical checks may be complete while taste acceptance is not.

## The signature component

Every Recommended and Showcase route ships one component that could not be
lifted onto a competitor's page. A command-line card on a developer tool, a
roast-curve on a coffee page, a triage clock on a clinic page: something whose
form comes from what the product actually does. Name it in the brief with the
one sentence explaining why only this product could have it, and bind its
selector in the Showcase contract, where final smoke checks that it resolves,
renders, and is large enough to carry the route.

This is a positive requirement, and it is the one most often missing. Removing
generic components is not the same as making a specific one. A page can pass
every restraint check and still be forgettable because nothing on it is
recognisably about this product.

## Motion is a floor, not a ceiling

Recommended and Showcase both require authored motion. Final smoke samples every
major region entering, centred in, and leaving the viewport, and blocks a route
where nothing at all changes. One purposeful motion clears the floor; the check
exists because clean-and-completely-static keeps losing to messier work that
moves.

Motion still has to earn its place. Prefer few, well-executed, product-meaning
motions over many decorative ones, and remove any automatic loop whose removal
changes neither understanding nor task outcome. But do not treat stillness as
automatically the more tasteful answer — reviewers read an unmoving route as
unfinished more often than as restrained.

Efficient is exempt.

## Scannability

A section a reader has to read in full to understand is a design failure, even
when the prose is good. Final smoke raises an advisory for any section that is a
long block of text with almost nothing to land on. The remedy is yours —
subheads, figures, a table with real structure, a diagram, cards where cards
genuinely help. Do not add cards reflexively; do check that every section can be
understood at a glance before it is read.

## Ambition is capped by what you can verify

Match ambition to what you can actually confirm renders correctly. If you cannot
serve the route, exercise the mechanism, and look at the result, do not ship the
mechanism — choose the version you can verify instead. A bold treatment executed
wrong loses to a plain one executed right, every time it has been measured.

This is not permission to downgrade for convenience. It is a requirement to
prove the ambitious version before it becomes the delivered version, and to say
plainly what you could not verify.

Before relying on the rendered correction loop, distinguish Playwright package
presence, browser executable detection, and a verified browser workflow. When
the project CLI is available, serve the real preview and run
`dreative preflight --probe-browser <preview-url>`. Only successful browser
launch plus preview navigation proves screenshot, console, performance,
viewport, or reduced-motion verification is available. If the probe fails,
repair the environment or report rendered review as blocked; never promote
package or executable detection into browser evidence.

## Showcase

For Showcase, the delivered route must be visibly and structurally distinct
from Recommended. A conventional long page with one isolated spectacle does
not fulfill the highest-ceiling promise. Before implementation, bind the
difference: state the Recommended baseline, at least two perceptible
Showcase-only qualities, and two product-native media opportunities with
use/reject reasons.

In the final response state `Showcase implementation attempted:` followed by the
concrete mechanisms, media, and distributed experience actually shipped, plus
`Independent visual verdict: awaiting user review`. Ask the user to inspect the
supplied desktop, mobile, and motion views. Also state `Not pursued:` for any
materially considered or promised advanced treatment that was rejected,
downgraded, or replaced, with the product or prototype reason. Do not list
irrelevant technologies merely to prove they were omitted.

Showcase must implement one connected experience system. Continuity may be a
meaningful shared state, or an authored physical/cinematic/material sequence
spanning before the central peak, the peak, and after it. A travelling object,
match cut, evolving camera, process curve, film frame, or material
transformation can carry the experience without inventing a user-controlled
variable. Independent widgets arranged in sequence do not establish continuity.

Record the executable contract using `schemas/showcase-mechanism.schema.json`.
It is deliberately small. Every field in it is either exercised against the
rendered page or is a short prompt a human reviewer reads. There is no field for
your own account of your process, because a non-empty string is not evidence and
checking one only teaches you to write longer strings.

Declare each real signature mechanism with its stage, selector, primary product
subject and selector, trigger, media mode, mobile transformation, and the
concrete visible change. Decorative or `aria-hidden` elements cannot be named as
the primary subject. Section role and continuity remain canonical in the
Experience Map and continuity contract. The mechanism list is evidence routing,
not a required widget count. Hover is unavailable on touch, so a mechanism that
exists only on hover needs a stated mobile equivalent rather than a prohibition.

Triggers may be scroll, click, hover, drag, time, media playback, page load,
route transition, or none for a static authored handoff. Time and media triggers
expose sampled progression; load, route, and none declare one resolved
observable state rather than inventing interaction. When the premise is a
journey, process, or transformation, declare it as `journey`. Use scroll-authored
choreography only when the selected treatment depends on scroll controlling time
or space; a cinematic sequence, direct manipulation, or authored edit may own the
journey instead. Smooth scrolling alone does not qualify.

Final visual smoke exercises each trigger on desktop, 390px, and 320px mobile,
samples text collisions through the route, and observes a visible geometry,
style, media, content, or state change. A written `mobileTransformation` promise
does not pass when the actual mobile mechanism is static or missing. Scroll
mechanisms are sampled across their region for real state change and for the
subject staying legible while it happens. Browser checks prove that material
states change; whether the change is meaningful, coherent, or tasteful is left
to human review and reported as such.

For shared-state continuity, name the state, source selector, and affected
regions; final smoke exercises the source and requires the change to reach
before, peak, and after regions as visible rendering, not as data attributes or
hidden text. For authored-sequence continuity, name the motif and its visible
before/peak/after handoffs.

When the route compares items, declare the comparison region and at least one
identity channel bound to genuinely visible media or a computed style
difference: `src`, background image/color, border radius, or clip path. The
browser verifies distinct rendered values across items, because a collection
whose items render identically reads as repeated cards no matter what the class
names say. Text and `data-*` values are supporting identifiers only.

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
route a signature component and authored motion; calm is not the same as empty.

Treat references as ingredients. Extract individual principles—rhythm,
hierarchy, material, transition logic, interaction—not a complete house style.
Draw from more than one domain so no single source dictates the result. Never
lift one source's combined type, palette, composition, and signature motion.
Never design “X-like.” GSAP and Lenis are capabilities, not aesthetics.
Read `exemplars/SLOP.md` before committing to a visual system; it lists the
default shapes that make generated frontends recognisable as generated. Read
`exemplars/PRINCIPLES.md` for what to build instead, which is the harder half.
Record reference mode as `none`, `supplied`, or `scout`. `scout` requires at
least two traceable candidates with real URLs/files and rights status;
`supplied` requires the configured supplied references. Final smoke resolves
local references and requests remote references so prose alone cannot
impersonate scouting.
Record whether each reference and asset came from explicit user requirements or
from the design direction. A user-required item must appear visibly in the
result, or be rejected only after the user explicitly approves that rejection.
General permission to source media is not an explicit requirement to use a
particular item.

Commit to one concept fingerprint:

- product-native premise;
- composition rule and type voice;
- material/color and media role;
- motion/interaction grammar;
- signature component;
- continuity device beyond the hero.

Repeat the logic, not the same component. Each section must advance the
experience through a new role, state, scale, or density. Without the hero, the
remaining route must still express the concept.

Choose mechanisms after the concept. Use the narrowest capable runtime; route
advanced sequencing, scroll, spatial, procedural, and media decisions through
`references/CREATIVE_EXECUTION.md` rather than duplicating its recipes here.

Make an explicit focal-asset decision for the hero, Peak, and major post-Peak
subject. Record whether each is supplied, sourced, generated, procedural, or
absent, plus its real source/file, rights status, and mobile fallback. A
realistic physical product, machine, character, or material must evaluate
external media before procedural DOM/CSS/SVG fabrication — blind review has
repeatedly singled out fabricated product imagery as the worst thing on an
otherwise strong page. Procedural fabrication is allowed when it is genuinely
the better image, not because it is faster, familiar, cheaper, or easier. If the
chosen ceiling requires an unavailable sourcing, editing, model, render, or
sequence capability, expose the capability gap and recommend one concrete
available tool/plugin or asset route before asking for installation, a supplied
asset, or a user-approved direction change. State what was actually available
and never imply that scouting or production occurred when it did not. Local
sources must exist inside the repository and be tracked; remote sources must
load; inline sources must resolve in the rendered route.

Treat Native Foundations as baseline implementation skeletons, not preferred
substitutes for mature specialist runtimes. Use one only when it fully
satisfies the selected mechanism's visual, interaction, performance, and
coordination requirements. Do not select a foundation merely because it is
already available, familiar, cheaper, or easier. For advanced choreography,
rendering, state orchestration, or smooth-scroll coordination, choose the
appropriate established runtime when it better serves the required result.

Each specialist system owns a meaningful state change, mobile form, fallback,
and cleanup path. Reject generic spectacle; creative ambition is not treatment
count.

External systems are ingredients—references, accessible primitives, motion
recipes, or runtimes—never the concept. Record source, license, cost,
accessibility, section, customization, and fit for copied or installed code.

## Quality floor

Every section needs a job, readable hierarchy, intentional spacing, and an
authored handoff. Alternate intensity and rest. A rest may be still, but must
retain a concept-bearing relationship through continuity, an evolving visual
variable, meaningful tactile state, media treatment, or authored handoff;
default layout is not authored rest. Keep the primary task obvious.

Do not concentrate nearly all experiential weight in one isolated set-piece.
Inspect the route as a sequence and require a meaningful development,
consequence, or resolution outside the primary peak when the page length and
concept warrant it. Automated intensity counts may flag a lopsided map, but
they are advisory: captured states, visual inspection, user feedback, and a
real refinement decide whether the journey feels balanced.

Every prominent decorative line, grid, overlay, shape, persistent element, or
visual motif must have a perceptible role in product meaning, hierarchy,
interaction, or continuity. If its role cannot be explained in one concrete
sentence from the rendered experience, remove or redesign it.

Do not reuse the same hero-grade image, wallpaper, render, or visual
composition across major sections unless the repetition expresses intentional
continuity or transformation. Reused media must visibly evolve in crop, state,
material, meaning, or interaction; otherwise use a distinct asset or
composition.

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
across the entire experience, with preserved behavior genuinely working; it
does not mean that code was written or the build passed.

Do not create plan YAML, approval hashes, attestations, provenance, evidence
ledgers, certification artifacts, or mandatory critic loops. Do not narrate
checklist compliance as a substitute for editing code or correcting the
rendered interface. `DREATIVE_CHECKS_PASSED` certifies commands only, not taste.

Do not add a gate because a build once evaded one. A check earns its place only
by catching a failure a human reviewer would also have called a failure, on a
project that had not been used to invent the check. Prefer an advisory that
prompts a look over a blocker that encodes taste as pass/fail.

## Resource routing

- Open redesign or external reference: `references/CREATIVE_DIRECTION.md`
- Dreative dogfood or workflow change: `references/DOGFOOD_LESSONS.md` and `skills/learning.md`
- Named adoption list or library/reference comparison: `references/REFERENCE_ADOPTION.md`
- Advanced runtime: `references/CREATIVE_EXECUTION.md`
- Focal media feasibility and offline production: `references/ASSET_PIPELINES.md`
- What to build, not only what to avoid: `exemplars/PRINCIPLES.md` and `exemplars/SLOP.md`
- Relevant craft only: `skills/<name>.md`
- Rendered correction loop: `references/VISUAL_REFINEMENT.md`
- Opted-in evaluator handoff: project-local `.dreative/evaluation/README.md`
- Chosen mechanism only: zero or one matching native foundation initially
- Focused mechanism lookup only: `llms.txt` or `dreative catalogue`

Never browse the catalogue to invent the concept.
