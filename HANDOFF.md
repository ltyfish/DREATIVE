# Handoff

## 0.9.0 pre-Dogfood hardening

Assurance is explicit: `local` is integrity-linked but builder-controlled,
`host-attested` uses immutable host execution/event identity, and
`externally-attested` uses an outside signer or service. Production
Certification requires at least host attestation. Local Dogfood is supported
with a mandatory non-attestation disclosure.

Approval provenance supports host events, signed records, optional prompt
files and unattested CLI/user-origin records. Requirement outcomes now come
from Playwright actions/assertions against a production preview. Critic
providers declare class and assurance; project-local scripts remain advisory.
The standalone CLI intentionally has no host/external adapter and cannot
promote a project file, environment allowlist, TTY, or shell command above
`local`. Production Certification therefore blocks honestly until a qualifying
host integration supplies attestation outside builder authority.

The workflow trace is append-oriented and hash-linked. Finalization derives
Dogfood analysis and certification, reconciles the latest mutually compatible
contract/source/lock/build/verification/critic identities, and stales older
evidence after corrections.

## v.20.7 repair

The browser runner must populate `execution.runtimeObservations`,
`execution.signatureMediaPackages` when Experimental + Media is selected, and
the separate `ambitionPrototype` checkpoint. Legacy free-form execution arrays
remain readable but cannot satisfy ambitious treatment gates.

The primary negative regression is the Northwind-style coffee fixture in
`src/shared/coffeeRoasterRegression.test.ts`; the reusable scoring and
treatment logic lives in `src/shared/runtimeEvidence.ts`.

The active canonical artifact is `.dreative/plan.yaml` v9. Read and validate it
before implementation. An approved contract is current only when its
contract-only hash matches; execution progress may change without reapproval.

For material changes, add a change request in the same file, invalidate the old
approval and wait for approval. Do not substitute a weaker mechanism silently.

Run `dreative doctor`, resume from the last completed phase when needed, capture
browser-grounded media/runtime evidence, complete the concept checkpoint and
qualifying critic, then run `dreative finalize`. Trace-derived Dogfood safety findings, broken
primary media, static Award work or imperceptible selected treatments block
`DREATIVE_FINALIZED`.

Legacy v3-v8 plans migrate with `dreative plan migrate --source-plan <path>`.
Canonical v8 migration preserves approval lineage only when its approved hash
exactly matches the source contract, then moves mutable outcomes into execution.
Ambiguous or mismatched plan/run identities stop migration. A v7 migration remains
unapproved until capability preflight, route distribution, asset strategy,
primary/fallback contracts and run-scoped evidence are completed. Evidence
belongs under `.dreative/runs/<run-id>/`; old runs never satisfy current
finalization automatically.
