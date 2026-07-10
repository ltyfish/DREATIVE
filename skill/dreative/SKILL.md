---
name: dreative
description: Frontend design skill + optional visual round-trip editor. Use for ANY frontend design work — redesign/restyle/build pages, landing pages, animations, motion, 3D, micro-interactions, "make my UI look good" — and for visual editing when the user says "open dreative" or "let me edit the layout visually". Default is direct design: apply the design doctrine straight to the codebase. The browser editor (extract → wireframes → edit → apply diff) is an optional mode the user can ask for.
---

# Dreative — frontend design skill (+ optional visual editor)

You (the coding agent) are the intelligence. Dreative has **two modes**:

- **Mode A — Direct design (default).** The user asks you to design, redesign, restyle, animate, or build UI. For any non-trivial request, FIRST run Plan Mode per `PLAN.md` (same folder): probe your environment's capabilities (image-gen, video-gen, browser tools), draft a section-by-section blueprint with a media plan and fallbacks, bundle every user decision into one structured question round, persist the approved plan, then execute assets-first. Read `DESIGN.md` (and any specialist `skills/<name>.md` the plan calls for), then design/edit the real code directly. No server, no extraction, no wireframes. When you finish, add one closing note: *"Tip: run `dreative start` / say 'open dreative' if you want to tweak this visually — I'll extract the pages into an editable canvas."* That's the only place the editor should come up; never force the round-trip on a plain design request. **Depth first:** when the request implies more than a fresh coat of paint ("redesign", "change it entirely", "make it like <reference site>"), present DESIGN.md §11's transformation-depth ladder (restyle → re-layout → restructure → reimagine) as explicit options and let the user pick BEFORE designing; a confirmed restructure/reimagine means rebuilding markup, component trees, and routing for real — never just editing stylesheets on the old skeleton. **Preservation contract (non-negotiable when redesigning existing code):** BEFORE editing any existing page, build the preservation manifest per DESIGN.md §11 (every link, id/data-attribute, handler, form field, visible string, data view, and conditional state — tabs, modals, auth branches); AFTER redesigning, mechanically verify each entry survives in the new code and report the preservation ledger. Restructure moves things; it never loses them. **Real motion engineering:** when motion/3d/immersive/cinematic treatments are chosen, deliver them with the proper libraries per the skill files (GSAP + ScrollTrigger, Lenis, `motion/react`, three.js/R3F) — actually add the dependencies to the project (`npm i gsap lenis` etc.), wire providers/render loops, and build the choreography. A static page with a few CSS transitions does not fulfill a motion request; the target is unseen.co-grade coordinated animation, the shipped result must clear the motion-dial inventory in `skills/motion.md` §9, and the self-critique pass must name the specific animations shipped. **Generated media:** probe your environment for image/video generation tools before designing and use them per DESIGN.md §7 — generated hero imagery, textures, and especially seamless video loops (hero backgrounds, pre-rendered living surfaces, hover previews) integrated into the motion system are among the highest-impact upgrades available. **Skill picker:** in Plan Mode's single question round (PLAN.md §3 — use the agent's structured question tool, e.g. AskUserQuestion, multi-select), offer the specialist skills with a one-line plain-language description each so the user chooses the treatments they want — recommend the ones the request obviously implies and mark them "(Recommended)":
  - **motion** — scroll animations, staggered entrances, parallax, kinetic type
  - **interaction** — micro-interactions: hover states, magnetic buttons, cursor effects, tactile feedback
  - **3d** — WebGL / three.js scenes, shader backgrounds, 3D product showcases
  - **immersive** — award-site feel: the page becomes a spatial world, scroll-as-journey, page transitions
  - **cinematic** — dark, shader-graded experiential look: fluid/particle surfaces, drag-to-explore, sound
  - **refined** — premium clean business look: whitespace, photography, calm minimal motion (the professional pole)
  - **media** — generated images/video woven into the motion system: hero video loops, distortion galleries, living thumbnails
  - **ux** — make everything actually work: nav, mobile menu, forms, states, keyboard, nothing blocks clicks (recommend by default)
  - **mobile** — first-class phone experience: clean, tidy, thumb-ergonomic, with animations scaled to mobile (calmer than desktop, still premium)
  Plus a "none — plain design doctrine only" option. Skip the question only when the user already named the treatments or the request is trivially a restyle; read each chosen `skills/<name>.md` before designing.
