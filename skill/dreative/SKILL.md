---
name: dreative
description: Frontend design skill for substantial UI work, with an optional visual round-trip editor. Use for pages, sections, redesigns, motion, media, interaction, 3D, and visual editing. Direct design is the default.
---

# Dreative

Dreative makes the coding agent responsible for design judgment, implementation,
preservation, and proof. It has no AI runtime of its own.

## 1. Choose the mode

- **Direct design (default):** plan, edit the real application, and verify it.
  No server, extraction, replica, or wireframe is involved.
- **Visual round-trip:** use only when the user explicitly asks to open Dreative
  or edit visually. Follow §8.

For a tiny isolated change, make the change directly and run the smallest useful
check. For substantial design work, follow every Direct Design step below.

## 2. Read progressively

Read this file first, then only the references selected by the plan:

1. `PLAN.md` — planning and the section blueprint.
2. `DESIGN.md` — visual doctrine and redesign/preservation rules.
3. `references/TIERS.md` — ambition-tier deliverables.
4. `references/ARTIFACTS.md` — machine-readable plan, preservation, ledger,
   and verification files.
5. `frameworks/<name>.md` — the adapter matching the repository.
6. Each selected `skills/<name>.md`, once.

Detailed doctrine belongs in those references, not in this orchestration file.

## 3. Direct Design protocol

### 3.1 Discover

- Inspect the minimum repository context needed to understand the relevant page,
  framework, styling system, routes, and available media/tooling.
- For an existing interface, create `.dreative/preservation.json` before edits.
  Include links, handlers, forms, visible copy, states, routes, analytics hooks,
  and accessibility contracts. Every item needs a stable `file` + `needle` that
  `dreative audit` can check mechanically.
- Read `.dreative/ledger.json` when it exists. Treat it as preference and failure
  history, never as proof that a new request is complete.

### 3.2 Plan

- Run `PLAN.md` and resolve the transformation depth: restyle, relayout,
  restructure, or reimagine.
- Resolve one ambition tier: solid, premium, expressive, or award.
- Explore three genuinely different concepts, commit to one, and record why the
  others were rejected.
- Run one short decision phase containing several sequential single-question
  calls. Use the environment's structured question tool when available;
  otherwise ask in chat. Do not ask about implementation details the agent can
  infer safely.
- Write `.dreative/plan.json` using `references/ARTIFACTS.md`. For multi-page
  work, show a page × skill matrix: the user can assign treatments to specific
  pages, and approve routing for selected skills left unassigned. Every section
  names its layout family, skills, assets, interactions, mobile translation,
  fallback, and verification criteria.
- Render a concise `.dreative/plan.md` for the user and for session re-entry.

The approved plan is a delivery contract. A section ends as `shipped`,
`fallback`, or `cut` with a reason—never silently omitted.

### 3.3 Select skills

Universal foundation: ux and baseline mobile apply to every web page.
Add treatments from this complete picker:

| Skill | Use it for |
| --- | --- |
| `refined` | Premium clean business, commerce, photography, and restrained motion |
| `motion` | Scroll choreography, entrances, parallax, kinetic type, and transitions |
| `interaction` | Hover craft, magnetic controls, cursor effects, and tactile feedback |
| `media` | Generated/sourced image and video production, grading, and media treatments |
| `3d` | WebGL, three.js/R3F, shaders, models, particles, and fallbacks |
| `immersive` | Persistent scenes, spatial transitions, preloaders, and scroll-as-journey |
| `cinematic` | Living surfaces, shader grading, gesture exploration, and sound |
| `experimental` | High-variance composition, material shifts, and unusual provocations |
| `ux` | Working navigation, forms, states, accessibility, and interaction audits |
| `mobile` | Mobile-native composition, touch ergonomics, and phone verification |

Skill dependencies are additive:

- All skills depend on `ux` and `mobile`.
- `immersive` depends on `motion`, `interaction`, and `media`.
- `cinematic` depends on `motion`, `interaction`, and `media`.
- `experimental` depends on `motion`, `interaction`, and `media`.

