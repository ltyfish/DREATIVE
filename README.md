# Dreative

Dreative is a fail-closed frontend design skill for coding agents. It plans and
verifies work in the real application, preserves existing behavior, and rejects
results that do not perceptually deliver the approved experience.

## Canonical workflow

Every substantial interactive run resolves four independent controls before
concept planning:

- Ambition: `standard`, `expressive`, `award`, or `experimental`.
- Execution: `fast`, `lean`, or `full-audit`.
- Prototype: `skip`, `auto`, or `required`.
- Purpose: `project-delivery`, `production-certification`, or
  `dreative-dogfood`.

Full Audit controls evidence and certification depth. It does not imply Award
and it never supplies a missing Ambition choice.

The one editable creative contract is `.dreative/plan.yaml` (schema v7):

- `contract`: user-controlled target, workflow, concept, treatments, allocation,
  experience arc, preservation, performance and acceptance criteria.
- `approval`: contract-only hash, revision and decision history.
- `execution`: machine-updated phases, bindings, checkpoints and evidence.

Substantial implementation must wait until the contract is approved. Execution
updates do not invalidate approval; material contract edits do.

## CLI

```sh
dreative install-skill --codex --skills all
dreative plan init --ambition award --execution lean --prototype auto \
  --purpose project-delivery --preview-url http://localhost:4173 \
  --routes / --treatments motion,interaction,media
dreative plan validate
dreative plan status
dreative plan diff
dreative plan approve
dreative plan export-json
dreative plan migrate --from .dreative/plan.json
dreative treatments --all
dreative doctor --codex
dreative resume
dreative audit
dreative finalize --codex
```

`plan init` auto-detects repository details, package manager, framework, scripts
and lockfile. It stops when material target or scope information is unresolved.
A provided URL is recorded and tested rather than requested again.

Selecting every treatment shows a cost, tension and performance summary and
requires one confirmation. Every selected treatment must receive a perceptible
contribution and implementation binding; none may be silently pruned.

Award, Experimental, explicit all-treatment work, and Full Audit Dogfood require
a real-application concept checkpoint after any mechanism prototype. Audit then
checks structural transformation, scene handoffs, meaningful interaction,
multi-section continuity, mobile translation, reduced motion, browser-grounded
media integrity, runtime ownership, independent criticism and Dogfood behavior.

## Development

```sh
npm install
npm run build
npm test
npm run docs-check
```

The optional visual editor remains available through `dreative start`.
