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
