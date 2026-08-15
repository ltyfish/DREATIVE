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

- It reliably removes the generated look — one value applied to everything, the
  stock gradient, the same five sections every product gets. Note *one value
  applied to everything*: a page of hard rectangles is the same failure as a
  page of identical rounded cards. Radius, borders and shadows are ordinary
  tools; see SLOP #4.
- It has lost, repeatedly, on **too little motion**, **no single component that
  could only belong to this product**, and **prose and tables where the reader
  needed something scannable**.
- Restraint is not free. Removing spectacle also removes the thing people
  remember. Subtracting is the start of the work, not the end of it.

The round after those were turned into requirements found a fourth thing, and
it is the most important sentence in this file. What makes the control read as
smooth and crafted is not its best moment. It is a **pervasive, cheap, entirely
unoriginal transition layer** — hover, focus, and scroll-in feedback on
everything — while the Dreative arm spent its whole budget on two signature
moments and left the rest of the page dead:

> *"when i scroll, theres minimal but still subtle clean transition of it
> popping up… same goes with interacting where it changes colour/background/
> shadow… tho very overused and not unique"* — on the control, which won
> smoothness
>
> *"everything outside the few signature moments is still flat with no
> transitions"* — on the Dreative build, which won overall and was still called
> short of animation

The same round produced the first losses on the opposite failure. Given a
positive requirement, the builds became **cramped, wordy, and overloaded** —
*"cramping too much ambitions and words and design"*, *"so much stats
everywhere"*, *"messy, cramped, not tidy"* — and the signature component
requirement was twice satisfied by an abstract readout on a page that was
selling something: *"a graph log which makes things confusing and not really a
ecommerce website"*.

So: breadth of small motion, not count of big moments. A signature component
about the product, not a chart about the product. And ambition measured in
resolution, not in elements per section.

## What the checks are for

Read this before the workflow, because it governs everything below it.

The single worst outcome for this skill is a build where the question stopped
being *"what would look best?"* and became *"what arrangement passes all these
checks?"* A page assembled to satisfy a threshold is a page nobody chose. It is
also, specifically, how this system has failed before: told to have a signature
component, it produced a chart; told to have motion, it fired one qualifying
transition; told to be ambitious, it added elements until the route was cramped.
Every one of those satisfied the rule and lost the round.

So the checks are deliberately not a definition of good work:

- **Blockers are defects, not taste.** Something is a blocker only when it is
  broken in a way any human would call broken and no arrangement of a good page
  can trip: a route that 500s, text colliding, content overflowing its viewport,
  unreadable type, a clipped sticky element, a console error, a reveal that
  fires after the reader has already scrolled past, a promise the contract made
  that does not resolve on the page. Nothing about how good it looks.
- **Everything taste-shaped is an advisory**, and an advisory means *go look at
  it* — not *raise the number*. Motion breadth, density, scannability, signature
  size and subject are all advisories, because in every case the browser is
  measuring a proxy and the reviewer was responding to something else.
- **Numbers in this system are unvalidated.** Where a threshold exists it was
  invented by whoever wrote the check. Treat it as the trigger for a look, and
  say so if you disagree with what it flagged; a defended judgement beats a
  satisfied threshold.
- **Satisfying an advisory without improving the page is a failure**, even
  though nothing will catch it. Fading every region in uniformly clears the
  motion advisory and is slop by `exemplars/SLOP.md` #5. Deleting words clears
  the density advisory and can gut the section. If the honest fix is nothing,
  do nothing and say why.

Design first, then check. The check is the last thing that happens to a page,
never the thing that shapes it.

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
   before editing code. **First decide what the sections are.** The map is not
   an annotation of the section list the brief or the existing page hands you;
   deriving that list unchanged and then styling it is the single failure blind
   review has caught most often — the build ends up structurally identical to
   one made without this skill, differing only in card chrome, and a reader
   sees that as the same design. Say in one line what the page's shape is and
   why this product wants it: what a visitor needs first, what can be one
   section instead of three, what deserves a full screen, what does not belong
   on the page at all, and whether a stack of full-width bands is genuinely
   right here or merely the default. A section you kept because it was already
   there is a decision you have not made. Then show every major page or section
   with Dreative's recommended role, craft intensity from 1–5, simple journey rhythm
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
triage clock on a clinic page: something whose form comes from what the product
actually does. Name it in the brief with the one sentence explaining why only
this product could have it, and bind its selector in the Showcase contract,
where final smoke checks that it resolves and renders. Whether it is large
enough to carry the route is an advisory you answer by looking; a small
component can still be the thing a reader remembers, and a viewport-area
percentage is exactly the kind of number a page gets arranged around.
`exemplars/MATERIALS.md` §6 lists signature shapes that have worked by product
kind — as stock to choose from, never a menu to pick the passing option off.

