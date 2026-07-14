# Dreative

Frontend design **skill for coding CLIs** (Claude Code, Codex, etc.) with an optional visual round-trip editor. By default the agent plans a design, selects specialist treatments, edits the real application directly, preserves existing behavior, and verifies the result. No server or extraction is involved in that mode.

Dreative itself has **no AI** — your coding agent is the intelligence. See `skill/dreative/SKILL.md` for the direct-design workflow and optional editor mode.

## Direct design (default)

Install the skill, then ask your coding agent to design or redesign a page. The skill provides:

- four explicit ambition tiers, from solid product UI through award-site work;
- ten composable specialist skills with dependency resolution;
- user-approved multi-page skill routing with explicit per-page assignments;
- a rule registry that separates hard gates, evidence-backed defaults, and
  creative provocations, with audited substitutions for equally ambitious alternatives;
- reflex-font review and diversity-or-development planning instead of fixed aesthetic recipes;
- framework adapters for React/Vite, Next.js, Vue/Nuxt, SvelteKit, and styling systems;
- typed plan, preservation, critic-input, independent visual-critic,
  decision-ledger, and verification artifacts;
- `dreative audit`, which checks delivery status, preservation, assets,
  independent critic completion, evidence, and common frontend risks.

```sh
dreative install-skill --codex   # or omit --codex for Claude Code
dreative critic-prompt           # objective-only prompt for a fresh critic context
dreative audit                   # run after implementation
dreative docs-check              # validate the packaged doctrine and references
```

The browser workflow below is optional and only used when explicitly requested.

## Run

```sh
npm install
npm run build
npm link          # once — makes the `dreative` command available globally
```

Then in any project folder:

```sh
dreative          # starts the local server and opens http://localhost:4820
```

State lives in `.dreative/` in that folder (`project.json`, `refs/`, `generated/`).

## Workflow

1. **Extract** — the CLI agent reads your app and writes `.dreative/project.json` (wireframe per page, real labels, `source` pointers to owning files), then snapshots it: `dreative baseline`.
2. **Tweak** — in the browser: drag blocks, add/remove/duplicate, attach reference images and prompts per page/block/element. Prompt-driven actions (propose layouts, block edits, design passes) are queued for your agent, which services them via `dreative wait` → `dreative respond`.
3. **Finish** — click ✅ Finish; the agent receives only the diff vs the baseline (changed/moved/added/removed blocks + annotations) and applies it to the real codebase using the `source` pointers — token-efficient by construction.

CLI: `dreative` / `dreative start` (server+UI) · `dreative install-skill` (copy skill into ./.claude/skills) · `dreative wait` (block for next UI event) · `dreative respond <id> [result.json|--error msg]` · `dreative baseline`.

## Dev

```sh
npm run dev       # server on :4820 (tsx watch) + Vite UI on :5199 with proxy
```
