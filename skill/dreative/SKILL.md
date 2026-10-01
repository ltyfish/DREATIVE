---
name: dreative
description: Design and build distinctive, award-calibre websites with authored motion. Plans concepts, sources or generates real imagery, builds scroll/transition choreography with GSAP/Lenis recipes, and refines in the browser. Use for any frontend design or redesign, landing, product, ecommerce or portfolio site, and any request for creative motion, scroll animation, immersive or Awwwards-style work.
---

# Dreative

The goal is a site people remember: one clear idea, real art-directed material,
motion that carries that idea from the first screen into the task, and execution
that holds at 1440px, 390px and reduced motion. Composition, typography, imagery
and usability come first; motion is how the idea moves through them.

Work through the steps in order. Each step names its command or file. Deeper
references are listed at the end; open one when its step says so.

## 1. Inventory (short)

- Read the brief, required content, primary tasks, existing code/assets and stack.
- Run `dreative doctor` (and `dreative doctor --fix` to install the project's motion
  packages — gsap, lenis, @gsap/react — and the Playwright browser). Tell the user
  in one short list what is missing and the exact command to fix it (machine tools,
  image-generation key, skill installs); continue with what is available.
- Keep `.dreative/NOTE.md` as working memory: concept, selected images, assets
  and their sources, signature moment score, runtime, mobile/reduced forms, open risks.

**Images by host** — decide this now:
- **Codex**: use the built-in `image_gen` tool for direction mockups and every asset.
  It saves under `~/.codex/generated_images/`; bring each into the project with
  `dreative media import --latest-codex --shots .dreative/shots.json --shot <id>`.
- **Claude Code and other hosts with a generator key** (`dreative doctor` shows it):
  `dreative media generate`, or `dreative media fill` for the whole shot list.
- **Claude Code without a key**: build with **placeholders**. Do not spend the budget
  sourcing lookalikes or drawing the product. Declare every image in
  `.dreative/shots.json`, run `dreative media placeholder`, and design around the
  correctly sized slots. The user fills them later with a key (`dreative media fill`)
  or from Codex (`dreative media import`); references update automatically.

## 2. Concept: two or three directions that differ in experience

For each direction write, briefly:

- **Idea** — one sentence about the subject (a tension, gesture, material or behaviour).
- **Signature moment** — the score `input → establish → transform → hold → handoff →
  release`, naming the real image/text that moves and the element it lands in.
- **Route** — opening, development, the working task (shop, read, compare, sign up),
  ending. Each region gets a decided composition, not a default card row.
- **Material** — the exact shots needed (subject, view, light, background, crop) and
  the route to each: supplied, generated, sourced, rendered or authored type/graphics.
- **Type and colour** — a display face with character, a text face, 3–5 colours
  taken from the material, one accent.

Directions differ by how the visitor experiences the subject (index, journey,
editorial cuts, spatial scene, typographic argument), not by palette or filter.
`references/CREATIVE_DIRECTION.md` and `references/CHOREOGRAPHY.md` help develop them.

## 3. Material first: the shot list

Write `.dreative/shots.json` — every image the design needs, each with a full shot
brief. `path` is a stem whose file name equals the id; reference it in code as
`/media/<id>.svg` while it is a placeholder (fill/import rewrite the reference):

```json
{ "version": 1, "shots": [
  { "id": "hero", "path": "public/media/hero", "aspect": "16:9", "role": "hero",
    "prompt": "<subject>, <camera/lens/view>, <light>, <background>, <mood>, copy space left" },
  { "id": "item-01", "path": "public/media/item-01", "aspect": "4:5", "role": "product",
    "prompt": "<item>, ecommerce studio photograph, front view, <fixed light/background suffix>" } ] }
```

Then produce them by host (step 1): Codex `image_gen` + `dreative media import`;
keyed `dreative media fill`; otherwise `dreative media placeholder`. Make the hero and
one subject view first and inspect them at intended size before the rest — a weak
image makes a weak direction. Hold camera, light, background and crop constant
across a product set (`--ref` keeps one subject consistent). `dreative media search`
adds licensed context photography with attribution. `dreative media status` lists
what is still a placeholder. Shot briefs and recovery: `references/MEDIA_SOURCES.md`.

Material rules that apply to every build:
- Real or generated subject imagery holds the focal seats. Drawn stand-ins for a
  product the visitor must inspect or buy are a missing requirement, not a style.
- Fictional subjects get coherent generated representative images, labelled as
  such where it matters. Real products show the real product.
- Texture, type, SVG and procedural graphics are excellent when they are the chosen
  art direction and when a still, crop or texture cannot pretend to be the subject.

## 4. Show directions, then stop for selection

Give each direction a viewable design: generated page compositions when a
generator exists (Codex `image_gen`, or a key — `references/VISUAL_DESIGN.md`),
otherwise **coded studies** — the direction's opening and signature moment built in
the real app with its shots (real or placeholder; e.g. `/study/a`), screenshotted at
1440 and 390 and recorded with `dreative motion-capture`. Studies are production
code; the selected one is kept.

Present per direction: name, images/recording, idea, route, material and motion
plan, mobile form, main risk. Recommend one with a concrete reason, then **stop
for the user's choice**. Skip the stop only when the user selected already or told
you to choose autonomously. Delivery profiles (efficient/recommended/showcase) are
budget choices, not designs. Details: `PLAN.md`.

## 5. Foundation

- Tokens: type scale (display set large: 8–20vw headlines with tight tracking are
  normal here), spacing, grid, colours, and motion tokens from the recipes.
