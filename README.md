# Dreative

Dreative is a frontend design-builder skill for coding agents. It acts as a
creative director, resource guide, implementation system, and visual refiner:
it develops a project-native direction, selects useful capabilities such as
GSAP, Lenis, Canvas, Three.js/OGL, and sourced/generated media, builds in the
real application, and corrects the complete rendered experience.

Its execution library is intentionally small: twelve executable golden systems
with source, visual fixtures, mobile/reduced-motion behavior, cleanup,
performance budgets, and browser tests. It does not expose a long effect menu.

## Planning flow

1. Direction: Recommended, Efficient, or Showcase.
2. Compact configuration: Fast/Lean/Full Audit, references, sources, packages,
   and prototype policy.
3. Private implementation blueprint: always created and used after the choices
   are resolved; the full Creative Decision Brief is shown only on request.

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
```

Install the skill into the current project:

```bash
node dist/cli/index.js install-skill --skills all --codex
```

Run deterministic completion checks:

```bash
node dist/cli/index.js finalize --codex
```

Success prints `DREATIVE_FINALIZED`.

Create or validate durable project design memory:

```bash
node dist/cli/index.js context init
node dist/cli/index.js context check
```

`.dreative/context.json` stores only durable product/design decisions, runtime
owners, important assets, tested states, and unresolved visual issues. It is not
approval or completion evidence.

## Commands

- `dreative` or `dreative brief` — adaptive direction step.
- `dreative brief --configure <direction>` — compact configuration.
- `dreative brief --detailed <direction>` — detailed Creative Decision Brief
  structure.
- `dreative preflight` — framework, scripts, package manager, and capabilities.
- `dreative context init|check|show` — minimal durable project memory.
- `dreative catalogue --query "..."` — focused golden-system lookup.
- `dreative finalize --codex` — deterministic delivery gate.

## Design philosophy

Dreative uses focused creative libraries as capabilities, not house styles.
Concepts begin with product content, behavior, assets, history, and audience.
External references are decomposed and synthesized across domains instead of
being copied as complete visual fingerprints.

Showcase may use any treatment, but only when it strengthens the creative
premise. An effect that competes with content is a defect.

Lean and Full Audit run an actual screenshot–critique–repair loop at desktop
and 390px. DOM snapshots support interaction testing but do not substitute for
looking at the rendered pixels.
