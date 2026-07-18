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

The one editable creative contract is `.dreative/plan.yaml` (schema v9):

- `contract`: project definition, creative direction, section/route states,
  requirement traceability, source-owned continuity, treatments, mechanisms,
  assets/packages and verification obligations.
- `approval`: contract-only hash, repository baseline and host-neutral
  provenance with an explicit assurance level.
- `execution`: machine-updated phases, bindings, checkpoints and evidence.

Substantial implementation must wait until the contract is approved. Execution
updates do not invalidate approval; material contract edits do.

## CLI

```sh
dreative install-skill --codex --skills all
dreative plan init --ambition award --execution lean --prototype auto \
  --purpose project-delivery --preview-url http://localhost:4173 \
  --routes / --treatments motion,interaction,media \
  --references https://example.com/reference \
  --generated-images ask --sourced-images allow \
  --generated-video deny --sourced-video ask \
  --3d-assets supplied-only --supplied-3d assets/product.glb
dreative plan validate
dreative plan inspect-missing
dreative plan set contract.selectedConcept '"A concrete route concept"'
dreative plan add-subject '{id: product, type: primary-subject, ...}'
dreative plan add-requirement '{id: REQ-1, actions: [...], assertions: [...]}'
dreative plan status
dreative plan diff
dreative plan summary
dreative plan approve --mode human --confirm-human-approval \
  --authority user-origin-unverified --source-type cli --assurance local
dreative verify --prototype-id highest-risk --prototype-location prototypes/highest-risk
dreative plan prototype-decision --id highest-risk --decision approved-for-integration
dreative plan implementation-start
dreative plan export-json
dreative plan migrate --from .dreative/plan.json
dreative treatments --all
dreative doctor --codex
dreative resume
dreative verify --browser-command "npm run preview"
dreative critic-run --provider-class project-local-advisory \
  --assurance local --command "<advisory critic command>"
dreative audit
dreative finalize --codex
```

`plan init` auto-detects repository details, package manager, framework, scripts
and lockfile. It stops when material target or scope information is unresolved.
A provided URL is recorded and tested rather than requested again.

The intake separately records reference preferences, reference and
anti-reference URLs, generated-image/video permission, externally sourced
image/video permission, supplied image/video/3D assets, missing assets, and the
allowed sourcing or generation policy for 3D props.

Selecting every treatment shows a cost, tension and performance summary and
requires one confirmation. Every selected treatment must receive a perceptible
contribution and implementation binding; none may be silently pruned.

Award, Experimental, explicit all-treatment work, and Full Audit Dogfood require
a real-application concept checkpoint after any mechanism prototype. Audit then
checks structural transformation, scene handoffs, meaningful interaction,
multi-section continuity, mobile translation, reduced motion, browser-grounded
media integrity, runtime ownership, qualifying criticism and Dogfood behavior.

## Development

```sh
npm install
npm run build
npm test
npm run docs-check
```

Node.js 20.9 or newer is required; Node 22 is the repository development
baseline. Dependencies are restored deterministically with `npm ci` and
`node_modules`/`dist` are excluded from repository artifacts.

## Executable creative catalogue

Dreative now ships a typed catalogue of 128 advanced mechanisms, 28
package/runtime profiles, 16 original lifecycle primitives and 10 positive
technical exemplars. Search it by the phrase a designer or client would use:

```sh
dreative catalogue --query "image tornado" --json
dreative catalogue --query "persistent product across sections"
dreative preflight --mechanisms image-tornado,section-to-section-persistent-object
```

The resolver keeps native scroll for simple work, selects GSAP for high-control
timelines, and selects Lenis only where an approved mechanism needs interpolation
or velocity. React Bits remains an attributed, transformed reference for user
projects and is not redistributed. Remotion, FFmpeg and external model systems
remain capability-gated; package presence or permission is not proof that a
renderer, binary, endpoint or model works.

The optional visual editor remains available through `dreative start`.

## Canonical v9 lifecycle-safe release

