# Handoff

## Current architecture

Dreative 1.2 is a frontend design-builder skill. It separates observable
product quality from unverifiable local ceremony.

The default CLI command is `brief`; it prints Recommended, Efficient, and
Showcase. `brief --configure <direction>` prints compact review, reference,
source, package, and prototype choices. `brief --detailed <direction>` prints
the adaptive Creative Decision Brief structure. Dreative is a skill and CLI;
the legacy visual editor and its server have been removed.

The agent extracts product DNA, synthesizes original directions from product
truth and decomposed cross-domain references, resolves a compact configuration,
selects specialist resources after the concept, builds in the real application,
and runs a screenshot–critique–repair loop over the entire desktop and mobile
route. The complete private
implementation blueprint is mandatory; only revealing the detailed brief is
opt-in.

The former broad mechanism catalogue is replaced by twelve executable golden
systems in `skill/dreative/systems/`. `.dreative/context.json` is optional
durable working memory and must never be interpreted as approval, visual proof,
or completion certification.

`dreative finalize` runs deterministic project scripts and documentation
checks. It does not require plan hashes, approval provenance, critic
attestation, or model-authored evidence records.

The retired v9 compatibility surface and its removal rationale are documented
in `LEGACY_SYSTEM_REMOVAL.md`. Do not reintroduce those systems without evidence
that an objective, independently trustworthy requirement cannot be met by the
active workflow.

## Release checks

1. `npm install`
2. `npm run build`
3. `npm test`
4. `npm run test:all`
5. `node dist/cli/index.js`
6. `node dist/cli/index.js docs-check`
7. `node dist/cli/index.js install-skill --skills all --codex`
8. `node dist/cli/index.js finalize --codex --profile <direction> --visual-smoke-url <preview-url>` (plus `--mechanism-contract <file-or-json>` for Showcase)

The final command must print `DREATIVE_CHECKS_PASSED`.
