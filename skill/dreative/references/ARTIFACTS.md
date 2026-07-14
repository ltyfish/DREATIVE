# Direct Design artifacts

Use JSON as the machine source of truth and Markdown only as its readable view.
All paths are relative to the target project.

## `.dreative/plan.json`

Required top-level fields:

- `version: 5`, `doctrineVersion: 5`. Legacy v2-v4 plans remain readable only
  for compatibility and receive a migration warning; they do not satisfy v5
  independent-critic, approval, equity, checkpoint, or comparison gates.
- `scope`: `tiny | substantial`; `projectKind`: `from-scratch | redesign`
- `approval`: status/timestamp, transcript references, approved concept, depth,
  tier/treatments, recommendation choice, and sequential decisions
- `request`, `createdAt`
- `tier`: `solid | premium | expressive | award`
- `depth`: `restyle | relayout | restructure | reimagine`
- `skills`: user-approved, dependency-resolved pool including `ux` and `mobile`
- `skillPolicy`: hybrid routing policy, global foundations, explicit user page
  assignments, and `routingApproved: true`
- `designRead`: `{ register, concept, signature }`
- `coherence`: global visual/interaction languages, shared primitives,
  page-specific register/task models, continuity, and prohibited repeated shells
- `preservationManifest`: normally `.dreative/preservation.json`
- `decisionLedger`: normally `.dreative/ledger.json`
- `pages`: ordered pages, each with its assigned skills and delivery sections
- `implementationStartedAt`: timestamp used to prove rule substitutions were
  declared during planning and implementation followed final approval
- `designEquity` for redesigns; `checkpoint` and `creativeParity` for
  restructure/reimagine; `executionBrief`, `commonPatternReview`, and concrete
  section `visualBlueprint` for substantial work; `executionBrief` also carries
  `criticRequirement` so the independent stage cannot disappear during build
- `criticInput` and `visualCritic` for every substantial run
- `ruleExceptions`: bounded substitutions of evidence-backed defaults
- `creativeStrategy`: `diversity` or `development` at expressive/award tiers
- `motionComplexityBudget`: hero moments, calm sections, shared language,
  device limits, progressive enhancement, and anti-default review
- `fontDecision`: candidates, reflex markers, ledger history, and justification
- `experimentalPlan`: per-section candidates and the selected two or three peaks
- `conceptExploration` and `recipeAccess`: proof recipes were loaded only after
  original concepts were recorded

Every selected skill must appear on at least one page. Every page includes `ux`
and `mobile`, but optional treatments are assigned only where they serve that
page. A section may use only skills assigned to its parent page. Each page also
requires `register`, the depth-derived `sourceStrategy`, a concrete
`structuralDelta`, and a page-level `mobileBlueprint`. Expressive/award pages
require an `expression` contract or `intentionalCalm`; at least one page across
the product must carry authored expression.

Each section requires `id`, `name`, `layoutFamily`, `skills`, `interactions`,
`mobile`, `fallback`, typed `verification`, `assets`, and `status`. Verification
criteria include a stable id, claim, evidence kind, page/section, and required
viewport classes. At expressive/
award it also requires `motionTreatment`: class, static composition, start/end
states, changes, pins, handoff, purpose, mechanism, mobile, and reduced motion. Status is
`planned | shipped | fallback | cut`; fallback/cut requires `reason`.

Each asset requires `id`, `path`, `purpose`, `importance`, `preparation`, and
`status`. Preparation records flat/decompose/variants/sequence, named
derivatives, and rationale. A shipped asset must exist when `dreative audit` runs.

### Routing authority

The user's selection is authoritative. Routing may place selected-but-unassigned
skills and suggest additional treatments, but it never activates an unselected
optional skill. Explicit page assignments always win. If the user selects all,
all ten skills appear in the overall plan; this does not mean all ten belong on
every page. Show the proposed page matrix and obtain approval before setting
`routingApproved: true`.

## Rule substitutions

Rules live in `references/RULES.json`. Hard gates cannot appear in
`ruleExceptions`. A valid substitution includes the registered `ruleId`,
`decision: "substituted"`, planning timestamp, specific reason, concrete
alternative, at least two observable success criteria, and passing verification
evidence IDs. The exception must predate `implementationStartedAt`.

```json
{
  "ruleId": "media.keyAssetTreatment",
  "decision": "substituted",
  "declaredAt": "2026-01-01T00:30:00.000Z",
  "reason": "The archive contains no raster key imagery, so inventing photography would misrepresent the supplied material.",
  "alternative": "A persistent variable-type specimen becomes index, spatial architecture, and interactive control.",
  "successCriteria": [
    "The specimen appears in materially different structural roles",
    "Pointer and scroll input visibly reshape the specimen"
  ],
  "evidenceIds": ["type-system-desktop", "type-system-mobile"]
}
```

## Creative strategy and experimental hierarchy

At `expressive` and `award`, `creativeStrategy.path` is either:

- `diversity`: the concept-related mechanisms and drivers the experience needs;
  or
- `development`: one named mechanism with materially different states and
  quieter support.

`motionComplexityBudget` concentrates complexity into one to three hero moments
(normally two or three; one for a short page), names calm sections and the
shared language, and records the anti-default review. It is contextual, not a
mechanism quota.

When `experimental` is selected, `experimentalPlan` records one candidate for
every major section and marks only two or three as selected. Other sections
support, rest, contrast, prepare, or transform those peaks.

## Font decision

`fontDecision` records at least three candidates, identifies reflex fonts using
`references/REFLEX_FONTS.json`, and includes the last three display fonts from
the ledger. A reflex winner needs a specific brand/metrics/product/reference/
language/variable-font/performance reason, recorded in `reasonKinds` using a
category from the registry. Repeating a recent display font needs an additional
`repeatJustification`.

