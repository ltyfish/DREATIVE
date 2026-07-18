# Handoff

## Current architecture

Dreative 1.0 is a frontend design-builder skill. It separates observable
product quality from unverifiable local ceremony.

The default CLI command is `brief`; it prints Recommended, Efficient, and
Showcase. `brief --configure <direction>` prints compact review, reference,
source, package, and prototype choices. `brief --detailed <direction>` prints
the adaptive Creative Decision Brief structure. The optional editor is
available only through `start-editor` and never opens a browser.

The agent extracts product DNA, synthesizes original directions from product
truth and decomposed cross-domain references, resolves a compact configuration,
selects specialist resources after the concept, builds in the real application,
and inspects the entire desktop and mobile route. Detailed planning is opt-in.

`dreative finalize` runs deterministic project scripts and documentation
checks. It does not require plan hashes, approval provenance, critic
attestation, or model-authored evidence records.

## Compatibility

The v9 schema, migration, verify, audit, and critic modules are retained to
avoid breaking existing projects. They are hidden from normal CLI help and
excluded from the installed active skill. Do not reintroduce them into the
public planning or finalization workflow.

## Release checks

1. `npm install`
2. `npm run build`
3. `npm test`
4. `npm run test:all` for a compatibility release
5. `node dist/cli/index.js`
6. `node dist/cli/index.js docs-check`
7. `node dist/cli/index.js install-skill --skills all --codex`
8. `node dist/cli/index.js finalize --codex`

The final command must print `DREATIVE_FINALIZED`.
