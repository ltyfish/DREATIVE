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
5. `references/RULES.json` and `references/REFLEX_FONTS.json` — rule categories,
   failure history, bounded substitutions, and reflex font choices.
6. `frameworks/<name>.md` — the adapter matching the repository.
7. Each selected `skills/<name>.md`, once.
8. Only after three original concepts are recorded, load the relevant
   `recipes/<name>-recipes.md` for feasibility, implementation, performance,
   fallback selection, or repair of a weak concept.

Detailed doctrine belongs in those references, not in this orchestration file.
After approval, execute from `plan.executionBrief`, referenced preservation/
equity contracts, selected specialist rules, and section blueprints. Treat the
larger doctrine as lookup material instead of reloading every file into the
implementation context.

## 3. Direct Design protocol

### 3.1 Discover

- Inspect the minimum repository context needed to understand the relevant page,
  framework, styling system, routes, and available media/tooling.
- For an existing interface, create `.dreative/preservation.json` before edits.
  Include links, handlers, forms, visible copy, states, routes, analytics hooks,
  and accessibility contracts. Every item needs a stable `file` + `needle` that
  `dreative audit` can check mechanically.
- Render the existing interface at desktop and mobile and create
  `.dreative/design-equity.json`. Record baseline quality, typography, color and
  material, composition, pacing, signature elements, interaction/motion, mobile
  behavior, and a preserve/transform/surpass/intentionally-remove decision for
  every valuable quality.
- Read `.dreative/ledger.json` when it exists. Treat it as preference and failure
  history, never as proof that a new request is complete.

### 3.2 Plan

- Run `PLAN.md` and resolve the transformation depth: restyle, relayout,
  restructure, or reimagine.
- Resolve one ambition tier: solid, premium, expressive, or award.
- Explore three genuinely different concepts, commit to one, and record why the
  others were rejected.
- Classify important rules through `references/RULES.json`: hard gates are
  absolute; evidence-backed defaults remain the proven remedy; creative
  provocations influence exploration rather than becoming shipment quotas.
- Follow the proven default, or outperform it with a named alternative,
  measurable success criteria, and runtime evidence. Any substitution is
  declared before `implementationStartedAt` in `ruleExceptions`; hard gates
  cannot be substituted.
- Run one short decision phase containing several sequential single-question
  calls. Use the environment's structured question tool when available;
  otherwise ask in chat. Do not ask about implementation details the agent can
  infer safely.
- Substantial from-scratch work requires concept-direction and final-plan
  approval. A redesign also requires baseline/design-equity confirmation. “Use
  your judgment,” “just start,” and similar authority grant recommendation
  freedom, not permission to skip these approvals.
- Write `.dreative/plan.json` using `references/ARTIFACTS.md`. For multi-page
  work, show a page × skill matrix: the user can assign treatments to specific
  pages, and approve routing for selected skills left unassigned. Every section
  names its layout family, skills, assets, interactions, mobile translation,
  fallback, and verification criteria. Expressive/award plans also include a
  motion treatment for every major section: static composition, start/end
  states, changes, pins, handoff, purpose, mechanism, mobile translation, and
  reduced-motion state.
- For every existing page, record its register, source strategy, concrete
  existing-versus-proposed structural delta, page-level mobile blueprint, and
  typed verification criteria. `restyle` uses `patch`, `relayout` uses
  `recompose`, and `restructure`/`reimagine` use `rebuild-from-contracts`.
  Expressive/award pages also need a content/state-specific expression contract
  or a documented intentional-calm rationale. Record project coherence without
  repeating one branded shell across unlike page registers.
- For restructure/reimagine, design a from-scratch counterfactual using only the
  brand, purpose, content, audience, assets, and register; select the strongest
  concept, then reconcile function and design equity without weakening it.
  Record the creative-parity contract, section visual blueprints, common-pattern
  risk review, approval record, and compact execution brief in plan v4.
- Render a concise `.dreative/plan.md` for the user and for session re-entry.

The approved plan is a delivery contract. A section ends as `shipped`,
`fallback`, or `cut` with a reason—never silently omitted.

At `expressive` and `award`, choose one coherent quality path: `diversity`
(several concept-related mechanisms/drivers) or `development` (one signature
mechanism evolving through materially different roles with quiet support).
Allocate a contextual motion-complexity budget: concentrate effort into a small
number of hero moments, name calm sections, and run the anti-default review.
Do not satisfy ambition through mechanism quotas. Experimental work explores one
non-obvious candidate per major section, then selects only the strongest two or
three to ship.

### 3.3 Select skills

Universal foundation: ux and baseline mobile apply to every web page.
Add treatments from this complete picker:

| Skill | Use it for |
| --- | --- |
| `refined` | Finish, material, spacing, and craft discipline independent of motion ambition |
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

- Prepare planned media before section implementation. Treat generated stills as
  raw material: decide whether each asset stays flat or needs cutouts, depth
  layers, masks, fragments, variants, maps, or a frame sequence. Record the
  decision, derivatives, rationale, and delivery status in the plan.
- Follow the chosen framework adapter and the repository's established patterns.
- Preserve the manifest unless the user explicitly approved a change; record
  approved divergence with a reason.
- Implement blueprint sections in order. Keep the machine plan status current.
- Do not open recipe catalogs before `conceptExploration` records three
  brand-native concepts. Record every recipe file and load time in `recipeAccess`.
- A restructure or reimagine creates the new blueprint independently, uses old
  DOM only as a non-binding implementation reference, and then reconciles
  behavior, content, preservation, and valuable design equity.
  It is not a stylesheet-only restyle.
- After the first viewport, one representative core section, desktop/mobile
  translations, and primary motion language exist, stop expansion. Capture
  baseline/current screenshots, critique perceptual quality, refine meaningful
  weaknesses, write `.dreative/checkpoint.json`, and obtain user approval before
  spreading the system. Straight-to-build does not skip this checkpoint.
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
3. Verify desktop (approximately 1280/1440px), 390×844 mobile, and a 320px
   narrow-mobile fallback for every important page.
4. Check the console, links, forms, keyboard path, states, reduced motion,
   responsive overflow, and pointer hit areas.
5. For motion/WebGL/video, record runtime evidence and performance numbers.
   Capture initial, early, mid-transition, final, handoff, mobile, and
   reduced-motion states; add pinned midpoint/exit states when pinning exists.
6. Reconcile every plan section and asset against what visibly shipped.
7. At expressive/award, visually inspect the captured states, make at least one
   refinement to timing, composition, readability, or continuity, and record it.
8. For redesigns, compare actual baseline and final screenshots across
   distinctiveness, hierarchy, typography, color/material identity, authorship,
   brand specificity, motion/interaction, responsive quality, design-equity
   retention, concept fidelity, and generic-template risk. Refine every genuine
   weakness or record explicit approval.
9. Write `.dreative/verify.json` v3. Associate each row to a typed criterion,
   page/section, evidence kind, viewport class, and artifact/test. Run
   `dreative audit`.
10. Fix every error. Warnings require either a fix or a recorded justification.

Every evidence-backed substitution references passing evidence IDs whose proof
meets its declared success criteria. Vague reasons such as "it did not fit",
"restraint", "felt better", or "3D was unnecessary" fail audit.

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
