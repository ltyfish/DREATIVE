# Planning protocol

The canonical plan is `.dreative/plan.yaml`. Do not keep a synchronized
`plan.json`; JSON is export or migration input only.

## Intake before concept planning

A user-facing task is interactive. Auto-detect reliable facts from the prompt
and repository, then ask only for unresolved material information. Plain text is
enough when a structured question tool is unavailable. Never silently default
Ambition, Execution, Prototype or Purpose for a substantial user-facing run.
Non-interactive automation must supply all four explicitly in
`contract.workflow`.

Present these choices exactly:

Ambition:

- Standard — strong professional design with restrained originality.
- Expressive — visibly authored composition with purposeful motion and interaction.
- Award — a distinctive experience with structural or transformational motion,
  media or spatial behaviour.
- Experimental — Award-level foundations plus a small number of unconventional
  provocations and higher creative variance.

Execution:

- Fast — smallest safe workflow for early work.
- Lean (Recommended) — recommended quality workflow.
- Full Audit — broader traceability, performance and certification evidence.
  Full Audit controls evidence, not visual ambition.

Prototype:

- Skip — build directly.
- Auto (Recommended) — prototype only uncertain mechanisms.
- Required — prototype the most technically uncertain mechanism before integration.

Purpose:

- Project Delivery (Recommended)
- Production Certification
- Dreative Dogfood

Do not ask again for values already supplied.

## Mandatory Creative Approval Brief

Before any contract is written, present one self-contained Creative Approval
Brief in the conversation. This is the planning deliverable the user approves;
do not scatter it across several messages and do not make the user inspect raw
YAML to understand the proposal.

The brief must use this order and contain every block:

1. **Reset/staleness note when applicable.** State whether an existing plan
   belongs to the current source and task. Never reuse a stale direction.
2. **Recommended direction.** Give the concept a memorable name and describe
   its content-specific visual system, palette/materials, typography character,
   media language, interaction/motion idea and why it fits the inspected
   product. This must be a real proposal, not a list of adjectives.
3. **Workflow choices.** Show all canonical Ambition, Execution, Prototype and
   Purpose alternatives. Mark exactly one recommendation in each group and
   briefly explain any recommendation that is not the normal Expressive, Lean,
   Auto, Project Delivery baseline. Recommendations are not selections.
4. **Complete treatment review.** Show UX, Mobile, Refined, Motion,
   Interaction, Media, 3D, Immersive, Cinematic and Experimental in one
   scannable table or equally explicit structure. Every row must state:
   proposed select/decline/foundation status; substantive delivery threshold;
   concrete project sections; dependencies or ownership tension; cost and
   mobile/performance/accessibility risk; and what would be insufficient.
5. **Experience allocation.** Name every major section in route order, assign
   Peak, Transformation, Preparation, Echo, Rest, Resolution or Functional
   Utility, allocate primary/supporting treatments and name the continuity
   owner. Identify at least one post-hero peak for Expressive, Award or
   Experimental proposals and state the hero-removed test result.
6. **Capability and source preflight.** Separately report package-installation
   permission; detected runtime/browser capability; references; generated and
   sourced images; generated and sourced video; 3D assets/props; supplied
   assets; and missing assets. Use `unresolved` when unanswered. Permission
   never proves capability.
7. **Delivery risks and fallbacks.** Name the important mechanism risks,
   performance/mobile/reduced-motion implications and any proposed fallback.
   A fallback is a proposal requiring approval, not a silent downgrade.
8. **One-line approval reply.** End with one copyable line containing workflow,
   selected treatments, direction, package permission, each image/video source
   policy, 3D policy and reference-reuse decision. Tell the user they may edit
   any phrase.

The first approval request is invalid if it only asks questions, only lists
workflow controls, only describes selected treatments, omits declined
treatments, uses generic section names without allocation, or says "details are
in `.dreative/plan.yaml`". A compact answer is acceptable only after the full
brief has been shown in the same approval cycle.

The complete ten-treatment review must include proposed section allocation,
ownership overlaps and tensions, plus a creative capability preflight.
Unresolved permissions are reported as unresolved rather than denied. The same
intake explicitly asks for package-installation permission; permission and
detected capability are never collapsed into one state.

Resolve repository root, preview URL or command, routes and scope, required
workflows, preserved content/brand, supplied and missing assets, installation
permission, media permission, priority devices, minimum mobile width,
performance constraints, references/anti-references and user-language success
criteria. Do not implement while target or scope is materially ambiguous.

Ask the creative-source questions separately rather than collapsing them into
one media switch:

- Does the user have reference URLs/files, have no references, or want suggested
  directions? Record provided references and anti-references.
- May generated images be used: allowed, not allowed, or ask per asset?
- May externally sourced/licensed images be used: allowed, not allowed, or ask
  per asset?
- May generated video be used: allowed, not allowed, or ask per asset?
- May externally sourced/licensed video be used: allowed, not allowed, or ask
  per asset?
- What is the 3D asset/prop policy: not allowed, supplied only, external
  sourcing allowed, generation and sourcing allowed, or ask per asset?
- Record supplied image, video and 3D assets separately and name known missing
  or needed assets.

## Contract and approval

`contract` is user-editable and contains target/scope, workflow, transformation
depth, treatments, priority/allocation, preservation, concept, blueprint,
experience arc, subject/prop/material inventory, typed mechanisms, executable
requirement actions/assertions, motion/media, mobile, functional truth,
performance and acceptance criteria.