- Motion stack: for scroll-led work use GSAP + ScrollTrigger (+ SplitText, Flip) with
  Lenis, set up exactly as **R0 in `references/MOTION_RECIPES.md`**; read that file
  now. Use CSS for hover/focus/press, Motion (framer) for React component state,
  three/R3F/OGL only when the subject is spatial. One owner per animated property.
- Assets: responsive derivatives (`srcset`, AVIF/WebP), `decode()` critical images,
  posters for video, explicit width/height.

## 6. Build the signature moment first, at full fidelity

Build the hardest moment with the real material, its entry, its hold and its
landing in the real destination (usually the first task region). Start from the
matching recipes (R1–R10) and compose them around the subject. Motion is never a
placeholder: build the real mechanism now. The only allowed image placeholders are
declared shots from step 3, at their final size, crop and position, so filling them
changes nothing else.

Then watch it: `dreative motion-capture --url <preview> --out .dreative/capture
--from <entry selector> --to <destination selector>`. Compare the frames to the
selected design. Fix crop, scale, timing and the join before moving on.

## 7. Complete the route

Compose each remaining region with its own decided relationship (scale, crop,
density, mode) while carrying the visual grammar from the signature moment.
Give the task surfaces the same craft: filtering with Flip, image-to-detail
handoff, bag/drawer with 0.35–0.6s state motion, visible focus, touch-sized controls.
Close with a composed ending that returns to the opening idea. Read
`references/CHOREOGRAPHY.md` when the route feels like a hero followed by a template.

Fund three things separately: responsive controls, continuity between regions, the
signature set-piece. A quiet region may be still; an unmade decision may not.

## 8. Review in the browser and fix

- Serve the real route. `dreative look --url <preview> --out .dreative/look` and view
  the tiles; run motion-capture for normal, touch and reduced motion.
- Check 1440 and 390 (320 when content is dense): crop, hierarchy, overflow,
  collisions, invisible lower-page content on direct entry, focus, Escape, touch.
- Scroll slow, fast, reverse and reload mid-page. Pins must release; nothing stays hidden.
- Fix what you see, recapture, compare to the selected design. `references/VISUAL_REFINEMENT.md`.

## 9. Finalize and report

Run the production build, then
`dreative finalize --codex|--claude --profile <recommended|efficient|showcase> --visual-smoke-url <preview-url>`
(Showcase also needs `--mechanism-contract` and `--experience-map`, see
`references/SHOWCASE.md`). Completion requires `DREATIVE_CHECKS_PASSED`; a failure
means the build is incomplete — list the blockers. The marker certifies commands,
not taste.

Report separately: technical checks, whether the selected experience and material
shipped, and what remains for human taste review. Include `dreative media status`:
list every open placeholder shot and how to fill it (key + `dreative media fill`, or
Codex `image_gen` + `dreative media import`). Use **Implementation complete;
human taste verdict: awaiting user review** only when the requested material,
behaviour and selected motion actually shipped; with open placeholder shots say
**Implementation complete except N image shots (placeholders)**. Never award
yourself acceptance.

## Craft reference points

- **Type**: one expressive display face used big and confidently; a quiet text face;
  mono/small caps only for real metadata. Set line breaks by hand on display lines.
- **Layout**: asymmetric 12-column grid, extreme scale contrast (full-bleed image
  next to small text), generous negative space, deliberate overlaps.
- **Image**: few large images beat many small ones; crop for the composition;
  one consistent light and colour family across the set.
- **Motion**: few motifs, done fully. Ease out strongly (`expo.out`), overlap
  neighbours, hold resolved states, keep controls live mid-animation.
- **Generic tells to remove**: centred hero + three cards, uniform fade-up on every
  block, default palette, motion only in the hero. See `exemplars/SLOP.md` if the
  render looks generic.

## Resources

| When | Open |
|---|---|
| Presenting directions and selection | `PLAN.md` |
| Generated page mockups or implementing a design image | `references/VISUAL_DESIGN.md` |
| Writing motion code (step 5–7) | `references/MOTION_RECIPES.md`, lab `systems/motion-recipes.html` |
| Choosing the mechanism for a named treatment (parallax, pixelation, sequence…) | `skills/motion.md` |
| Composing route, joins, task and ending | `references/CHOREOGRAPHY.md` |
| Shot briefs, sourcing, generation recovery, rights | `references/MEDIA_SOURCES.md` |
| Frame sequences, video, depth, 3D material | `references/MOTION_MATERIAL.md`, `skills/3d.md` |
| Image ↔ canvas continuity through a join | `references/MEDIA_HANDOFF.md` |
| Studying a live award site or the user's references | `references/PRODUCTION_STUDIES.md`, `references/REFERENCE_ADOPTION.md`, `references/CREATIVE_RESOURCES.md` |
| Runtime choice and integration details | `references/CREATIVE_EXECUTION.md`, `frameworks/<stack>.md` |
| Reusable native mechanisms without dependencies | `systems/NATIVE_FOUNDATIONS.md` |
| Stateful controls, mobile, UX, type | `skills/interaction.md`, `skills/mobile.md`, `skills/ux.md`, `skills/refined.md` |
| Immersive/cinematic/experimental treatments | `skills/immersive.md`, `skills/cinematic.md`, `skills/experimental.md` |
| Rendered review and correction | `references/VISUAL_REFINEMENT.md` |
| Showcase delivery | `references/SHOWCASE.md` |
| Local evaluator handoff (only if `.dreative/evaluation/README.md` exists) | `references/EVALUATION_HANDOFF.md` |
| Maintaining this skill | `skills/learning.md`, repository-only `references/DOGFOOD_LESSONS.md` |

Read a file once when its step arrives; reread only after compaction or a change.
