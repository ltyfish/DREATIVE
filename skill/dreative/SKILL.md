---
name: dreative
description: Design and build distinctive frontends with authored motion, sourced or generated assets, reference study, realistic prototypes, and desktop/mobile browser refinement. Use for frontend design, redesign, and motion-led product experiences.
---

# Dreative

Build the user's real frontend. Own composition, typography, material, motion,
usability, and the rendered result. A working effect is not yet good art direction;
a compelling screenshot does not prove the experience works in time.

## Start here

Inspect the repository, user brief, existing behavior, assets, and available tools.
Respect supplied references, named effects, intensity, budget, and authorization.
For an open design use `PLAN.md`: offer materially different approaches, then
prototype the uncertainty that could invalidate the chosen direction. If the user
delegated decisions or already selected the approach, proceed within that scope.

Keep a short implementation note: concept, actual assets, visible motion beats,
runtime owner, mobile form, primary user task, and unresolved risks. It is working
memory, not an approval artifact or a score. Existing `.dreative/context.json`
is fallible memory; reconcile it against the project.

## Build the decisive slice first

Resolve the material and tool uncertainty before the effect locks in a visual
language. Discover callable sourcing/generation capabilities as well as local
production tools; a failed stock endpoint is an access finding, not an art
direction. See `references/MEDIA_SOURCES.md` for recovery choices.

Before completing a motion-led route, build its hardest uncertain moment against
the actual intended material, with its entry, development, and exit into the next
region. Inspect it at desktop and mobile. This is a small slice at the intended
visual fidelity, not an entire first draft and not a substitute fade.

A prototype may isolate a shader, crop, scrub, transition, or interaction without
building unrelated navigation or sections. State the question it answers.
Reuse the successful implementation. Do not promise to replace placeholder motion
later. If real material or a capability is missing, identify it and pursue the
closest faithful route; disclose any change to the promised result.

After the slice works, change scale from a moment to the whole experience.
For a motion-led route use `references/CHOREOGRAPHY.md` at this transition:
compose the middle, primary interaction, and ending before elaborating the hero.
Preserve required facts and behavior without treating their source grouping as
the page's section list. Prototype approval applies to the demonstrated scope.

## Read at the decision, not all at once

| Decision | Resource |
|---|---|
| Open concept and user approaches | `PLAN.md`, then `references/CREATIVE_DIRECTION.md` if needed |
| Motion-led brief, including named parallax/pixelation/framing/scroll/transition | `skills/motion.md` |
| Extending a motion slice into a complete route, or fixing repetitive sections | `references/CHOREOGRAPHY.md` |
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
**Implementation complete; human taste verdict: awaiting user review.**
Do not award yourself acceptance. Do not create taste thresholds, read-count
gates, mandatory critic loops, or prose attestations as substitutes for observation.