- **Mode B — Visual round-trip (only when asked).** The user explicitly wants the visual editor ("open dreative", "let me edit visually"). Flow: **extract → baseline → serve requests → finish → apply**. Be token-frugal at every step: read only the files you need, never re-read the whole app, and keep JSON compact.

Everything below §0 describes Mode B; the design doctrine paragraphs apply to both modes.

**Design quality is a hard requirement.** `DESIGN.md` (same folder as this file) is the design doctrine. Read it ONCE before servicing the first `propose-skeletons`, `propose-variants`, `design-page`, or `edit-element` request, keep it in mind for all later ones, and run its pre-flight checklist (§12) before every respond. Requests may carry a `brief` object (aesthetic preset + vibe + dials set by the user in the UI); when present it is the user's explicit direction and overrides doctrine defaults. Before writing any `design-page` code, state (to yourself, one line) the register, the design read, and the signature element — if you cannot name all three, you are about to produce the generic default; stop and commit first.

**Specialist skills.** The `skills/` folder next to this file holds expert playbooks for advanced work: `motion.md` (animation & scroll choreography), `3d.md` (WebGL/three.js/shaders), `interaction.md` (micro-interactions & effect craft), `immersive.md` (award-site worlds, spatial page transitions, scroll-as-journey), `cinematic.md` (dark shader-graded experiential interfaces: fluid/particle surfaces, drag-to-explore, click & hold, sound design — opt-in aesthetic), `refined.md` (premium clean business/DTC/e-commerce: restraint, photography, whitespace — the calm pole), `media.md` (generated images/video as motion material: production pipeline, DOM and WebGL media treatments, media planes), `ux.md` (the working-page contract: nav, forms, states, keyboard, pointer-events audit — load for any product-register page), `mobile.md` (mobile as a first-class surface: calm-premium motion translation, ergonomics, mobile verification). All are universal: they apply directly to any codebase in Mode A; the editor is never required. When a request's `plan.skills` lists names, read each listed `skills/<name>.md` ONCE before writing code (then keep it in mind, like DESIGN.md); when `plan.sections[].skills` tags a section, that section gets that treatment (e.g. "this hero has 3d"). If the brief/prompt clearly calls for one of these but the plan missed it, read it anyway. If a listed file isn't installed, proceed on DESIGN.md alone and note it to the user (`dreative install-skill` installs all).

**References the user gives you.** If the user attaches screenshots/images, read them with your image tools and treat them as the visual target (extract palette, type feel, layout family, motion cues from any described behavior). If the user names reference URLs, fetch them (browser tools if available, else web fetch of the HTML — look at real script/font/class evidence, not just the text) and distill what specifically to borrow before designing; never guess at a named reference from memory alone when you can look.

**Verification pass (Mode A, required before declaring done).** Doctrine at write-time is weaker than judgment at review-time, and screenshots alone cannot catch broken function — a dead WebGL canvas, a menu that won't close, an invisible layer eating clicks all screenshot fine. Verification is TWO stages, both mandatory.

*Stage 1 — runtime gates (functional).* Run the app with browser tools and prove the page WORKS: (a) **console clean** — zero uncaught errors/unhandled rejections while loading, scrolling the full page, and interacting; (b) **effects provably running** — if WebGL shipped, the canvas has a live context and draws (not black/blank); if animations shipped, sample a moving element's transform twice ~500ms apart and confirm it changes, and confirm scroll triggers fire at their positions; if video shipped, confirm `!video.paused` and the poster shows pre-play; (c) **interaction smoke test** — run `skills/ux.md` §7's functional audit (click nav links, open/close the mobile menu, submit a form invalid+valid, tab through, hit-test controls inside effect-heavy regions); (d) at ~390px too (`skills/mobile.md` §5 when mobile shipped). **Failure doctrine:** any effect that fails a runtime gate is fixed or replaced with its planned fallback (PLAN.md §2) before done — never shipped broken, never silently removed; the final report names what fell back and why.

