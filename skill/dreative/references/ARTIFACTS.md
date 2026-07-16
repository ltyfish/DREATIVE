# Run artifacts

The only human-editable plan is `.dreative/plan.yaml` v9:

- `contract` is stable approved intent.
- `approval.contractHash` hashes only that intent.
- `execution` contains mutable mechanism, prototype, asset, browser, critic,
  evidence and finalization outcomes.
- `.dreative/runs/<run-id>/` evidence must identify canonical plan version,
  contract hash, source hash, capability-preflight identity and creation time.

## Legacy and migration material

Canonical v7 and v8 plans are migration sources only. Migrate them explicitly
with `dreative plan migrate --source-plan <path>`. Ambiguous candidates or
direction/run-identity mismatches stop migration; approval is never fabricated.

- `contract`: user-controlled creative intent.
- `approval`: approved contract revision and hash.
- `execution`: machine checkpoints, bindings and evidence.

Do not generate duplicate human-readable plan or verification files. JSON plan
output is temporary compatibility export only.

`verify.json` remains grounded verification evidence. Lean adds the independent
critic artifact. Full Audit adds preservation, decision and certification
records. Dogfood adds workflow behavior analysis with a direct pass,
pass-with-concerns or fail verdict.

Primary media failures, stale approval, static ambitious work, missing selected
treatments, concept-checkpoint failure, critic blockers and Dogfood failure are
finalization blockers.

`execution.runtimeObservations` is the machine-grounded delivery ledger.
Narrative evidence arrays cannot replace it. Full Audit/Dogfood also requires a
fresh-agent critic; degraded, best-effort or same-agent review produces
insufficient independent evidence and blocks finalization.