Canonical v9 adds explicit all-ten treatment decisions, truthful creative capability preflight,
stable approved intent separated from mutable execution outcomes, external-first
asset enforcement, runtime browser verification upgrades and lineage-safe v8
migration. It preserves the route-distribution, primary/fallback and adaptive
spread controls introduced in v8.

Permission is not capability. Three.js and GSAP are runtime libraries, FFmpeg
edits or compiles existing footage, and browser tools verify output. Preflight
reports image/video generation, sourcing/editing, 3D sourcing/generation/
authoring, screenshot capture and automation independently.

Asset priority is supplied, rights-safe sourced, advantageously generated, then
procedural. Full Audit and Dogfood reconcile manifest entries, files on disk
and assets actually referenced by the shipped application.

Experimental work assigns every major section a route role, places substantive
events after the first viewport, and runs the hero-removed test. Continuous,
mobile and reverse-scroll recordings are requested only when the mechanism
requires them.

## Runtime-grounded ambitious gates

Award, Experimental and explicit all-treatment finalization now consumes typed
runtime observations rather than self-authored quality prose. Important
mechanisms provide controlled captures, current source/artifact hashes, runtime
properties, handoff ownership, mobile and reduced-motion compositions,
traces/recordings and measured performance generated by `dreative verify`.
Builder-authored telemetry and JSON files labeled as images or recordings are
rejected.

The ambitious static-feeling gate rejects hero-only pages, ordinary
buttons/carousels relabeled as peaks, rigid textured planes with micro-motion,
mobile-disabled signatures and full-page screenshots that only show different
scroll positions. Experimental + Media requires two asset-transforming moments
including one post-hero and a Signature Media Production Package.

Full Audit and Dogfood require a genuinely fresh, host-isolated critic agent.
Best-effort, same-agent or degraded isolation blocks finalization. Context
isolation is labelled honestly and is not external independence. Missing system FFmpeg with
package installation allowed exposes an actionable `ffmpeg-static`, confirmed
provider or bounded sequence fallback route.

Legacy v3-v8 and incomplete early-v9 plans remain readable for migration, but
they cannot finalize. Certification migration requires completing the canonical
plan fields, reapproval under the correct provenance, a new integrity-linked
browser run and a new qualifying critic run; old self-authored evidence is intentionally not
grandfathered.

## Assurance, provenance and correction

Dreative distinguishes `local`, `host-attested` and `externally-attested`
evidence. Local hashes and the append-oriented workflow trace detect drift and
establish internal consistency, but they are not tamper-proof when the builder
controls the filesystem. Project Delivery and Dogfood may use local assurance;
local Dogfood reports disclose that their workflow history is not independently
attested. Production Certification requires host or external attestation.
The standalone CLI cannot elevate assurance from environment variables,
project files, TTY state, allowlists or arbitrary shell commands. Its stock
provider degrades to `local`. A host/external integration must implement the
assurance-provider adapter at a trust boundary outside the builder's filesystem
and process authority; until one is available, higher-assurance workflows
return a provider-unavailable blocker.

Approval provenance may use an immutable host event, signed record, prompt file
or an explicitly unattested user-origin record. TTY presence and a CLI flag do
not establish human attestation. Prompt paths are optional.

Requirement rows contain executable actions and assertions. The production
browser runner derives `pass`, `fail`, `blocked` or `not-run`; screenshots only
support those results. Corrections make incompatible evidence stale and become
certifiable again after fresh compatible verification and criticism.

Runtime verification owns observable facts such as DOM state, forms, routes,
requests, media decode, canvas/WebGL change and exact build identity. The critic
owns semantic resemblance, composition, authorship, concept fidelity and
perceptual ambition. Pixel change never proves Award quality by itself.

The legacy `trusted-verification.json`, `trusted-critic.json` and
`trustedRuns` names remain readable for artifact compatibility. New APIs and
messages call them evidence runs or integrity-linked runs; those legacy names
do not imply independent trust.