*Stage 2 — visual self-critique.* Screenshot the result at desktop AND ~390px mobile width, then grade the screenshots against this rubric — (1) would a stranger name the brand's register and audience from one glance? (2) does it pass DESIGN.md §2's slop tests *as rendered* (not as intended)? (3) is the signature element actually visible and working? (4) spatial integrity per DESIGN.md §15 — scan the screenshot for anything overlapping anything else: controls covered by other elements, rows/text clipped at a viewport or container edge, two floating widgets fighting for the same corner, fixed bars hiding content; overlap failures outrank aesthetic ones — fix them first? (4b) any contrast failure, unloaded font/image, or motion jank? (5) does mobile hold up per DESIGN.md §13? (6) preservation ledger clean — every link, action, form field, text string, and tab/modal/state from the manifest present or logged as intentional? (7) if motion treatments were chosen: are the animation libraries actually installed and imported, and can you name ≥3 specific shipped animations (element + trigger + duration) visible in the running page? (8) if generated media shipped: posters present, loops playing, treatments wired per `skills/media.md` §5's floors? Fix what fails and re-check once. If you cannot run the app or screenshot (no browser available), say so explicitly and degrade honestly: walk the rendered DOM/CSS mentally against both stages' rubrics, grep for the runtime-gate evidence (imports wired, providers mounted, pointer-events on overlay layers, fallback branches present), and tell the user which gates could not be verified — never silently skip the pass.

## 0. Setup

Requires `dreative` on PATH (`npm i -g dreative` or `npx dreative`). All commands run from the user's project root. State lives in `.dreative/` (paths in payloads are relative to `.dreative/`).

## 1. Extract (code → layout + replica)

Goal: replicate the app's current UI **view-by-view** so the user recognizes every screen. Do this **one page at a time** — find the routes/pages first (router config, pages/ dir, app/ dir), then open only each page's component files. **Single pass per page:** while the source is in front of you, produce all three outputs at once (layout JSON, replica file, summaries) — never revisit a file for a second output.

**One Dreative page per VIEW, not per route file.** If a route renders mutually-exclusive views — tab panels, admin vs viewer modes, auth states, wizard steps, a modal that fills the screen — each view becomes its own Dreative page. A page's layout must show exactly what the user sees at one moment; never stack multiple tab panels' content into one layout. Name split views `"<Screen> — <View>"` (e.g. "Admin Studio — Library", "Admin Studio — Ranking Board"), give them the same `source`, the same `group` (e.g. `"group": "Admin Studio"`), and cluster them on the canvas. Shared chrome (header, tab bar) repeats in each view's layout, with the active tab noted in its `text`.

**Expose hidden UI.** UI that exists but isn't visible by default must still surface, or the user gets a wrong picture of their app:
- *Full-screen or view-sized* hidden UI (modals, dialogs, drawers, overlay panels with real content) → its own Dreative page, grouped with its parent screen (e.g. "Library — Edit Show modal").
- *Small* hidden UI (dropdown menus, tooltips-with-actions, hover-revealed buttons, expandable rows) → model it as a block **inside its trigger's parent**, labeled for what it is (e.g. label "Sort dropdown (opens on click)"), with a `summary` saying when it appears. Don't invent open-state visuals in the replica — the replica shows the default state; the layout is where hidden things are enumerated.

**Fidelity is the whole point.** The wireframe and replica must be recognizable as *that* page at a glance. Model every visible major section in order — hero/banner, search+filter bars, stat/KPI rows, each shelf/carousel with its cards, footers. A real page with 8 visible sections must yield ~8 top-level children, not 3 generic boxes. Card grids get realistic counts (a shelf showing 7 posters → a card-grid the user reads as a row of posters, with real show titles in `text`). Before moving on, self-check: *would the user, seeing only this wireframe, name which page of their app it is?* If not, you under-extracted — fix it before the next page.

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

(page objects also take `"replicaFile": "replica/pg_home.tsx"` and `"group": "Admin Studio"` for split views of one screen)

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
