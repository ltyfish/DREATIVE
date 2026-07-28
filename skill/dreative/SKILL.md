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
   package, and prototype choices and explicitly ask the user to confirm the
   recommended settings or list changes. This is a blocking gate before code
   edits. In particular, never mark Prototype as Auto, Required, completed, or
   skipped without showing that choice to the user first. Treat the user's
   direction, settings, named treatments, and later
   corrections as binding; direction defaults fill only unspecified decisions. Never
   silently downgrade them for convenience, time, tokens, or implementation
   preference. Ask one focused question when uncertainty would materially alter
   a page's intensity, a selected treatment, the signature behavior, or scope.
   When Prototype is selected and a prototype is actually produced, it creates
   a third blocking gate: build both promised alternatives, capture the required
   desktop/mobile stills and recordings, show them to the user, and stop. Do not
   integrate either approach until the user explicitly selects one. The builder
   cannot select for the user, and a general instruction to continue is not a
   prototype choice.
4. After configuration, present a compact, project-specific **Experience Map**
   before editing code. Show every major page or section with Dreative's
   recommended role, craft intensity from 1–5, simple journey rhythm
   (`Rest`, `Build`, `Peak`, or `Release`), user agency (`Watch`, `Influence`,
   or `Control`), and connection to the surrounding journey. Intensity is the
   section's quality and transformation ambition, not an instruction to keep it
   moving. A user may choose 5 for every section while Dreative preserves one
   clear Peak through the rhythm field. Lead with `Use Dreative's recommended approach`; let the user change
   a row with `more animated`, `calmer`, `change layout`, `change interaction`,
   `keep static`, or a plain-language instruction. Add one to three targeted
   recommendations about where more motion would strengthen the journey and
   where it would create competition. Ask the user to confirm the recommended
   map or list changes. This is the concrete design proposal, not another set of
   abstract global dials.
5. Compile the accepted map into the obligations defined by
   `schemas/experience-map.schema.json`: section role, input state, visible
   start and end states, mechanism owner, connection, desktop behavior, mobile
   behavior, reduced-motion behavior, and evidence target. Intensity-5 rows
   additionally name a real selector, trigger, owned properties, and meaningful
   outcome so rendered verification can exercise the promise. Treat an all-5
   map as flagship craft everywhere, not maximum energy everywhere. Exactly one
   row owns the Peak rhythm, and Showcase includes at least one Control row.
   The schema makes
   promises traceable; it is not an approval artifact and does not prove taste.
   Let architecture fit the promised complexity; do not impose a generic scene
   registry, timeline controller, or folder structure.
6. Only after the user has explicitly resolved direction, configuration, and
   Experience Map,
   privately complete the full
   project-specific Creative Decision Brief defined in `PLAN.md`. Always create
   and use this working blueprint even when the user does not ask to see it;
   update it when repository or prototype evidence changes. State only a short
   build brief by default: concept, product reason, visual system, signature
   behavior, preserved behavior, chosen resources, and a compact execution map
   containing the experience arc, section ownership, post-hero visual peak,
   continuity owner, and mobile transformation. Reveal the full brief only on
   request. Do not wait for its reveal or approval; proceed to build.
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
   Load only the relevant specialty and zero or one relevant native foundation initially. Zero is valid;
   add another only when a separate named mechanism genuinely requires it. Prototype only a
   central, uncertain mechanism whose result could change the build.
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
   completion. Visual smoke is mandatory for every
   substantial delivery and Showcase additionally requires an executable
   connected-experience contract with artifact-backed prototype evidence. Compare the final
   product against the current brief and user choices. Claim completion only
   when every promised route, section, treatment, behavior, and review pass is
   implemented and verified; otherwise continue or report the exact blockers.
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

For Showcase, the delivered route must be visibly and structurally distinct
from Recommended. A conventional long page with one isolated spectacle does
not fulfill the highest-ceiling promise. In the final response state
`Showcase implementation attempted:` followed by the concrete mechanisms,
media, and distributed experience actually shipped, plus
`Independent visual verdict: awaiting user review`. Always ask the user to
inspect the supplied desktop, mobile, and motion views and provide the verdict.
The builder contract has no verdict field: Codex must never generate, infer,
persist, or promote this verdict, even when it believes the result passes.
Also state `Not pursued:` for
any materially considered or promised advanced treatment that was rejected,
downgraded, or replaced, with the product or prototype reason. Do not list
irrelevant technologies merely to prove they were omitted.

Showcase must implement one connected experience system. At least one meaningful
choice or transformation must propagate through three non-adjacent regions
spanning before the central peak, the peak, and after it. Independent widgets
arranged in sequence do not establish continuity. If a required prototype would
lower the selected ceiling or abandon promised choreography or media, pause
and obtain the user's consent before changing the brief.
Before implementation, bind the difference from Recommended: state the
Recommended baseline, at least two perceptible Showcase-only qualities, two
product-native media opportunities with use/reject reasons, and the observed
result of comparing **Best Fit** with a **Bold Alternative**. Both must be
final-worthy, use the same real content, receive the same desktop/mobile
coverage, and differ in experience or interaction model—not merely runtime,
budget, or visual polish. Neither may be a deliberately weaker strawman.
Both alternatives require inspectable routes or files plus desktop and mobile
captures and short desktop/mobile motion recordings; prose written by the
builder is not prototype evidence. The recordings support human comparison;
the prototype routes remain executable verification targets.
The builder may record only a `builderSelectionRationale`, which is an
inspectable assertion and never an independent review or quality verdict.
"It works" is not proof that either option is final-worthy.

