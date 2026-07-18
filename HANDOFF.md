# Handoff

## Current architecture

Dreative 1.0 separates product quality from unverifiable local ceremony.

The default CLI command is `brief`; it prints Recommended, Efficient, and
Showcase. The optional editor is available only through `start-editor` and
never opens a browser. The installed skill explicitly forbids visiting the
editor during frontend work.

The agent performs one concise planning decision, builds in the real
application, then inspects the entire desktop and mobile route. Visual judgment
is grounded in the rendered result: hierarchy, collisions, overflow, dead
space, downstream quality, interaction, text integrity, and mobile composition.

`dreative finalize` runs deterministic project scripts and documentation
checks. It does not require plan hashes, approval provenance, critic
attestation, or model-authored evidence records.

## Compatibility

The v9 schema, migration, verify, audit, and critic modules are retained to
avoid breaking existing projects. Do not reintroduce them into the public
planning workflow.

## Release checks

1. `npm install`
2. `npm run build`
3. `npm test`
4. `node dist/cli/index.js`
5. `node dist/cli/index.js docs-check`
6. `node dist/cli/index.js install-skill --skills all --codex`
7. `node dist/cli/index.js finalize --codex`

The final command must print `DREATIVE_FINALIZED`.
