---
name: dreative
description: Visual UI round-trip editor and design harness. Use when the user wants to visually redesign, rearrange, restyle, or touch up their app's UI, design new pages/screens visually, or says things like "open dreative", "let me edit the layout visually", "redesign my app's pages", "make my UI look good". Extracts the app's pages into editable wireframes in a browser UI, services the user's visual edits and design requests to a strict design doctrine, then applies the final layout diff back to the codebase.
---

# Dreative — visual round-trip UI editing

You (the coding agent) are the intelligence; the Dreative server/UI is a dumb visual editor. Flow: **extract → baseline → serve requests → finish → apply**. Be token-frugal at every step: read only the files you need, never re-read the whole app, and keep JSON compact.

**Design quality is a hard requirement.** `DESIGN.md` (same folder as this file) is the design doctrine. Read it ONCE before servicing the first `propose-skeletons`, `propose-variants`, `design-page`, or `edit-element` request, keep it in mind for all later ones, and run its pre-flight checklist (§12) before every respond. Requests may carry a `brief` object (aesthetic preset + vibe + dials set by the user in the UI); when present it is the user's explicit direction and overrides doctrine defaults. Before writing any `design-page` code, state (to yourself, one line) the register, the design read, and the signature element — if you cannot name all three, you are about to produce the generic default; stop and commit first.

**Specialist skills.** The `skills/` folder next to this file holds expert playbooks for advanced work: `motion.md` (animation & scroll choreography), `3d.md` (WebGL/three.js/shaders), `interaction.md` (micro-interactions & effect craft). When a request's `plan.skills` lists names, read each listed `skills/<name>.md` ONCE before writing code (then keep it in mind, like DESIGN.md); when `plan.sections[].skills` tags a section, that section gets that treatment (e.g. "this hero has 3d"). If the brief/prompt clearly calls for one of these but the plan missed it, read it anyway. If a listed file isn't installed, proceed on DESIGN.md alone and note it to the user (`dreative install-skill` installs all).

## 0. Setup

Requires `dreative` on PATH (`npm i -g dreative` or `npx dreative`). All commands run from the user's project root. State lives in `.dreative/` (paths in payloads are relative to `.dreative/`).

## 1. Extract (code → layout + replica)

Goal: replicate the app's current UI page-by-page so the user recognizes every page. Do this **one page at a time** — find the routes/pages first (router config, pages/ dir, app/ dir), then open only each page's component files. **Single pass per page:** while the source is in front of you, produce all three outputs at once (layout JSON, replica file, summaries) — never revisit a file for a second output.

Per page, produce:

1. **Layout** — the block tree in `project.json` (schema below).
2. **Replica** — `.dreative/replica/<pageId>.tsx`: a stripped, non-functional **1:1 visual copy** of the real page. Single file, default export, no imports beyond react, Tailwind classes (translate other styling to Tailwind or inline styles). Strip everything behavioral: no handlers, no hooks, no data fetching; replace dynamic state/props with representative literal values (the ones a real user would see). It only needs to LOOK identical, not work. Every block id from the layout appears as `data-dreative-id="<id>"` on the matching element. Set `replicaFile` on the page.
3. **Summaries** — on each meaningful block, `summary`: one plain line of what it shows or does ("Submits the signup form and redirects to /dashboard", "Lists the 6 most recent orders from the API"). These render as hover tooltips in the replica so the user understands behavior without you re-reading code later, and they are your own re-entry notes at apply time. Keep each under ~120 chars.

Write `.dreative/project.json`:

```json
{ "version": 1, "brief": { "aesthetic": "minimal", "vibe": "", "audience": "", "variance": 7, "motion": 5, "density": 4, "notes": "" }, "pages": [ {
  "id": "pg_home", "name": "Home", "canvasPos": {"x": 40, "y": 40},
  "theme": { "bg": "#0d0d0f", "fg": "#e8e8ea", "accent": "#f59e0b" },
  "status": "skeleton", "source": "src/pages/Home.tsx",
  "layout": { "id": "blk_root", "type": "section", "label": "Home", "direction": "column", "children": [ … ] }
} ] }
```

(page objects also take `"replicaFile": "replica/pg_home.tsx"`)

