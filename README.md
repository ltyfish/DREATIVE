# Dreative

Dreative is a frontend design-builder skill for coding agents. It acts as a
creative director, resource guide, implementation system, and visual refiner:
it develops a project-native direction, selects useful capabilities such as
GSAP, Lenis, Canvas, Three.js/OGL, and sourced/generated media, builds in the
real application, and corrects the complete rendered experience.

## Planning flow

1. Direction: Recommended, Efficient, or Showcase.
2. Compact configuration: Fast/Lean/Full Audit, references, sources, packages,
   and prototype policy.
3. Optional detail: a full project-specific Creative Decision Brief adapted to
   the selected direction.

Recommended is the direction the agent judges best for the inspected product.
Efficient is the most token- and implementation-efficient direction. Showcase
is the absolute highest ceiling and integrates all ten treatments.

The optional editor never opens automatically. Frontend work must not visit
`localhost:4820`.

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

## Commands

- `dreative` or `dreative brief` — adaptive direction step.
- `dreative brief --configure <direction>` — compact configuration.
- `dreative brief --detailed <direction>` — detailed Creative Decision Brief
  structure.
- `dreative preflight` — framework, scripts, package manager, and capabilities.
- `dreative catalogue --query "..."` — focused mechanism lookup.
- `dreative finalize --codex` — deterministic delivery gate.
- `dreative start-editor` — explicitly start the optional editor without
  opening a browser.

Legacy plan, audit, treatment, verify, and critic commands remain callable for
migration compatibility but are hidden from normal help and excluded from the
installed active skill.

## Design philosophy

Dreative uses focused creative libraries as capabilities, not house styles.
Concepts begin with product content, behavior, assets, history, and audience.
External references are decomposed and synthesized across domains instead of
being copied as complete visual fingerprints.

Showcase integrates all treatments into a few complementary signatures rather
than stacking unrelated effects. An effect that competes with content is a
defect.
