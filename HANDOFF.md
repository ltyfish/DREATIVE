# Laptop handoff — 13 September 2026

## Current direction

Dreative is a general design skill: **visual directions → user selection → faithful
implementation → browser refinement**. For an open brief, generate multiple actual
page images with concrete plans, then wait for the user's choice. Motion, scroll
animation, generated/sourced media and spatial mechanisms serve the selected design.
Do not turn delivery profiles into visual options or introduce another automatic gate
for technical implementation experiments.

Read `skill/dreative/PLAN.md` and `skill/dreative/references/VISUAL_DESIGN.md`.
The older audit in `AUDIT_2026-09-12.md` explains the recurring failures; its runtime
findings are not established causes of the historical custom-code sites.

## Pull and prepare both repositories

Keep these repositories beside each other. Run each block from its named repository.
Preserve any local laptop changes before switching branches; these commands do not
discard changes or force an update.

From Dreative:

```sh
git fetch origin
git switch fix-motion-floor-sampling
git pull --ff-only origin fix-motion-floor-sampling
npm ci
npm run build
npm run test:browser:install
node dist/cli/index.js install-skill --codex
node dist/cli/index.js install-skill --claude
```

From dreative-testbed:

```sh
git fetch origin
git switch measure-visual-smoke-per-run
git pull --ff-only origin measure-visual-smoke-per-run
node scripts/setup.mjs --skill-from ../Dreative
node ../Dreative/dist/cli/index.js install-skill --codex --check
node ../Dreative/dist/cli/index.js install-skill --claude --check
node scripts/review.mjs
```

Open `http://127.0.0.1:4321/status`. The launcher defaults to the installed working
skill. A `git:<sha>` comparison uses that committed tree instead; do not accidentally
select the old `2912db8` revision. `main` is not the active branch in either repo.

## What is implemented

- General design workflow and generated image-to-UI translation guidance.
- Native pin progress, viewport-triggered kinetic type, live reduced-motion and
  cleanup fixes, gallery stacking, and numeric motion tracks.
- Smoke sampling fixes for sticky motion, mainless pages and overlapping surfaces.
- Testbed `visual-directions-v1`: actual local image/plan display, explicit selection,
  feedback handoff, stale-design rejection, pause and timeout without approval.
- Historical runs keep the coded-prototype recovery path. New design-only runs are
  not treated as completed websites. Captures record source correspondence.
- Archive retains images/plans and selection feedback. User verdicts and September
  7, 8, 9 and 11 run archives are included. Scratch reconstructions are retained in
  testbed `scratch/audit-2026-09-12`; they are review copies, not completed new runs.

## Remaining dependency and next work

The image-generation tool in a desktop chat is not automatically available inside
Claude/Codex CLI sessions. The testbed accepts authorized stdio MCP servers from its
local `.mcp.json` or `DREATIVE_MCP_CONFIG`, shared by both provider arms. Configure
that locally on the laptop; credentials/configs are deliberately not committed.
No live image provider has been connected or end-to-end generation run validated
by this change. Missing generation must pause with `design-blocker.md`, not fake
images or a substituted coded hero. Setup success alone does not prove this capability.

Next: verify generation in the chosen provider session, run one complete image-first
design trial, choose a direction at the gate, then judge fidelity in the real browser.
Keep model/tools/budget/protocol constant for comparisons. Include incomplete runs
in completion/cost results. Do not mark the creative intervention validated from tests.

## Validation already completed

Build, documentation/skill validation, native browser tests and smoke/capture tests
passed. Finalization against the design-gate UI fixture printed
`DREATIVE_CHECKS_PASSED` at desktop 1440px, mobile 390px, narrow 320px and reduced
motion. All 13 testbed regression tests passed, including selection through the
browser/API into the continuation prompt and timeout/pause behavior.

The gate screenshots in `audit/2026-09-12/gate-*.png` use clearly labeled UI test
artwork. They verify the review interface, not generated-design quality. Other
captures in that folder document replay of the historical source. Neither is a
fresh independent provider build or a human acceptance verdict.

To rerun deterministic tests when implementation changes:

```sh
# Dreative
npm test
# dreative-testbed
node --test scripts/tests/*.test.mjs scripts/lib/source-evidence.test.mjs
```

Browser processes, node_modules, installed skill copies, temporary test roots and
local generation credentials do not transfer through Git. Recreate them using the
setup above; do not copy an old installed skill over the current source.