Block: `{ id, type, label, text?, summary?, direction?, sizeHint?, source?, children? }`
- `type`: section | row | column | nav | hero | card-grid | list | form | footer | text | image | button
- `label`: short recognizable name (shown on hover/inspector).
- `text`: the **actual visible copy** (heading text, button caption, first ~80 chars of a paragraph) — set it on every text/button/hero leaf; it renders verbatim in the wireframe so the user recognizes the page.
- Page `theme` `{bg, fg, accent}`: pull the real CSS colors (page background, main text color, brand accent) so the wireframe card matches the app's look. Set it on every page.
- `source`: the real file that owns this block (component path). Set it on every block whose owner differs from its parent's — this is what lets you apply the diff later without re-searching.
- Keep depth sensible (3–5 levels); every meaningful visible element should exist, but don't model every span.
- Ids must be unique and stable; prefix `pg_`/`blk_` plus a slug.
- Space pages on the canvas: x += 480 per page.
- Top-level `brief` is optional at extraction time (the user edits it in the UI); if the app has an obvious existing aesthetic, seed it so redesigns preserve the brand.

Then snapshot the baseline: `dreative baseline` (start the server first, step 2, if not running).

## 2. Launch

```
dreative start   # serves http://localhost:4820, opens browser (background this)
```

Tell the user the UI is open: they can view the **Replica** tab (1:1 copy of their real page, hover shows your summaries), drag elements in **Layout**, add/remove blocks, set the **Design brief** (preset + dials), attach reference images and prompts, hit **🎨 Design all**, and click **Finish** when done.

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
| `propose-skeletons` | `{prompt, brief?}` | Array of 1–3 `{name, layout}` page proposals (block schema above), structured per DESIGN.md layout rules |
| `propose-variants` | `{pageName, layout, brief?}` | Array of 1–3 `{name, layout}` variants |
| `edit-block` | `{block, instruction}` | The updated block JSON (same id) |
| `design-page` | `{pageName, layout, brief?, plan?, refImage?, blockRefs, designPrompt?, previousFile?, siblingPages, outFile}` | Write a single-file React+Tailwind component (default export, no imports beyond react) to `.dreative/<outFile>`; every block id in layout must appear as `data-dreative-id="<id>"`. **`plan` is Dreative's pre-computed design decision — execute it, don't re-decide:** it carries resolved dials, a layout family per section (`plan.sections`, sections may carry `skills` tags like `["3d"]`), spacing/motion budgets (`plan.directives`), doctrine violations to fix (`plan.lints`), and required specialist skills (`plan.skills` → read `skills/<name>.md` first). DESIGN.md still governs everything the plan doesn't specify. Read `refImage`/`blockRefs[].refImage` (paths under `.dreative/`) with your image tools; if `previousFile` set, read it and preserve prior element edits. Respond `{"ok":true}` |
| `edit-element` | `{file, elementId, instruction, refImage?}` | Edit `.dreative/<file>` in place, only the element with `data-dreative-id=elementId`, keeping DESIGN.md rules intact. Respond `{"ok":true}` |

A "Design all pages" click in the UI arrives as one `design-page` request per page, back to back: keep visual consistency across them (same accent, type scale, radius system — the first page you design sets the system for the rest).

Token rules: only read ref images when a request names them; never dump whole files into responses; for edits, edit files directly instead of returning code.

## 4. Apply (finish)

The finish event's `diff` (also saved at `.dreative/finish.json`) contains only what changed vs the baseline:

- `pagesAdded` — full layouts; create real pages/components for them.
- `pagesRemoved` — confirm with the user before deleting real code.
- `pagesChanged` — per page: `blocksMoved` (reorder in the source), `blocksAdded`, `blocksRemoved`, `blocksChanged` (only differing props listed; `refImage` = style reference to match, `intents` = behavior notes), plus page-level `refImage`/`designPrompt`.

Use each block's/page's `source` pointer to open **only the owning files**, and each block's `summary` to recall what an element does **without re-reading unrelated code**. Read annotated ref images now (paths relative to `.dreative/`). Make the real code match the final layout and annotations, run the project's checks, and summarize what you changed.
