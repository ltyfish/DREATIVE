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
  --routes / --treatments motion,interaction,media \
  --references https://example.com/reference \
  --generated-images ask --sourced-images allow \
  --generated-video deny --sourced-video ask \
  --3d-assets supplied-only --supplied-3d assets/product.glb
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
media integrity, runtime ownership, independent criticism and Dogfood behavior.

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
mechanisms provide controlled 0/25/50/75/100 captures, current source/artifact
hashes, pixel and structural change, runtime properties, media/frame/camera/
shader telemetry, handoff ownership, mobile and reduced-motion compositions,
recordings and measured performance.

The ambitious static-feeling gate rejects hero-only pages, ordinary
buttons/carousels relabeled as peaks, rigid textured planes with micro-motion,
mobile-disabled signatures and full-page screenshots that only show different
scroll positions. Experimental + Media requires two asset-transforming moments
including one post-hero and a Signature Media Production Package.

Full Audit and Dogfood require a genuinely fresh critic agent. Best-effort,
same-agent or degraded isolation blocks finalization. Missing system FFmpeg with
package installation allowed exposes an actionable `ffmpeg-static`, confirmed
provider or bounded sequence fallback route.
