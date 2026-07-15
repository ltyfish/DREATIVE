---
name: dreative
description: Frontend design skill for substantial UI work, with an optional visual round-trip editor. Use for pages, sections, redesigns, motion, media, interaction, 3D, and visual editing. Direct design is the default.
---

# Dreative

Dreative makes the coding agent responsible for design judgment, implementation,
preservation, and visible proof. It has no AI runtime of its own.

## 1. Resolve the workflow

Keep these controls independent and record them in `plan.json`:

- ambition: `standard | expressive | award | experimental`
- execution: `fast | lean | full-audit` (default `lean`)
- prototype: `skip | auto | required` (default `auto`)
- purpose: `project-delivery | production-certification | dreative-dogfood`
  (default `project-delivery`)

Ambition controls visible originality and transformation. Execution controls
process and evidence. Prototype controls only isolated feasibility work. Purpose
controls why evidence is collected. Award + Lean + Skip is valid.

During interactive planning, ask the user to choose execution, prototype, and
purpose when they are not already specified. Present Lean, Auto, and Project
Delivery as recommended, and explain that Auto is usually better because it
prototypes only when technical risk makes the extra work useful. Preserve the
user's choices in `plan.configuration`. Use `dreative config` defaults in
non-interactive environments; never block automation waiting for answers. Tiny
isolated changes can go straight to implementation and the smallest relevant
check.

## 2. Read progressively

Read `PLAN.md` and `DESIGN.md`, then only the framework adapter and specialist
skills selected by the plan. Use recipes only for a plausible mechanism that
needs feasibility, implementation, performance, fallback, or repair guidance.
Do not load catalogs to inflate exploration.

## 3. Direct design protocol

### Discover and plan

- Inspect only the relevant routes, workflows, current desktop/mobile output,
  product familiarity, brand equity, weaknesses, and available media/tooling.
- Keep preservation decisions, selected concept, art direction, motion/media,
  mobile interpretation, prototype decision, verification needs, and risks in
  canonical `.dreative/plan.json`.
- Preserve routes, handlers, forms, data behavior, authentication, accessibility,
  and valuable brand/product familiarity. Redesign weak grids, typography,
  spacing, ordering, and mobile composition rather than preserving them blindly.
- Expressive, Award, and Experimental work may explore up to three concise
  overall concepts. Do not repeat three-way exploration for each small effect.
- Resolve restyle, relayout, restructure, or reimagine independently from
  ambition. Higher ambition never enables Full Audit or a prototype by itself.
- Record a compact approved concept and implementation-ready page/section
  blueprint. Do not store verbatim conversations, skipped questions, repeated
  rationales, or parallel Markdown sources of truth.

### Prototype routing

- `skip`: implement directly in production.
- `auto`: prototype only unfamiliar or risky Canvas/WebGL, reconstruction,
  sequence, physics, pinned-scroll, image-processing, compatibility, or
  performance mechanisms.
- `required`: test only the uncertain mechanism, then integrate it or remove the
  obsolete experiment.

Skipping a prototype does not lower ambition. Never duplicate the full site as a
prototype.

### Build and craft

- Implement the real application from the selected concept and section
  blueprints. Preserve functional contracts while allowing structural redesign.
- Concentrate unusual motion into a few meaningful moments with a beginning,
  transformation, resolution, mobile interpretation, and reduced-motion state.
  Avoid repeated fade-ups, generic parallax, constant floating, and quota motion.
- Treat source images as production material. For media-led Expressive, Award,
  or Experimental work, ship one Signature Media Production Package unless the
  concept has a concise, concept-specific exemption.
- A package may be layered subject, depth-separated, fragment reconstruction,
  tile atlas, generated states, frame sequence, Canvas, WebGL, editorial cut-up,
  or clean plate. Derivatives or stateful media must exist, load in production,
  be visibly consumed, independently control internal content, and include
  mobile, reduced-motion, and risk-appropriate performance safeguards.
- One flat image with scale, translation, clip-path, parallax, gradient, noise,
  or unrelated fragments is basic image animation, not substantive media.
- Run one finish pass for typography, optical alignment, surfaces, states,
  media crop/edges, motion pacing, touch targets, overflow, and accessibility.

### Critic and correction

Lean uses one independent critic after the complete build and craft pass. Store
objective input and report together in `.dreative/critic.json`; exclude builder
rationale from the first reading. Correct blockers, major issues, and high-value
minor issues. Run a follow-up critic only after a blocker, major visual rework,
explicit certification need, Dogfood evaluation, or user request. Minor polish
does not trigger another critic, and a clean pass does not require arbitrary
refinement. Fast may skip the critic.

### Verify

- Run relevant tests, typecheck/lint/build, functional checks, and runtime visual
  inspection. Never claim a check that did not run.
- Lean normally verifies representative desktop and ~390px mobile. Add 320px
  only for identified narrow-width risk; Full Audit or Dogfood may broaden it.
- Select evidence by interaction type: static final desktop/mobile; simple
  motion start/mid/end; layered media resting/active/resolved plus fallbacks;
  pinned sections entry/mid/exit/release; sequences early/mid/final/loading;
  Canvas/WebGL active states, resize/fallbacks, and performance only when risky.
- Verify reduced motion whenever signature motion is central. Mobile must
  recompose the concept rather than merely stack desktop blocks.
- Store canonical evidence in `.dreative/verify.json` and run `dreative audit`.
  Documentation never substitutes for shipped behavior or visible output.

## 4. Artifact policy

- Fast: `plan.json`, `verify.json`.
- Lean: `plan.json`, `critic.json`, `verify.json`.
- Full Audit may add `preservation.json`, `ledger.json`, and
  `certification.json` when consumed.
- Dreative Dogfood may add behavioral/doctrine/regression evidence. It is not a
  synonym for production certification and never runs by default.

Human-readable summaries are generated from canonical JSON; do not maintain
`plan.md` or `verify.md` in parallel. An artifact without a consumer should not
exist.

## 5. Ambition and selected skills

Universal foundation: ux and baseline mobile apply to every web page.
Ambition remains a visual-quality control. Existing `solid`/`premium` plans map
to Standard; `expressive` and `award` retain their meaning; Experimental is an
independent new option. Universal `ux` and `mobile` foundations apply. Add only
the selected `refined`, `motion`, `interaction`, `media`, `3d`, `immersive`,
`cinematic`, or `experimental` treatments and their dependencies.

## 6. Optional visual round-trip

Use only when the user explicitly asks to open Dreative or edit visually:

1. Extract relevant pages into `.dreative/project.json` and replica files.
2. Run `dreative baseline`, start the editor, and service `dreative wait` events.
3. Apply the finish diff to real source through its source pointers.
4. Run the same resolved preservation and verification policy as direct design.

The editor is an input surface, not a weaker execution mode.
