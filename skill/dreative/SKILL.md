---
name: dreative
description: Design distinctive websites through generated visual directions, user selection, faithful implementation, and browser refinement. Use for frontend design and redesign, with sourced or generated assets and authored motion when the chosen design calls for it.
---

# Dreative

Design visually, build faithfully, refine in the browser. Dreative is a general
frontend design skill: composition, typography, imagery, structure and usability
are its core. Motion is a creative capability that serves the selected design;
it can lead when the user requests a motion-led experience.

For an ambitious or Awwwards-style brief, pursue a distinctive moving experience:
art-directed material, expressive typography, surprising spatial relationships,
and deliberate pacing through the useful parts of the site. Atmosphere, delight
and dramatic transitions are valid goals, alongside clarity and usability.
The resources below teach ways to explore and build; they are not a house style,
an approved effects menu, or a formula for award-worthy work.

## Start here

Inspect the repository, user brief, existing behavior, assets, and available tools.
Respect supplied references, named effects, intensity, budget, and authorization.
For an open design use `PLAN.md` and the exploration method in
`references/CREATIVE_DIRECTION.md`: plan distinct concepts and their material,
composition and behavior before generating images; generate visual directions with concrete
plans, show the images and recommend one, then stop for the user's choice before
implementation. Small material or motion experiments can inform that choice;
they do not authorize building the full site before selection.
An existing design selection or explicit delegation to choose
autonomously takes precedence. Do not confuse budget profiles with design options.

Use `references/VISUAL_DESIGN.md` for the image-led direction stage and its
translation into layout, separate assets and real controls. Keep the selected
image in view through implementation and compare the browser render against it.
Supplied designs enter at translation; scoped fixes need no new concept round.

Keep a short implementation note: concept, actual assets, visible motion beats,
runtime owner, mobile form, primary user task, and unresolved risks. It is working
memory, not an approval artifact or a score. Existing `.dreative/context.json`
is fallible memory; reconcile it against the project.

Keep the task fixed while exploring its presentation. Missing material is a
production problem, not permission to replace a shop with an editorial study.
Name an unresolved dependency without letting it consume the whole exploration;
continue the useful work that does not depend on it. See `references/MEDIA_SOURCES.md` for
bounded recovery and representative imagery for fictional subjects.

## Build the selected composition

Obtain the imagery and materials that make the chosen direction work. Build a
representative composition and its adjacent region in the real application;
compare it to the chosen design before extending the route. Preserve its defining
spatial choices while making content, interactions and mobile reflow real.
Follow `references/MEDIA_SOURCES.md` for sourcing and generation, and
`references/VISUAL_REFINEMENT.md` for matched-state browser correction.

## When motion is part of the design

For motion-led work, use `references/CHOREOGRAPHY.md` before selecting the focal
effect. Arrange the actual content and material into a journey with a useful
destination. The first viewport, development, primary task, and ending should
belong to that idea. An outline of headings cannot show this: use material at
its intended scale, in rough compositions or an equivalent visual study.
For an ambitious bespoke motion brief, study a relevant live passage through
`references/PRODUCTION_STUDIES.md` or the user's references before settling on
the mechanism. Observe its input, timing, material and destination; then obtain
the useful implementation source through `references/CREATIVE_RESOURCES.md`.
Compare ways of experiencing the subject, not filters on the same hero.

Resolve the material and tool uncertainty before the effect locks in a visual
language. Discover callable sourcing/generation capabilities as well as local
production tools; a failed stock endpoint is an access finding, not an art
direction. See `references/MEDIA_SOURCES.md` for recovery choices.

Before completing a motion-led route, build its hardest uncertain moment against
the actual intended material, with its entry, development, and exit into the next
region. Inspect it at desktop and mobile. This is a small slice at the intended
visual fidelity, not an entire first draft and not a substitute fade.

The slice must prove the relationship survives into the first useful task region
or a deliberate ending. A local reveal, filter, or FLIP demo followed by ordinary
independent sections is a mechanism demo, not route continuity. Inspect the
entry, development, readable hold, destination, and release at desktop and
mobile, including reduced motion.

A prototype may isolate a shader, crop, scrub, transition, or interaction without
building unrelated navigation or sections. Include the real receiving composition
when continuity is the uncertainty. State the question it answers.
Reuse the successful implementation. Do not promise to replace placeholder motion
later. If real material or a capability is missing, identify it and pursue the
closest faithful route; disclose any change to the promised result.

For subject-led commerce or another task that requires inspecting a subject,
classify the subject view as required material. Do not silently fill the primary
task with hand-drawn stand-ins when the brief promises a real or generated
product view, unless the chosen concept explicitly makes diagrammatic product
art the subject. Recompose honestly around a graphic/editorial task or report
the promised delivery incomplete. Disclosure records the deviation; it does not
make an unrelated substitute equivalent.

After the slice works, test it against the planned whole experience.
Build the least-resolved passage next, including the primary interaction and ending.
Preserve required facts and behavior without treating their source grouping as
the page's section list. Prototype approval applies to the demonstrated scope.

## Read at the decision, not all at once

