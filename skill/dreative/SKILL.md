---
name: dreative
description: Visual UI round-trip editor. Use when the user wants to visually redesign, rearrange, or touch up their app's UI ("open dreative", "let me edit the layout visually"). Extracts the app's pages into editable wireframes in a browser UI, services the user's visual edits and prompts, then applies the final layout diff back to the codebase.
---

# Dreative — visual round-trip UI editing

You (the coding agent) are the intelligence; the Dreative server/UI is a dumb visual editor. Flow: **extract → baseline → serve requests → finish → apply**. Be token-frugal at every step: read only the files you need, never re-read the whole app, and keep JSON compact.

## 0. Setup

Requires `dreative` on PATH (`npm i -g dreative` or `npx dreative`). All commands run from the user's project root. State lives in `.dreative/` (paths in payloads are relative to `.dreative/`).

## 1. Extract (code → layout)

Goal: replicate the app's current UI page-by-page as wireframes so the user recognizes every page. Do this **one page at a time** — find the routes/pages first (router config, pages/ dir, app/ dir), then open only each page's component files.

Write `.dreative/project.json`:

```json
{ "version": 1, "pages": [ {
  "id": "pg_home", "name": "Home", "canvasPos": {"x": 40, "y": 40},
  "status": "skeleton", "source": "src/pages/Home.tsx",
  "layout": { "id": "blk_root", "type": "section", "label": "Home", "direction": "column", "children": [ … ] }
} ] }
```

Block: `{ id, type, label, direction?, sizeHint?, source?, children? }`
- `type`: section | row | column | nav | hero | card-grid | list | form | footer | text | image | button
- `label`: use **real text from the app** (button captions, headings) so pages are recognizable — not generic names.
- `source`: the real file that owns this block (component path). Set it on every block whose owner differs from its parent's — this is what lets you apply the diff later without re-searching.
- Keep depth sensible (3–5 levels); every meaningful visible element should exist, but don't model every span.
- Ids must be unique and stable; prefix `pg_`/`blk_` plus a slug.
- Space pages on the canvas: x += 480 per page.

Then snapshot the baseline: `dreative baseline` (start the server first, step 2, if not running).

## 2. Launch

```
dreative start   # serves http://localhost:4820, opens browser (background this)
```

Tell the user the UI is open: they can drag elements, add/remove blocks, attach reference images and text prompts per page/element, and click **Finish** when done.

## 3. Service requests (the wait loop)

Repeat until finish:

```
dreative wait    # blocks up to ~8 min; prints ONE event as JSON
```

- `{"kind":"none"}` → just run `dreative wait` again.
- `{"kind":"request","id","type","payload"}` → handle per table below, then
  `dreative respond <id> <resultFile>` (write the result JSON to a temp file) or `dreative respond <id> --error "why"`.
- `{"kind":"finish","diff":…}` → go to step 4.

| type | payload | result to respond with |
|---|---|---|
| `propose-skeletons` | `{prompt}` | Array of 1–3 `{name, layout}` page proposals (block schema above) |
| `propose-variants` | `{pageName, layout}` | Array of 1–3 `{name, layout}` variants |
| `edit-block` | `{block, instruction}` | The updated block JSON (same id) |
| `design-page` | `{pageName, layout, refImage?, blockRefs, designPrompt?, previousFile?, siblingPages, outFile}` | Write a single-file React+Tailwind component (default export, no imports beyond react) to `.dreative/<outFile>`; every block id in layout must appear as `data-dreative-id="<id>"`. Read `refImage`/`blockRefs[].refImage` (paths under `.dreative/`) with your image tools; if `previousFile` set, read it and preserve prior element edits. Respond `{"ok":true}` |
| `edit-element` | `{file, elementId, instruction, refImage?}` | Edit `.dreative/<file>` in place, only the element with `data-dreative-id=elementId`. Respond `{"ok":true}` |

Token rules: only read ref images when a request names them; never dump whole files into responses; for edits, edit files directly instead of returning code.

## 4. Apply (finish)

The finish event's `diff` (also saved at `.dreative/finish.json`) contains only what changed vs the baseline:

- `pagesAdded` — full layouts; create real pages/components for them.
- `pagesRemoved` — confirm with the user before deleting real code.
- `pagesChanged` — per page: `blocksMoved` (reorder in the source), `blocksAdded`, `blocksRemoved`, `blocksChanged` (only differing props listed; `refImage` = style reference to match, `intents` = behavior notes), plus page-level `refImage`/`designPrompt`.

Use each block's/page's `source` pointer to open **only the owning files**. Read annotated ref images now (paths relative to `.dreative/`). Make the real code match the final layout and annotations, run the project's checks, and summarize what you changed.