The user's selected skills are authoritative. Routing recommends placement; it
never silently activates an unselected optional skill. Explicit page assignments
always win. The planner resolves dependencies and places selected-but-unassigned
skills across suitable pages for approval. If the user selects all, every skill
must appear somewhere in the overall plan, but not on every page.

### 3.4 Build

- Prepare planned media before section implementation. Record each asset and its
  delivery status in the plan.
- Follow the chosen framework adapter and the repository's established patterns.
- Preserve the manifest unless the user explicitly approved a change; record
  approved divergence with a reason.
- Implement blueprint sections in order. Keep the machine plan status current.
- A restructure or reimagine rebuilds markup/component boundaries when necessary;
  it is not a stylesheet-only restyle.
- Every heavy effect ships with its planned reduced-motion, mobile, loading, and
  runtime fallback.

### 3.5 Craft

Run one dedicated finish pass with no new features:

- typography, wrapping, optical alignment, selection, and scrollbar;
- coherent surfaces, light direction, shadows, and material cues;
- hover, focus-visible, active, disabled, loading, empty, and error states;
- media crop, grading, dimensions, posters, and alt text;
- motion easing, choreography, intent, and reduced-motion behavior;
- responsive spacing, touch targets, overflow, and spatial integrity.

### 3.6 Verify

Verification is evidence, not prose asserting that something was checked.

1. Run the repository's targeted tests, typecheck, and build.
2. Run the page and perform the `ux` functional audit.
3. Verify desktop and approximately 390px mobile.
4. Check the console, links, forms, keyboard path, states, reduced motion,
   responsive overflow, and pointer hit areas.
5. For motion/WebGL/video, record runtime evidence and performance numbers.
6. Reconcile every plan section and asset against what visibly shipped.
7. Write `.dreative/verify.json` and run `dreative audit`.
8. Fix every error. Warnings require either a fix or a recorded justification.

The task is complete only when the plan has no `planned` sections, preservation
passes, verification contains no failing evidence, and `dreative audit` passes.

### 3.7 Learn

Append one entry to `.dreative/ledger.json` after delivery:

- chosen and rejected concepts;
- user preferences;
- treatments already used;
- runtime failures and the fallback they earned.

Use this history to avoid repetitive signatures and known-bad approaches on the
next run. Never store secrets or unrelated user information.

## 4. Ambition tiers

- **Solid (`solid`):** complete, accessible, responsive product-quality UI.
- **Premium (`premium`):** strong design read, deliberate media, signature detail, craft pass.
- **Expressive (`expressive`):** coordinated motion/interaction system with measured fallbacks.
- **Award (`award`):** distinctive spatial/media system with performance, occlusion, and
  fallback evidence.

Higher tiers inherit lower-tier requirements. Do not impose `award`-tier cost on a
solid or premium request. See `references/TIERS.md` for exact deliverables.

## 5. Preservation rules

- Preserve behavior, not necessarily placement or markup shape.
- Stable IDs, routes, handlers, form fields, visible strings, conditional states,
  analytics hooks, and accessibility labels are contractual unless approved.
- `dreative audit` checks each manifest needle after implementation.
- Intentional changes require `intentionallyChanged: true` and `changeReason`.
- A visually successful redesign that loses behavior fails.

## 6. Framework adapters

Load exactly one primary adapter from `frameworks/` plus `styling.md` when useful.
Adapters provide technical implementation guidance only; they do not override the
plan, design doctrine, preservation contract, or verification gates.

## 7. Completion report

Report:

- chosen concept, tier, depth, and skills;
- each section as shipped/fallback/cut;
- preservation result;
- tests and runtime evidence;
- known limitations and next step.

Never claim a check ran unless it actually ran.

## 8. Optional visual round-trip

Use only when explicitly requested:

1. Extract the relevant pages into `.dreative/project.json` and replica files.
2. Run `dreative baseline`.
3. Start the editor and service `dreative wait` events.
4. Supported requests are `propose-skeletons`, `propose-variants`, `edit-block`,
   `design-page`, and `edit-element`. Read `DESIGN.md` and request-selected skills
   before responding.
5. On the `finish` event, apply the compact diff to the real source using its
   source pointers, then run the same preservation and verification gates as
   Direct Design.

The editor is an optional input surface. It never weakens the Direct Design
quality, preservation, or verification contract.
