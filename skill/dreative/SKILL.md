---
name: dreative
description: Plan, implement and fail-closed verify authored frontend design in the real application.
---

# Dreative

Universal foundation: ux and baseline mobile apply to every web page.

Use this workflow for substantial interactive design and redesign.

1. Inspect the repository, current behavior, routes, assets, package state and
   existing design equity before editing.
2. Resolve Ambition, Execution, Prototype and Purpose explicitly. A user-facing task is interactive; ask in plain text if needed and never silently default a
   missing control. Full Audit controls evidence, not visual ambition.
3. Complete the missing-information intake in `PLAN.md`. Do not ask again for
   facts already provided or reliably detected. Explicitly resolve references,
   generated images/video, externally sourced images/video, supplied assets,
   missing assets, and 3D props/assets.
4. Explain candidate treatments using `references/SKILL_CONTRACT.md`. User
   selection is authoritative. Regex routing is suggestion-only.
5. Write the single editable contract to `.dreative/plan.yaml` v9. It must
   include project definition, creative direction, per-section state contracts,
   a source-owned continuity contract, treatment and mechanism obligations,
   requirement traceability, asset/package strategy and the verification plan.
   Run `dreative plan summary`; do not make the user review raw YAML.
6. Record approval honestly. Human approval is interactive
   (`dreative plan approve --mode human --confirm-human-approval`).
   Explicitly pre-authorized Dogfood uses
   `--mode pre-authorized-dogfood` and must never be described as human review.
   Wait for approval before material application-source implementation.
7. Hash only `contract`. Machine updates belong in `execution`. Any material
   contract edit needs a change request and reapproval.
8. When required, prototype the uncertain mechanism in an isolated prototype
   route/location, verify it through the trusted runner, and record a prototype
   decision before integration. A completed application is not its prototype.
   Use `dreative verify --prototype-id <id> --prototype-location <path>`,
   `dreative plan prototype-decision --id <id> --decision <decision>`, then
   `dreative plan implementation-start` before material source edits.
9. Implement the approved concept in the real application. Install runtime
   packages transactionally, one mechanism group at a time. Keep one explicit
   ticker/scroll owner and never silently downgrade.
10. Run `dreative verify --browser-command "<dev command>"`. Only this
    Dreative-owned runner may create trusted screenshots, traces, browser
    observations, performance data and artifact hashes. Never hand-author or
    edit trusted evidence.
11. Run the critic in a separate process with
    `dreative critic-run --command "<critic command>"`. Its closed input must
    contain the approved contract, requirement matrix, desktop/mobile/reduced
    motion captures, temporal evidence and functional/performance summaries.
12. Run `dreative audit`, correct blockers and major issues, then
    `dreative finalize`. Dogfood failure prevents `DREATIVE_FINALIZED`.

Canonical Ambition values are `standard`, `expressive`, `award` and
`experimental`. Legacy `solid` and `premium` are migration inputs only.

Specialists:

- `ux`: functional and accessible truth.
- `mobile`: mobile-native composition and touch behavior.
- `refined`: typography, spacing, hierarchy and material finish.
- `motion`: structural temporal change and choreography.
- `interaction`: meaningful input-driven state.
- `media`: real image/video production and transformation.
- `3d`: visible spatial/WebGL contribution and fallback.
- `immersive`: continuity across sections.
- `cinematic`: pacing, framing and scene handoffs.
- `experimental`: two or three purposeful unconventional peaks.

## Canonical v9 lifecycle rules

