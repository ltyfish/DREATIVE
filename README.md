# Dreative

Layout-first AI UI builder. The division of labor: **AI proposes rough wireframe skeletons → you arrange and edit them on a canvas (you own layout/IA) → AI does a per-page visual design pass from a reference image + prompt (AI owns styling)**.

AI calls run through the **Claude Agent SDK**, which reuses your existing Claude Code login — no API key setup.

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

1. **Propose layouts** — type a prompt in the top bar → AI generates 3 wireframe page cards on the canvas.
2. **Arrange** — drag page cards around; double-click a card to open the wireframe editor; drag blocks to reorder; select any block and prompt the AI to change its **structure or functionality** ("make this a carousel", "this button opens a signup modal" → saved as intents).
3. **Design** — select a page, attach a reference image + design prompt, hit *Generate design*. AI produces a React + Tailwind page implementing your skeleton and all intents.
4. **Refine** — in Preview mode, click any element and prompt a targeted change.
5. **Export** — copies generated `.tsx` pages into `./src/pages`.

## Dev

```sh
npm run dev       # server on :4820 (tsx watch) + Vite UI on :5199 with proxy
```
