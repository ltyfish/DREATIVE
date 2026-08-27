# Dreative

Dreative is a **motion** design-builder skill for coding agents. It acts as a
motion director, resource guide, implementation system, and visual refiner: it
develops a project-native direction, sources the real material the motion is
made of — frame sequences, footage, models, HDRIs — selects the capability that
drives it (GSAP, Lenis, Canvas, Three.js/OGL, shaders), builds in the real
application, and corrects the complete rendered experience.

It is deliberately not a generic website builder. Clean, conventional,
business-strategy frontend work is out of scope; restructuring and UX craft
stay in scope as the floor the motion is built on. Two rules carry most of the
difference: the material is decided and downloaded before the section that
drives it exists, and the real mechanism is built at full fidelity on the first
pass rather than as a placeholder intended for later upgrade.

Its execution library is intentionally small: twelve executable native
foundations with source, a functional fixture, explicit fallback and cleanup
contracts, and behavioral browser tests. They are primitives to adapt, not
finished art direction or a long effect menu.

## Planning flow

1. Direction: Recommended, Efficient, or Showcase.
2. Compact configuration: Fast/Lean/Full Audit, references, sources, packages,
   and prototype policy.
3. Private implementation blueprint: the page's sections are decided here, with
   visible start/end, ownership, responsive, fallback, and review obligations;
   the full Creative Decision Brief is shown only on request.

A third gate, an editable Experience Map, was removed on 2026-08-16 after blind
review showed the pages it produced had the same sections in the same order as
builds with no skill at all.

Recommended is the direction the agent judges best for the inspected product.
Efficient is the most token- and implementation-efficient direction. Showcase
is the absolute highest ceiling, with no required treatment count.

## Quick start

```bash
npm install
npm run build
node dist/cli/index.js
```

The default command prints the direction step. Additional planning surfaces:

```bash
node dist/cli/index.js brief --configure recommended
node dist/cli/index.js brief --detailed recommended
node dist/cli/index.js experience-map --file .dreative/experience-map.json
node dist/cli/index.js experience-map --file .dreative/experience-map.json --obligations
```

Install the skill into the current project:

```bash
node dist/cli/index.js install-skill --skills all --codex
```

Run deterministic completion checks:

```bash
node dist/cli/index.js finalize --codex --profile recommended --visual-smoke-url http://127.0.0.1:4173
```

Success prints `DREATIVE_CHECKS_PASSED` followed by an explicit notice that visual quality is not certified.

The browser suite requires a Chromium binary once per environment:

```bash
npm run test:browser:install
npm test
```

Create or validate durable project design memory:

```bash
node dist/cli/index.js context init
node dist/cli/index.js context check
```

`.dreative/context.json` stores only durable product/design decisions, runtime
owners, important assets, tested states, and unresolved visual issues. It is not
approval or completion evidence.

Projects may opt into a small evaluator handoff by committing
`.dreative/evaluation/README.md` with local filenames and size rules. When that
contract exists, the skill records concise decisions, material changes, shipped
scope, and observable verification there. It never exports hidden reasoning,
raw transcripts, traces, prototypes, or build bundles, and it creates no
evaluation package in projects that did not opt in.

## Commands

- `dreative` or `dreative brief` — adaptive direction step.
- `dreative brief --configure <direction>` — compact configuration.
- `dreative brief --detailed <direction>` — detailed Creative Decision Brief
  structure.
- `dreative preflight` — framework, scripts, package manager, and capabilities.
- `dreative context init|check|show` — minimal durable project memory.
- `dreative experience-map --file map.json [--check|--obligations]` — render,
  validate, or compile the accepted section journey.
- `dreative catalogue --query "..."` — focused golden-system lookup.
- `dreative visual-smoke --url <preview-url> --profile <direction>` — ephemeral desktop, mobile, reduced-motion, route, runtime, and asset smoke gate.
- `dreative finalize --codex --profile <direction> --visual-smoke-url <preview-url>` — deterministic delivery gate; smoke is mandatory for every substantial delivery.

Showcase also passes tracked, repository-local
`--mechanism-contract .dreative/showcase-mechanism.json` and
`--experience-map .dreative/experience-map.json` files. The versioned contract
object binds prototype fidelity, shared continuity, animation ownership, and
real `before`, `peak`, and `after` mechanisms. Local captures and recordings
referenced by the contract must also be tracked and portable; inline JSON and
absolute machine paths are rejected during finalization.
Showcase deterministic scripts are replayed from a temporary clean worktree at
the committed `HEAD`; browser smoke still targets the explicitly supplied
production-equivalent preview URL.

Preflight leaves unspecified sourcing and generation permissions unresolved.
Pass explicit choices as flags or JSON instead of silently treating them as
denied:

```bash
dreative preflight --generated-images allow --external-images deny --three-d-policy supplied-only
dreative preflight --permissions ./dreative-permissions.json --capabilities ./capabilities.json
```

Package detection and successful browser launch are reported separately.
Neither one makes rendered verification available. Start the real preview and
run the bounded workflow probe:

```bash
dreative preflight --probe-browser http://127.0.0.1:4173
```

Only a successful browser launch plus HTTP preview navigation promotes
screenshot capture, console inspection, performance collection, mobile
viewport checks, reduced-motion checks, and related browser capabilities to
`available`. Package-only and executable-only states remain explicitly
unverified; a failed probe reports `runtime-verification-failed`.

## Design philosophy

Checks are a floor for defects, never a definition of good work. Blockers cover
only things any human would call broken — a failing route, colliding text,
overflow, unreadable type, a console error, a reveal that fires after the reader
has scrolled past, a contract promise that does not resolve, an interaction
layer or a route that does not move at all.

Nothing taste-shaped is checked. Motion breadth, density, scannability, and
signature size were advisories for four rounds; they measured proxies, never
caught the failures they were written for, and were deleted on 2026-08-16. A page
arranged to satisfy checks is a page nobody chose, and that failure mode is
treated as worse than a page no check has an opinion about.

`exemplars/` carries the two halves of the visual system: `SLOP.md` for the
defaults that make generated frontends recognisable, and `PRINCIPLES.md` for
what holds and under which condition. A third file, `MATERIALS.md`, held
ready-made stock — type pairings, palette constructions, compositions — and was
removed on 2026-08-22: five rounds without a reviewer ever naming one of its
decisions, against a real risk of a Dreative house style replacing the generic
one and a real cost in context on every turn. No check tests for any of it.

Dreative uses focused creative libraries as capabilities, not house styles.
Concepts begin with product content, behavior, assets, history, and audience.
External references are decomposed and synthesized across domains instead of
being copied as complete visual fingerprints.

Showcase may use any treatment, but only when it strengthens the creative
premise. An effect that competes with content is a defect.

Lean and Full Audit run an actual screenshot–critique–repair loop at desktop
and 390px. DOM snapshots support interaction testing but do not substitute for
looking at the rendered pixels.
