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
experience arc, motion/media, mobile, functional truth, performance and
acceptance criteria.

`approval` hashes only `contract`. `execution` may change without invalidating
that hash. After planning, show a concise summary, point to
`.dreative/plan.yaml`, and wait for approval before substantial source edits.

Material edits require a same-file change request describing reason,
consequence and alternative. They invalidate approval until approved again.

## Prototype and concept checkpoint

A mechanism prototype proves technical feasibility only. It does not approve
the concept, visual quality, page-wide motion, treatment coverage, mobile
composition or experience arc.

Award, Experimental, Full Audit Dogfood and explicit all-treatment work require
a real application vertical slice: actual hero, one downstream section, real
visual system, defining temporal/media idea, 390px composition and reduced
motion. A user or independent critic must approve it before system-wide spread.

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