Record the executable contract using `schemas/showcase-mechanism.schema.json`.
Prototype evidence records `selectedBy: "user"`; builder selection is invalid.
Name the selected prototype subject and integrated subject plus the focal scale,
copy balance, control placement, material/lighting, and desktop/mobile framing
that caused the selection. Final smoke checks structural focal preservation; it
does not require pixel-identical screenshots or prevent intentional evolution.
Name the shared state, its source selector, and at least three affected region
selectors across `before`, `peak`, and `after`, with the concrete effect in each.
Also record each real signature mechanism with its stage, selector, primary
product subject and selector, trigger, experience role, media mode, mobile
transformation, and meaningful outcome. Each mechanism must also state the
product truth it communicates, the user or system cause, the visible change,
the resulting user decision, and what meaning would be lost if removed. Remove
or redesign automatic loops whose removal changes neither understanding nor
task outcome. Decorative or `aria-hidden` elements
cannot be named as the primary subject.
These semantic fields are structured review prompts, not deterministic proof.
Browser checks can prove that material states change; human review still decides
whether the change is meaningful, coherent, or tasteful.
The mechanism list is evidence routing, not a required widget count. Hover is a
supporting state: it cannot own the peak or post-peak mechanism in a journey.
When the premise is a journey, process, or transformation,
declare it as `journey` and include a substantial scroll-authored mechanism.
Smooth scrolling alone does not qualify. Bucketed text/class replacement alone
is not a flagship transformation. A scroll mechanism whose sampled differences
are fully explained by text, opacity, color, filter, or uniform scale is
rejected. Interface-style products may declare
`interface` and use a different continuous interaction structure. Final visual
smoke exercises each trigger on desktop, 390px, and 320px mobile, samples text
collisions through the route, and observes a visible geometry, style, media,
content, or state change. A written `mobileTransformation` promise does not
pass when the actual mobile mechanism is static or missing.

Before relying on the rendered correction loop, distinguish Playwright package
presence, browser executable detection, and a verified browser workflow. When
the project CLI is available, serve the real preview and run
`dreative preflight --probe-browser <preview-url>`. Only successful browser
launch plus preview navigation proves screenshot, console, performance,
viewport, or reduced-motion verification is available. If the probe fails,
repair the environment or report rendered review as blocked; never promote
package or executable detection into browser evidence.

## Creative decisions

Begin with product truth: subject verbs, materials, data, history, audience,
language, assets, behavior, and content shape. Include at least three decisions
that could only have come from this product. A fashionable layout with the logo
swapped is failure.

Treat references as ingredients. Extract individual principles—rhythm,
hierarchy, material, transition logic, interaction—not a complete house style.
Prefer two to four cross-domain sources. Never lift one source's combined type,
palette, composition, and signature motion. Never design “X-like.” GSAP and
Lenis are capabilities, not aesthetics.
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
- continuity device beyond the hero.

Repeat the logic, not the same component. Each section must advance the
experience through a new role, state, scale, or density. Without the hero, the
remaining route must still express the concept.

Choose mechanisms after the concept:

- GSAP for sequencing, scrubbing, pinning, reversibility, and coordinated
  DOM/SVG/WebGL choreography.
- Lenis when interpolated scroll or velocity is part of the interaction.
- Three.js/OGL/R3F when spatial behavior explains or embodies the subject.
- Canvas/shaders for bounded procedural behavior the DOM cannot deliver.
- Sourced/generated media when it materially strengthens art direction.

Treat Native Foundations as baseline implementation skeletons, not preferred
substitutes for mature specialist runtimes. Use one only when it fully
satisfies the selected mechanism's visual, interaction, performance, and
coordination requirements. Do not select a foundation merely because it is
already available, familiar, cheaper, or easier. For advanced choreography,
rendering, state orchestration, or smooth-scroll coordination, choose the
appropriate established runtime when it better serves the required result.

Use specialist systems confidently when they create real value, but make each
one own a meaningful state change, mobile form, fallback, and cleanup path.
Showcase has access to every treatment but selects only those that strengthen
the premise. Creative ambition is not measured by treatment count.

Reject generic machinery: arbitrary particles, floating spheres, default
smooth scroll, shader wallpaper, permanent cursor followers, telemetry
overlays, endless fade-ups, and 3D that behaves like a flat image.

Use external systems in four roles only: reference sources, accessible
primitives, motion-recipe candidates, and runtime engines. For copied or
installed code, record source, license, dependencies, bundle cost,
accessibility status, intended section, required customization, and concept
fit. A component or library never qualifies as the concept.

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
fabricated claims, broken glyphs, and desktop merely stacked on mobile.

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

## Resource routing

- Open redesign or external reference: `references/CREATIVE_DIRECTION.md`
- Dreative dogfood or workflow change: `references/DOGFOOD_LESSONS.md` and `skills/learning.md`
- Named adoption list or library/reference comparison: `references/REFERENCE_ADOPTION.md`
- Advanced runtime: `references/CREATIVE_EXECUTION.md`
- Relevant craft only: `skills/<name>.md`
- Rendered correction loop: `references/VISUAL_REFINEMENT.md`
- Opted-in evaluator handoff: project-local `.dreative/evaluation/README.md`
- Chosen mechanism only: zero or one matching native foundation initially
- Focused mechanism lookup only: `llms.txt` or `dreative catalogue`

Never browse the catalogue to invent the concept.
