# Dreative

Visual round-trip UI editing **skill for coding CLIs** (Claude Code etc.). The CLI agent extracts your app's current UI page-by-page into editable wireframes; you tweak them in the browser (drag-drop, ref images, text prompts); clicking **Finish** hands a compact layout **diff** back to the agent, which rewrites your real code to match.

Dreative itself has **no AI** — the web UI is a dumb visual editor plus a request queue. Your coding agent is the intelligence: it services UI prompts via `dreative wait` / `dreative respond` and applies the finish diff. See `skill/dreative/SKILL.md` for the agent workflow (install it into `.claude/skills/dreative/`).

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