| Decision | Resource |
|---|---|
| Open concept and user approaches | `PLAN.md`, then `references/CREATIVE_DIRECTION.md` if needed |
| Generated page mockups, visual exploration, or translating a design image into UI | `references/VISUAL_DESIGN.md` |
| Worked generation briefs and runnable motion slices | Worked studies in `references/VISUAL_DESIGN.md`, then `systems/production-lab.html` |
| Motion-led brief, including named parallax/pixelation/framing/scroll/transition | `skills/motion.md` |
| Composing a motion-led experience or fixing repetitive sections | `references/CHOREOGRAPHY.md` |
| Learning how a complete immersive production works | `references/PRODUCTION_STUDIES.md`, then the relevant original |
| Image/canvas continuity, framing, and ownership through a join | `references/MEDIA_HANDOFF.md` |
| Sourcing, generating, scraping, or preparing assets | `references/MEDIA_SOURCES.md` |
| Sequence, video, depth, or 3D material production | `references/MOTION_MATERIAL.md` |
| Supplied references or motion scouting | `references/REFERENCE_ADOPTION.md` |
| Runtime integration | `references/CREATIVE_EXECUTION.md`; framework file matching the project |
| Copyable mechanism implementation | `systems/NATIVE_FOUNDATIONS.md`; inspect only the selected export |
| Spatial subject | `skills/3d.md` |
| Stateful controls | `skills/interaction.md` |
| Route continuity or cinematic sequence | `skills/immersive.md` or `skills/cinematic.md` |
| Experimental treatment | `skills/experimental.md` |
| Typography, hierarchy, responsive layout | `skills/refined.md`, `skills/ux.md`, `skills/mobile.md` as needed |
| Image presentation | `skills/media.md` |
| First rendered review | `references/VISUAL_REFINEMENT.md` |
| Selected Showcase delivery | `references/SHOWCASE.md` |
| Persistent generic design after inspection | `exemplars/PRINCIPLES.md`, `exemplars/SLOP.md` as diagnostic examples, not universal bans |
| Explicit local evaluator handoff | `references/EVALUATION_HANDOFF.md` only if `.dreative/evaluation/README.md` exists |
| Maintaining this skill | `skills/learning.md` and repository-only `references/DOGFOOD_LESSONS.md` (not installed) |

Read relevant sections once while they remain available. After compaction or a
source change, a targeted reread is appropriate. Do not spend the build budget
surveying every specialty. A file read is not evidence that its advice was used.

## Design decisions that matter

Make motion concrete: what appears, what changes, what persists across a join,
what input drives it, and what the user sees when it resolves. If the brief asks
for ambitious motion, preserve that ambition in the slice; a profile label does
not override named treatments.

Choose materials by fit and identity. For a real product, show the actual product;
an analogue or generated illustration must not masquerade as real inventory.
Fictional concepts can use coherent generated product imagery. Source
or create assets before committing the focal composition. SVG, type, CSS, canvas,
photography, and video are all legitimate media. Judge the rendered work.
Do not fabricate an unconvincing physical prop because it is easy to code.
A material study cannot replace the subject views the primary task needs. Resolve
one usable subject view before expanding a substitute into an entire set.

Fund three kinds of work independently: responsive controls, continuity between
regions, and any focal set-piece. Quiet regions can remain still. A fade, transform,
or mask can be excellent motion; its adequacy depends on the promised experience.
Do not replace a requested mechanism with a nominal effect and call it complete.

Use one owner per animated property. Native foundations are reusable mechanics,
not an art-direction menu; mature runtimes are appropriate when they solve the
chosen problem. Preserve native scrolling unless interpolation improves the
tested experience. Smooth-scroll installation alone creates no choreography.

## Review and delivery

Serve the actual route. Inspect the full page and key sectional states at 1440px
and 390px, including normal-motion playback, reverse and fast input, release,
touch and keyboard interaction. Inspect reduced motion separately. Full-page
screenshots cannot show time and can misrepresent sticky scenes.

Exercise the user's primary task, direct routes, loading and failure states.
Correct visible crop, hierarchy, spacing, collision, overflow, missing-media,
encoding, and interaction failures, then recapture affected views. Use 320px and
performance/device checks when the content or runtime warrants them.

Run the production build and applicable existing deterministic checks.
For substantial frontend delivery run:
`dreative finalize --codex|--claude --profile <direction> --visual-smoke-url <preview-url>`
with the correct host flag; Showcase also needs its mechanism contract.
Completion requires command success and `DREATIVE_CHECKS_PASSED`. A failure means
implementation is incomplete: state the blockers. This marker certifies commands,
not motion quality or taste.

Compare the rendered result to the user's actual choices. Report what shipped,
what was tested, and remaining limitations. For substantial frontend delivery:
Report technical checks, fulfillment of the selected experience, and human taste
review separately. Use **Implementation complete; human taste verdict: awaiting
user review** only when the requested material, behavior and selected motion
actually shipped. Passing finalization cannot clear a missing requirement.
Do not award yourself acceptance. Do not create taste thresholds, read-count
gates, mandatory critic loops, or prose attestations as substitutes for observation.
