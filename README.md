# Dreative

Dreative is a product-first frontend design skill for coding agents. It helps an
agent choose a coherent direction, implement it in the real application, inspect
the whole rendered experience, and correct visible failures without burying the
user in workflow ceremony.

## What changed in 1.0

- Planning is one friendly choice between Recommended, Efficient, and Showcase.
- The agent selects detailed specialties and mechanisms internally.
- A detailed section/asset/motion/package plan appears only when requested.
- The optional editor never opens automatically. Frontend work must not visit
  `localhost:4820`.
- Finalization checks deterministic facts—build, tests, typecheck, lint, and
  documentation consistency—instead of local approval attestations.
- Browser review prioritizes the whole page, downstream sections, mobile
  composition, interactions, text integrity, collisions, overflow, and dead
  space.

## Quick start

```bash
npm install
npm run build
node dist/cli/index.js
```

The default command prints:

```text
Dreative approach

1. Recommended — recommended
2. Efficient
3. Showcase

Reply with “use recommended”, “use efficient”, or “use showcase”.
Say “show detailed plan” if you want sections, assets, motion, packages, and
verification details before choosing.
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

- `dreative` or `dreative brief` — concise three-approach plan.
- `dreative preflight` — inspect framework, scripts, package manager, and
  relevant capabilities.
- `dreative catalogue --query "..."` — focused mechanism lookup.
- `dreative verify` — optional browser runner for projects that use the legacy
  executable requirement format.
- `dreative finalize --codex` — deterministic delivery gate.
- `dreative start-editor` — explicitly start the optional editor. It never
  opens a browser.

Legacy plan, audit, treatment, and critic commands remain available for
migration compatibility, but the 1.0 skill does not require them.

## Design philosophy

Dreative borrows the best product qualities of focused creative libraries:
small public surfaces, composable primitives, clear ownership, and mechanisms
that earn their cost. GSAP, Lenis, Three.js, OGL, Canvas, and media pipelines
are tools—not ambition badges.

The normal result should have one content-specific visual idea, one signature
mechanism at most, authored desktop and mobile compositions, and a full-page
browser refinement pass. Showcase work may add a second complementary
signature. An effect that competes with content is a defect.