This is a positive requirement, and it is the one most often missing. Removing
generic components is not the same as making a specific one. A page can pass
every restraint check and still be forgettable because nothing on it is
recognisably about this product.

**It must be about the product, not about data concerning the product.** The
requirement has now been satisfied twice by an abstract readout — a roast curve
and a log stream on a page whose job was selling coffee — and both times the
reviewer called it confusing, ugly, and off-topic while preferring the control's
plain product cards. A chart, graph, log stream, terminal, or metrics panel is
the right signature component when the product *is* data or developer tooling.
On a shop, a service, a clinic, or a publication it is an instrument pointed at
the wrong subject.

Bind `productSubjectSelector` and `productSubject` to the thing the component
operates on — the item for sale, the document being read, the appointment being
booked. Final smoke confirms that subject resolves inside the component and
renders at readable size, and raises an advisory when the component contains no
image, video, or canvas of it. Two further rules the same round produced:

- The signature component must serve the route's primary task, not compete with
  it. If the page sells something, the clearest path to buying it must not be
  the second most prominent thing on screen.
- Emphasis mechanisms must be bounded at their degenerate case. A filter that
  scales up the matching item looked "super cool" until one filter matched a
  single product, which then blew up while everything else collapsed. Design
  for one match and for all matches before shipping the effect.

## Two motion budgets

Motion is two separate obligations and they are funded separately. Building the
second while skipping the first is the specific mistake that keeps losing.

**1. The interaction baseline — required on every profile, Efficient included.**
Every element a user can touch has a designed hover, focus, and press state.
Every major region has a small entrance. Colour, background, shadow, underline,
a few pixels of movement; 120–200ms; the same grammar everywhere on the route.

This layer is supposed to be cheap and unoriginal. It is not where
distinctiveness comes from and it should not try to be. It is what makes a page
feel responsive to the person using it, and blind review reads its absence as
the page being unfinished — while reading its presence as craft even when the
reviewer can see it is generic. Skipping it because it is generic is how a
route with two beautiful mechanisms is still described as having no animation.

Final smoke hovers and focuses the interactive elements it can find and blocks a
route where **none** of them respond — the zero case, which is a page that was
never given this layer at all. How far the layer spreads is an advisory that
asks you to look at the route, not a ratio to clear: the same number goes up if
you fade every region in uniformly, which is slop by `exemplars/SLOP.md` #5.
Build the layer because the page should answer the person using it.

**2. Signature moments — few, expensive, product-meaning.** Here the old rule
still holds: prefer few well-executed motions over many decorative ones, and
remove any automatic loop whose removal changes neither understanding nor task
outcome. Budget these; do not budget the baseline.

Reveals must complete while the region is on screen. A reveal whose end state
arrives only after the reader has scrolled past fires behind them and reads as
broken; final smoke blocks a region that is identical entering and centred and
different once scrolled past. Choose thresholds against the top of the viewport,
not the bottom, and account for a section taller than one screen.

Do not treat stillness as automatically the more tasteful answer. Reviewers read
an unmoving route as unfinished more often than as restrained.

## Scannability and density

Both directions of this fail, and Dreative has now lost rounds to each.

**Too little structure:** a section a reader has to read in full to understand is
a design failure, even when the prose is good. Final smoke raises an advisory for
any section that is a long block of text with almost nothing to land on. The
remedy is yours — subheads, figures, a table with real structure, a diagram,
cards where cards genuinely help. Do not add cards reflexively; do check that
every section can be understood at a glance before it is read.

