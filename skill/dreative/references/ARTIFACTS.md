# Runtime artifacts

Structured artifacts are contracts consumed by the build, critic, audit, or a
human report. File count is not a quality score.

## Canonical set

- Fast: `.dreative/plan.json`, `.dreative/verify.json`.
- Lean: add `.dreative/critic.json`.
- Full Audit may add `preservation.json`, `ledger.json`, and
  `certification.json` when they have a consumer.
- Dreative Dogfood may add behavioral, doctrine, cost, or regression records.

Do not maintain `plan.md`, `verify.md`, transcripts, skipped-question lists, or
duplicate rationales. Generate any human summary from the canonical JSON.

## `plan.json`

Plan v5 follows `schemas/plan.schema.json`. Legacy v2-v4 plans remain readable
with migration warnings. Important fields include:

- `configuration`: independent ambition, execution, prototype, and purpose;
- `tier` and `depth`: legacy ambition delivery tier and independent redesign
  depth, retained for compatibility;
- `approval`, compact `executionBrief`, `commonPatternReview`, and section
  `visualBlueprint` for substantial work;
- page registers, source strategies, structural deltas, mobile blueprints,
  expression contracts, selected specialist skills, assets, interactions, and
  typed verification criteria;
- `motionMoments` for planned signature motion;
- one optional `signatureMedia` production contract;
- `critic` (normally `.dreative/critic.json`) for Lean/Full Audit;
- optional trace artifacts required by Full Audit or Dogfood.

Approval records decisions and timestamps, not verbatim chat. Overall concept
exploration may contain up to three directions; micro-decisions do not require
three candidates. Technology comparison includes only plausible mechanisms.

## Signature Media Production Package

`signatureMedia` is the single contract for layered subject, depth separation,
fragment reconstruction, tile atlas, generated states, frame sequence, Canvas,
WebGL, editorial cut-up, or clean-plate systems. It records:

- package type, location, and concept-specific purpose;
- source assets and real derivatives;
- implementation file and exact runtime references;
- at least two independently controlled internal elements, states, or regions;
- mobile and reduced-motion fallbacks;
- performance safeguards where applicable;
- visible production evidence IDs.

Audit checks that files exist and are nonempty, runtime references occur in the
production implementation, and evidence visibly passes. One flat image moved,
scaled, masked, parallaxed, blurred, or covered with gradients/noise does not
qualify. A concept-specific `signatureMediaExemption` is valid when media is not
central, such as typographic concepts or dense operational interfaces.

## `critic.json`

The canonical artifact follows `schemas/critic.schema.json` and stores the
objective first-pass `input` plus the independent `report`. The input excludes
builder rationale and claims. Findings use Blocker, Major, Minor, or Experiment.
Correct blockers, majors, and high-value minors. A report includes follow-up
revision data only when a blocker or substantial correction justifies it.
Dogfood observations are required only for Dreative Dogfood purpose.

Legacy `critic-input.json` and `visual-critic.json` remain readable for existing
plans but new runs use the canonical artifact.

## `verify.json`

Verify v3 follows `schemas/verify.schema.json`. Each row associates a criterion,
page/section, evidence kind, viewport class, timestamp, and concrete proof.
Desktop and ~390px mobile are the Lean baseline. Narrow-mobile evidence is added
only for identified risk, Full Audit coverage, or Dogfood analysis.

Evidence is interaction-specific: static final states; simple motion
start/mid/end; layered media resting/active/resolved plus fallbacks; pinned
entry/mid/exit/release; sequence early/mid/final/loading; Canvas/WebGL active,
resize, mobile/reduced-motion, and performance only when risk warrants it.

Passing implementation claims require shipped behavior. Planning prose,
documentation, or unused assets are not proof.