`approval` hashes only `contract`. `execution` may change without invalidating
that hash. After planning, show a concise summary, point to
`.dreative/plan.yaml`, and wait for approval before substantial source edits.

Material edits require a same-file change request describing reason,
consequence and alternative. They invalidate approval until approved again.

Approval provenance is host-neutral. Prefer an immutable host event ID plus
exact-content hash, then a signed record, then an optional prompt file with its
original-byte hash. A CLI/TTY record remains `user-origin-unverified`. Every
record declares `local`, `host-attested` or `externally-attested`; ordinary
local files never claim independence.

## Prototype and concept checkpoint

A mechanism prototype proves technical feasibility only. It does not approve
the concept, visual quality, page-wide motion, treatment coverage, mobile
composition or experience arc.

Award, Experimental, Full Audit Dogfood and explicit all-treatment work require
a real application vertical slice: actual hero, one downstream section, real
visual system, defining temporal/media idea, 390px composition and reduced
motion. A user or qualifying context-isolated critic must approve it before system-wide spread.

## Canonical v9 planning and lifecycle rules

For substantial work, no contract may be written until `--treatments` is supplied.
The review always shows UX, Mobile, Refined, Motion, Interaction, Media, 3D,
Immersive, Cinematic and Experimental with selected/declined state. UX and
Mobile become foundational only after the optional-treatment decision.

Connected capabilities may be supplied with
`--capabilities-file .dreative/capabilities.json` or repeatable
`--capability id=state`. Permission alone records
`permitted-but-tool-unverified`; it never records sourcing or authoring as
available. Canvas and WebGL start as `expected-browser-api-unverified`.

The v9 contract stores intent only. Mechanism status, prototype results,
sourcing attempts, generated files, browser observations, asset survival,
critic findings and verification evidence belong under `execution`. Normal
execution updates therefore do not change the approved contract hash.

Use `plan inspect-missing`, `plan set`, `plan add-section`,
`plan add-mechanism`, `plan add-subject` and `plan add-requirement` to author a
compact contract without inspecting compiled internals. Stable IDs are
generated when omitted. Validation reports missing executable structures; it
does not blacklist aesthetic words.

Final verification runs the configured production build and preview, then binds
contract, source, package, lockfile, public assets, build output, route,
viewport, DPR and browser observations. Changes invalidate incompatible
verification, critic and certification records rather than permanently
rejecting the project.

Runtime verification establishes DOM/state changes, forms, navigation,
requests, media decode, canvas/WebGL output change, mobile/reduced-motion and
non-hero coverage. The critic decides semantic resemblance, coherence,
authorship, narrative continuity and ambition quality. A technical pixel or
transform difference is never itself a perceptual pass.

Tiny maintenance exemption: `--tiny` is only for a narrow, non-creative repair
that does not alter visual direction, treatment allocation, media strategy,
section structure or interaction behavior. It may use UX and Mobile foundations
without a full optional-treatment intake. Any substantial redesign, new visual
system, new section, new mechanism or media change must use explicit treatment
selection.

Resolve package installation separately from creative asset permissions. Run
capability preflight and report runtime libraries, FFmpeg/Sharp, browser
verification, search/sourcing, image/video generation and editing, 3D
sourcing/generation/authoring, screenshot capture and automation independently.

Allocate treatments to concrete sections as primary, supporting or foundation,
and as peak, connective tissue or foundation. Name one continuity owner when
Immersive or Cinematic is selected.

Experimental and all-treatment Full Audit/Dogfood may prototype up to three
materially different unresolved risk families. Fast normally prototypes none;
Lean Auto selects one; Required selects high-risk families up to three. Record
exactly what each probe proves and does not prove.

After spread, validate current desktop/mobile route captures,
start/active/resolved peak evidence, planned-versus-observed mechanisms,
fallback disclosure, section-role coverage and source/run identity. Add one
representative continuity recording only when static evidence cannot prove the
mechanism. Reverse evidence is only for promised reversibility, pin release or
lifecycle risk.

## Runtime-grounded ambitious delivery

For Award, Experimental and explicit all-treatment work, `dreative verify`
generates typed `execution.runtimeObservations` for every important mechanism.
Each observation
names the implementation owner, source assets, mechanism family, input drivers,
honest spatial classification, mobile/reduced-motion form, performance result,
handoff architecture, recordings and controlled 0/25/50/75/100 samples.
Samples include current-build artifact/composition hashes, observed runtime
properties and, where applicable, frame/video time, camera, uniforms, particles
or masks plus pixel/structural difference measurements.

Free-form `transformations`, `sceneHandoffs`, `motionVocabulary`,
`treatmentObservations` and similar notes explain evidence but cannot satisfy a
gate. Ambitious delivery fails when it is a mostly static stack, lacks two
substantial post-hero mechanisms, disables defining mobile behavior, or relies
on ordinary controls and a rigid textured plane.

Capability and ambition prototypes are separate. Capability proves the API or
mechanism works. Ambition proves final-quality media, one complete post-hero
peak, a true asset transformation, a 10–20 second recording, desktop/mobile
authorship and fresh context-isolated criticism. Approval containing a concern is
`approved-with-required-revisions` until those revisions are recaptured.

When video is allowed and Media plus Cinematic/Experimental is selected, the
contract records one explicit decision: use video, use a frame sequence or
pre-rendered motion, or obtain an approved exemption. Missing FFmpeg with
installation permission produces an `ffmpeg-static` or equivalent install
attempt, confirmed processing-provider route, or recorded high-fidelity
fallback—not quiet omission.