**Too much:** the more recent and now more common failure. Given a positive
requirement, builds answer it by adding — more stats, more copy, more panels,
more tightly packed — and reviewers call the result cramped, wordy, and messy
while preferring a control with a third of the content. Advisories fire for a
section carrying too many words or ten or more competing statistic blocks. Both
thresholds were invented and neither has been validated; they mark a section
worth a second look, and the right response is sometimes to leave it alone and
say why. A pixel-gap crowding count used to live here and was removed —
"cramped" is perceptual, and a spacing number is arrangeable.

Ambition is resolution, not element count. One idea rendered precisely beats
four crammed into the same band. Before adding an element to a section, delete
one and see whether the section got worse.

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
route a signature component, the interaction baseline, and authored motion; calm
is not the same as empty, and a calm page that does not respond to being used is
not calm, it is inert.

Treat references as ingredients. Extract individual principles—rhythm,
hierarchy, material, transition logic, interaction—not a complete house style.
Draw from more than one domain so no single source dictates the result. Never
lift one source's combined type, palette, composition, and signature motion.
Never design “X-like.” GSAP and Lenis are capabilities, not aesthetics.
Read `exemplars/SLOP.md` before committing to a visual system; it lists the
default shapes that make generated frontends recognisable as generated. Read
`exemplars/PRINCIPLES.md` for what to build instead, which is the harder half,
and `exemplars/MATERIALS.md` for actual stock to build it out of — real type
pairings, palette constructions, compositions, depth treatments, and the ambient
transition grammar, each indexed by the condition it belongs to.

When you scout, look at **whole pages, not components**. The question a
reference answers is what sections a page like this has, in what order, at what
sizes, and what it leaves out — not what its buttons look like. Component and
animation galleries answer the second question only, and reaching for them
first is how a build ends up as the default stack wearing nicer parts.
[Godly](https://godly.website/) is a usable free source of whole shipped sites,
filterable by style; a real product in the same category is better still. Study
two or three, name what is structurally different between them, and decide
which structure this product wants. Then, and only then, go looking for parts.

Materials are a shelf, not a style. Take one row from type, a different one's
palette construction, another's composition; taking a whole column reproduces
this system's own failure one level up, as a Dreative average replacing the
generic one. If the product wants something not on the shelf, build that.
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
otherwise strong page. Read `references/MEDIA_SOURCES.md` for where to actually
look and what each source's licence permits; "evaluated external options" means
you searched, not that you considered searching. Procedural fabrication is
allowed when it is genuinely the better image, not because it is faster,
familiar, cheaper, or easier. If the
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
authored handoff. A section whose job takes more than four words to state is
carrying two sections' worth of material. Alternate intensity and rest.

Every interactive element needs designed hover, focus, press, and disabled
states, in one grammar across the route. This is not polish deferred to the end;
it is the first motion work, and it applies on every profile.

Any emphasis that scales, highlights, or isolates a selected item must be
bounded at both degenerate cases — every item matching, and exactly one item
matching. An effect tuned for the middle case blows up on the single match. A rest may be still, but must
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

Removing a check is as legitimate as adding one, and is usually the better move
when the evidence is one round of one reviewer. A rule that has not caught a
real failure since it was written is costing context and steering the builder
toward arrangement; delete it and record why. The system has already added three
blockers in a single change against its own advice — that was the mistake, and
the correction was to demote them, not to add a fourth.

## Resource routing

- Open redesign or external reference: `references/CREATIVE_DIRECTION.md`
- Dreative dogfood or workflow change: `references/DOGFOOD_LESSONS.md` and `skills/learning.md`
- Named adoption list or library/reference comparison: `references/REFERENCE_ADOPTION.md`
- Advanced runtime: `references/CREATIVE_EXECUTION.md`
- Where to source real imagery, texture, 3D, or type: `references/MEDIA_SOURCES.md`
- Focal media feasibility and offline production: `references/ASSET_PIPELINES.md`
- What to build, not only what to avoid: `exemplars/PRINCIPLES.md` and `exemplars/SLOP.md`
- Concrete type, colour, composition, depth, and ambient-motion stock: `exemplars/MATERIALS.md`
- Relevant craft only: `skills/<name>.md`
- Rendered correction loop: `references/VISUAL_REFINEMENT.md`
- Opted-in evaluator handoff: project-local `.dreative/evaluation/README.md`
- Chosen mechanism only: zero or one matching native foundation initially
- Focused mechanism lookup only: `llms.txt` or `dreative catalogue`

Never browse the catalogue to invent the concept.
