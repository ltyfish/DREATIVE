---
name: dreative
description: Design and ship a distinctive, usable frontend through concise planning, real implementation, and full-page browser refinement.
---

# Dreative

Dreative is a frontend design skill. Its job is to improve the user's product,
not to operate Dreative itself.

## Hard boundary

Never open, navigate to, or inspect the optional Dreative editor at
`http://localhost:4820` during frontend work. Never run `dreative start` or
`dreative start-editor` unless the user explicitly asks for the editor.
`dreative` without a command prints a planning brief and does not start a
server.

## Default workflow

1. Inspect the real repository before proposing a direction: framework, routes,
   content, working behavior, assets, dependencies, current visual equity, and
   obvious defects.
2. Read `PLAN.md`. If the user already chose an approach or clearly asked the
   agent to use its judgment, select the matching approach and proceed. For an
   open-ended redesign, show three project-specific directions—Recommended,
   Efficient, and Showcase—and wait for one choice. After selection, show the
   compact configuration choices from `PLAN.md`: review depth, references,
   sources, packages, and prototype policy, each with recommendations adapted
   to the selected direction. If the user asks for `show detailed plan`, expand
   that direction into the project-specific Creative Decision Brief in
   `PLAN.md`.
3. State the selected concept in a compact implementation note: one named
   direction, why it fits, the main visual idea, and the most important
   preserved behavior. This is the only approval boundary.
4. Build in the real application. Preserve content and functions unless the
   user asked to change them. Fix existing defects encountered in the scoped
   experience, including broken routes and mojibake/encoding errors.
5. Inspect the entire page in the browser at desktop (normally 1440px) and
   mobile (normally 390px), not only the hero. Exercise the primary journey and
   important interactions. Inspect 320px when the product targets narrow phones
   or when the 390px pass shows density risk.
6. Critique the rendered product, correct visible failures, and repeat a
   focused browser pass. Stop adding mechanisms once the concept is complete.
7. Run the production build plus available type, test, and lint scripts. For
   any substantial redesign, run `dreative finalize --codex`; completion
   requires `DREATIVE_FINALIZED`.

## Planning behavior

- The direction step contains exactly Recommended, Efficient, and Showcase.
- Recommended is whatever direction the agent judges best for the inspected
  project. Its default configuration is Lean, Prototype=Auto, best-fit sources,
  relevant references, and focused package installation.
- Efficient is the most token- and implementation-efficient direction. Its
  defaults are Fast, Prototype=Skip, supplied references/existing assets, and
  the existing stack.
- Showcase is the absolute highest creative and technical ceiling. It uses all
  ten treatments and defaults to Full Audit, Prototype=Required, strong
  supplied/scouted references, maximum useful sourced/generated media, and
  package installation. Integrate every treatment into one hierarchy rather
  than stacking unrelated effects.
- The compact configuration step always lets the user override Fast/Lean/Full
  Audit, reference strategy, sources, packages, and prototype policy.
- `show detailed plan` produces a complete, adaptive Creative Decision Brief
  for the selected direction. It shows the agent's decisions rather than a
  generic questionnaire. The user may edit the final decision reply.
- Ask only about a missing decision that would materially change the product.
  Detect everything else from the repository.
- Do not require `.dreative/plan.yaml`, treatment-by-treatment approval,
  approval hashes, attestations, independent critics, provenance theater, or
  repeated reapproval.

## Product-quality rules

### One coherent idea

Choose a content-specific concept that can be recognized after the hero is
removed. Carry it through typography, composition, color/material, imagery,
interaction, and section rhythm. A repeated badge, grid line, canvas, or
background color is not continuity by itself.

### Restraint before machinery

Use the smallest technical system that produces the intended experience.
CSS and native scrolling are preferred for ordinary layout and transitions.
Use GSAP for choreography that needs sequencing, scrubbing, pinning, or
reversibility. Use Lenis only when interpolated scroll behavior is part of the
concept. Use Three.js/OGL only when spatial behavior materially improves
meaning or product understanding. Vanta-like atmosphere is a principle, not a
reason to add a generic shader background.

Recommended work usually has one signature mechanism. Showcase work integrates
the required treatments through a small number of complementary signatures.
Never stack GSAP, Lenis, WebGL, telemetry, and custom interaction merely to
signal ambition.

### Full-page quality

The hero must not consume all design effort. Every major section needs a clear
job, readable hierarchy, intentional spacing, and an authored transition from
the previous section. Alternate density and rest. Keep the primary task easy to
find.

Reject:

- tiny decorative text used where users need readable content;
- empty viewport-sized gaps without narrative or functional purpose;
- persistent overlays, canvases, telemetry, or labels covering content;
- clipped controls, awkward sticky releases, and mobile desktop-shrinkage;
- repeated generic cards or fade-up sections presented as a system;
- advanced effects that are more visible than the product;
- placeholder assets, repeated imagery, broken glyphs, or fabricated claims.

### Mobile is a composition

At 390px, reconsider order, crop, density, type scale, controls, sticky
behavior, and motion. Do not merely stack desktop columns. Persistent desktop
ornament should usually become inline, bounded, or absent when it competes
with content. Touch targets, keyboard behavior, reduced motion, and readable
text remain required.

### Visual review

Review screenshots and live behavior section by section. Ask:

1. Is the concept visible without an explanation?
2. Does every section remain legible and composed at its actual viewport?
3. Do motion and interaction clarify state rather than decorate it?
4. Are there collisions, clipping, overflow, dead space, or weak handoffs?
5. Does mobile feel intentionally designed?
6. Are text, prices, routes, forms, and visible claims correct?

A successful build is not a visual pass. A checklist file is not evidence of
quality. Fix what is visible.

## Progressive references

- Read `references/CREATIVE_EXECUTION.md` before adding an advanced runtime.
- Read the relevant `skills/<name>.md` only when that specialty materially
  serves the chosen concept.
- Read one matching recipe only after choosing the mechanism.
- Use `llms.txt` or `dreative catalogue` as a focused lookup, never as a
  component menu.

Specialties: `ux`, `mobile`, `refined`, `motion`, `interaction`, `media`, `3d`,
`immersive`, `cinematic`, `experimental`.