## `.dreative/preservation.json`

```json
{
  "version": 1,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "items": [
    {
      "id": "nav-pricing",
      "kind": "link",
      "file": "src/components/Nav.tsx",
      "needle": "href=\"/pricing\"",
      "purpose": "Primary pricing navigation"
    }
  ]
}
```

Allowed kinds: `link`, `handler`, `form-field`, `visible-copy`, `state`,
`analytics-hook`, `accessibility`, `route`. Intentional changes add
`intentionallyChanged: true` and a non-empty `changeReason`.

## Independent critic artifacts

`.dreative/critic-input.json` follows `schemas/critic-input.schema.json`. It is
the critic's complete first-pass context: original brief, constraints, approved
concept/blueprints/signature, optional baseline, final desktop/mobile evidence,
and interactive evidence when available. Its closed schema excludes builder
self-review, implementation rationale, quality claims, difficulty excuses, and
scores. `dreative critic-prompt` renders the isolated prompt for a fresh
subagent/context; where unavailable, record the best-effort isolation honestly.

`.dreative/visual-critic.json` follows `schemas/visual-critic.schema.json`. It
records review context, the independent reading made before builder context,
one of `PASS | PASS AFTER REVISION | MAJOR REVISION REQUIRED | INSUFFICIENT
EVIDENCE`, evidence-grounded findings, baseline/concept/mobile/motion findings,
at most five required revisions, separate non-blocking experiments, one
evidence-backed revision iteration, and dogfood observations. Experiments cannot
block. Missing techniques cannot block. Static screenshots cannot support strong
motion conclusions. Audit rejects non-passing verdicts and unresolved blockers.

This first version is intentionally small and fallible. It judges visible and
experiential outcomes, not implementation technologies. Dogfood evidence—not
the critic's authority—decides future expansion.

## `.dreative/verify.json`

Schema: `schemas/verify.schema.json`.

```json
{
  "version": 3,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "evidence": [
    {
      "id": "mobile-nav",
      "criterion": "Mobile navigation opens and closes",
      "kind": "interaction",
      "criterionId": "navigation-mobile",
      "pageId": "home",
      "sectionId": "navigation",
      "viewportClass": "mobile",
      "status": "pass",
      "evidence": "Escape closes and focus returns to trigger",
      "proof": {
        "timestamp": "2026-01-01T00:00:00.000Z",
        "artifactPath": ".dreative/screenshots/mobile-nav.png",
        "viewport": { "width": 390, "height": 844, "dpr": 2 },
        "testedUrl": "http://localhost:3000",
        "consoleErrorCount": 0,
        "playwrightTestId": "navigation closes with Escape"
      }
    }
  ]
}
```

Every evidence row is joined to its planned criterion by id, page, section,
evidence kind, and viewport class. Every important page requires desktop
(approximately 1280/1440px), mobile (approximately 390×844), and narrow-mobile
(approximately 320px) evidence; deep redesigns also require structural-depth
evidence and every page requires preservation evidence. Every row requires a timestamp and concrete proof: an existing artifact
path, command + exit code, tested URL/console count, FPS/frame-time measurement,
or Playwright test identifier. `dreative audit` checks referenced artifact paths
and rejects passing commands with nonzero exits or passing runs with console
errors. `fail` blocks completion. Use `not-applicable` only with a concrete
explanation and proof of why the criterion does not apply.

For expressive/award motion, tag evidence with `timelineState`: initial, early,
mid-transition, final, handoff, mobile, and reduced-motion; add pinned midpoint
and exit states when relevant. Record the post-inspection refinement in
`refinement` with findings, changes, and passing evidence IDs.

Redesign verification adds `design-equity`, `concept-fidelity`,
`perceptual-comparison`, and `visual-regression` evidence plus a grounded
`perceptualComparison`. It references baseline/final screenshots, every equity
decision, and visible signature proof; records concrete observations across
distinctiveness, hierarchy, typography, color/material, composition, brand,
motion/interaction, responsive quality, retained strengths, concept fidelity,
and generic-template risk; and requires refinement or explicit approval for
every genuine weakness.

## Redesign-only artifacts

`.dreative/design-equity.json` follows `schemas/design-equity.schema.json` and
records desktop/mobile baseline screenshots, quality, strengths/weaknesses,
visual/motion/mobile character, and preserve/transform/surpass/intentionally-
remove decisions for valuable qualities.

`.dreative/checkpoint.json` follows `schemas/checkpoint.schema.json`. After the
first viewport, representative core section, desktop/mobile translations, and
primary motion language exist, it records baseline/current screenshots, the
perceptual critique, refinements, user approval, and when system expansion
started. “Build after plan, with visual checkpoint” may skip a full mockup,
never this gate.

## `.dreative/ledger.json`

The ledger is append-only design memory:

```json
{
  "version": 1,
  "entries": [
    {
      "at": "2026-01-01T00:00:00.000Z",
      "request": "Redesign landing page",
      "tier": "premium",
      "chosen": ["Editorial split with product photography"],
      "rejected": ["Bento dashboard", "Dark cinematic world"],
      "failures": [],
      "userPreferences": ["Calm motion", "No custom cursor"]
    }
  ]
}
```

Record only project-relevant design preferences and technical failures. Never
store secrets, personal notes, or unrelated conversation.

## Audit

Run `dreative audit`. It validates schemas, skill dependency closure, section
completion, shipped assets, preservation needles, exact criterion/evidence
associations, required viewports, structural depth, anti-slop warnings, and the
decision ledger. `--json` emits a machine-readable report.
