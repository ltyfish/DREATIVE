# Handoff

The active canonical artifact is `.dreative/plan.yaml` v8. Read and validate it
before implementation. An approved contract is current only when its
contract-only hash matches; execution progress may change without reapproval.

For material changes, add a change request in the same file, invalidate the old
approval and wait for approval. Do not substitute a weaker mechanism silently.

Run `dreative doctor`, resume from the last completed phase when needed, capture
browser-grounded media/runtime evidence, complete the concept checkpoint and
independent critic, then run `dreative finalize`. Dogfood verdict `fail`, broken
primary media, static Award work or imperceptible selected treatments block
`DREATIVE_FINALIZED`.

Legacy v3-v7 plans migrate with `dreative plan migrate`. A v7 migration remains
unapproved until capability preflight, route distribution, asset strategy,
primary/fallback contracts and run-scoped evidence are completed. Evidence
belongs under `.dreative/runs/<run-id>/`; old runs never satisfy current
finalization automatically.