- Disclose all ten treatments before writing a substantial contract. Recommendations remain recommendations. The user must explicitly select or decline the optional treatments; only then add UX and Mobile as mandatory foundations. `all` requires an explicit confirmation.
- Keep stable intent in `contract`: treatment decisions and allocation, mechanism primary/fallback policy, prototype uncertainty and acceptance, and asset requirements/policies.
- Keep observations in `execution`: pending/progress/final mechanism status, trigger evidence, prototype attempts/results, sourcing attempts, generated files, asset survival, browser results, critic findings and spread evidence. Never pre-claim a final outcome in the approved contract.
- Permission is not capability. A connected authoring or sourcing tool must be explicitly detected or declared. Canvas, WebGL, video playback and other browser APIs begin as expected but unverified and become available only through current browser evidence.
- Award, Experimental and explicit all-treatment delivery is machine-grounded in typed controlled-progress runtime observations. Free-form evidence strings cannot satisfy static-feeling, Media, 3D, Cinematic, Immersive or Experimental gates.
- Full Audit and Dogfood require a genuinely fresh critic agent. Degraded, best-effort or same-agent review is insufficient independent evidence.
- Browser verifier and critic provenance are sealed in a Dreative trust ledger
  outside the project. JSON descriptions never count as screenshots,
  recordings or browser traces. Audit re-hashes actual bytes and rejects edits,
  missing files, stale plan/source/build identities and unsealed Playwright
  claims.
- Requirement rows are blocking contracts, not documentation. A missing
  browser test, missing evidence id, failed status, material substitution,
  unapproved fallback, missing exact viewport, or mobile deletion blocks
  finalization.
- Asset order is supplied, rights-safe external sourcing, advantageously generated, then procedural. When a confirmed sourcing tool exists and suitable media could exist, record a search attempt or a concrete asset-specific generation-first exemption.
- Direct YAML authoring follows the same rules: all ten treatment decision records are mandatory and mutable outcomes in `contract` are invalid.

Before concept approval, show every selected treatment's summary, substantive
threshold, insufficiency examples, dependencies, tensions, cost, mobile/
performance/accessibility risk, proposed sections, role and acceptance
condition. Selecting all requires one confirmation, one continuity owner and
concrete allocation; no selected treatment may be silently pruned.

Run creative capability preflight before promising media, video or 3D.
Permission, package installation, runtime rendering, sourcing and authoring are
separate. Three.js is not model generation; GSAP is not cinematic authorship;
FFmpeg is not original video generation; browser tools verify.

Assign every major section Peak, Transformation, Preparation, Echo, Rest,
Resolution or Functional Utility. The hero cannot be the only meaningful event
for Expressive, Award or Experimental work. Apply the hero-removed test.

Record every primary mechanism, acceptance conditions, fallback, trigger,
trigger evidence, reapproval policy and final status. Convenience is not a
trigger. Prefer supplied, rights-safe sourced, advantageously generated, then
procedural assets, and reconcile manifest, disk and shipped use.

Classify spatial contributions honestly as model, spatial cutout, layered
billboard, pre-rendered angles, frame sequence, WebGL media plane or static
image. Store evidence under `.dreative/runs/<run-id>/` and reject stale source
hashes or cross-run artifacts. Run Adaptive Spread Validation; recordings,
reverse scroll and montage are conditional.

Read the selected `skills/<name>.md` summaries first. Read a
`recipes/<name>-recipes.md` file only after its mechanism is approved.

## Executable creative catalogue

During concept planning, search `llms.txt` through
`dreative catalogue --query "<natural visual phrase>" --json`. Compare the
typed outcome, ambitions/treatments, content and continuity roles, package
profiles, primitive, recipe, risks, fallback and evidence contract. Use the
smallest coherent mechanism set; do not start from a component menu.

Read `references/CREATIVE_EXECUTION.md` before installing an advanced runtime.
It defines native-scroll defaulting, GSAP/Lenis clock ownership, scoped React
cleanup, WebGL disposal, truthful Remotion/media capability gating, external
reference scouting, React Bits adaptation without redistribution, performance
budgets and temporal verification. Original primitive contracts are in
`recipes/primitives.md`; tested technical patterns are in
`recipes/positive-exemplars.md`. Family recipes are linked by catalogue entries.

Award and Experimental plans must distribute substantive behavior after the
hero, connect transformations to real project content and adjacent chapters,
and include peaks, rests and resolution. Reject fade/translate/scale-only
delivery, unused advanced dependencies, generic WebGL backgrounds, isolated
model viewers, untreated video rectangles, component soup and mobile deletion.
For all-treatment work, allocate one or two dominant treatments per section,
choose continuity/motion/material/spatial owners, and resolve tensions with
section hierarchy, budgets and fallbacks rather than pruning selections.

Never weaken preservation, accessibility, responsive, reduced-motion,
source-identity, critic independence or fail-closed guarantees.
