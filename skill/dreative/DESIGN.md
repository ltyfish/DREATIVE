# Dreative Design Doctrine

You MUST read this file before servicing any `propose-skeletons`, `propose-variants`,
`design-page`, or `edit-element` request. It exists because LLM-designed UIs converge
on the same templated look ("AI slop"). Every rule here is a correction of a known
model default. Apply them; do not treat them as suggestions.

## 1. The design read (always first)

Before generating anything, form a one-line read from the design brief + page layout:
"<page kind> for <audience>, <vibe> language, leaning <aesthetic family>."
The request payload may include a `brief` object:

```json
{ "aesthetic": "minimal", "vibe": "calm, Linear-style", "audience": "technical buyers",
  "variance": 6, "motion": 4, "density": 3, "notes": "..." }
```

If `brief` is present it is the user's explicit direction: obey it. If absent, infer
from page names, copy, theme colors, and existing code style, then pick deliberately.
Never silently fall back to the generic LLM default aesthetic.

### Aesthetic presets (what each name means)

- `minimal` — Linear-clean: restrained neutrals, one accent, generous space, motion 3-4.
- `editorial` — magazine: strong type hierarchy, asymmetric grid, real imagery, sparse UI chrome.
- `premium` — Apple-adjacent consumer: large confident type, rich imagery, refined motion 5-7.
- `playful` — bold color, springy motion 7-9, asymmetric layouts, still disciplined.
- `brutalist` — raw borders, mono type, flat color, radius 0, no shadows, no gradients.
- `dark-tech` — off-black surfaces, mono accents, terminal cues used sparingly.
- `trust` — public-sector/regulated: symmetric, dense-ish, motion ≤2, maximum legibility.

### The three dials (1-10)

- `variance` — 1 perfect symmetry → 10 asymmetric/masonry/huge offsets. Default 7.
- `motion` — 1 static → 10 scroll choreography. Default 5.
- `density` — 1 art-gallery airy → 10 cockpit. Default 4.

Dials gate everything below. High variance = asymmetric grids (`2fr 1fr`), offsets,
big empty zones; it MUST still collapse to clean single-column under 768px. If
motion > 3, everything animated must honor `prefers-reduced-motion`.

## 2. Layout hard rules

- Hero fits the initial viewport: headline ≤ 2 lines, subtext ≤ 20 words, CTA visible
  without scroll. 4-line hero headline = font-size error, not copy error.
- Hero has max 4 text elements (eyebrow OR brand strip, headline, subtext, CTAs).
  No trust strips, pricing teasers, or feature bullets inside the hero.
- Anti-center bias: when variance > 4, avoid the centered-hero-over-gradient default.
  Use split 50/50, left content / right asset, or asymmetric whitespace.
- Nav: single line at desktop, height ≤ 80px.
- A layout family (3-col cards, split image+text, full-width quote…) appears at most
  ONCE per page. 8 sections need ≥ 4 distinct layout families.
- Max 2 consecutive image+text zigzag sections; the 3rd must break the pattern.
- Three identical feature cards in a row is banned. Vary sizes or use a bento with
  exactly as many cells as you have content (no empty filler tiles); 2-3 bento cells
  need real visual variation (image/tint/pattern), not all white-on-white text.
- Cards only when elevation means hierarchy; otherwise `border-t`/`divide-y`/space.
  Nested cards are always wrong.
- Lists > 5 items never render as a default `<ul>`/`divide-y` stack: group into
  chunks, 2-col card grid, tabs, or a marquee/carousel. Never `border-t` + `border-b`
  hairlines on every row.
- Grid over flex-math: `grid grid-cols-1 md:grid-cols-3 gap-6`, never `w-[calc(33%-1rem)]`.
- `min-h-[100dvh]`, never `h-screen`. Explicit mobile collapse for every multi-column
  layout in the same component.

## 3. Typography

- Body ≤ 65-75ch, `text-wrap: balance` on h1-h3.
- Display headline default `text-4xl md:text-6xl tracking-tighter`; go `text-7xl+`
  only for 3-5 word headlines. Clamp ceiling ~6rem. Letter-spacing floor -0.04em.
- Don't default to Inter; prefer Geist, Satoshi, Outfit, Cabinet Grotesk, or what the
  project already uses. Inter is fine for neutral/trust briefs.
- Serif is NOT the default for "creative/premium" briefs; sans display is. Serif only
  when the brief is genuinely editorial/luxury/publication and you can say why.
  Fraunces and Instrument Serif are banned as defaults.
- Emphasis inside a headline = italic/bold of the SAME family, never a random serif word.
- Italic display words with descenders (y g j p q) need `leading-[1.1]`+ and bottom reserve.

## 4. Color

- One accent per page, locked: chosen in the hero, used identically in every section.
  Neutrals from ONE family (don't mix warm and cool grays).
- No AI-purple gradients, no neon glows, no gradient text, no glassmorphism-by-default.
- No pure `#000`/`#fff`; use off-black/off-white.
- The cream/beige + brass/clay "premium artisan" palette is banned as a default reach.
  Rotate real alternatives: cold luxury (silver/chrome), forest green + bone + amber,
  black + tan, cobalt + cream, terracotta + slate, monochrome + one saturated pop.
- Respect the page's existing `theme` colors from the layout when redesigning an
  extracted app: brand preservation beats these defaults.
- Contrast is non-negotiable: body 4.5:1, large text 3:1, placeholders 4.5:1, every
  CTA label readable on its button. Audit every button and form before responding.
- One theme per page (light OR dark); sections never flip modes mid-scroll.

## 5. Motion

- Every animation must answer "what does it communicate" (hierarchy, storytelling,
  feedback, state change). No motion-for-show.
- Ease-out exponential curves; animate only transform/opacity/filter; no bounce.
- No `window.addEventListener("scroll")`; use IntersectionObserver, CSS scroll-driven
  animations, or Motion/GSAP scroll tools.
- Max one marquee per page. `prefers-reduced-motion` fallback for everything.
- Content must be visible by default; reveals enhance, never gate visibility.

## 6. Content, imagery, copy

- Real images beat fake ones: use an image-gen tool if available, else
  `https://picsum.photos/seed/<descriptive-seed>/<w>/<h>`. Div-built fake screenshots,
  fake terminals, and hand-drawn/sketchy SVG illustrations are banned. A pure-text
  page is not minimalism, it is incomplete.
- Logo walls: real SVG marks (Simple Icons) or generated monograms, logos only, no
  category labels, placed under the hero never inside it.
- No "Jane Doe"/"Acme"/generic avatars/fake-perfect numbers (99.99%). Realistic
  names, believable messy data, or clearly-labeled mock data.
- Copy: ≤ 8-word section headlines, ≤ 25-word subtext, one register per page, no
  filler verbs (elevate/seamless/unleash), quotes ≤ 3 lines with real attribution.
- Re-read every visible string before responding; rewrite anything grammatically
  broken or AI-cute. Plain beats clever.

## 7. Banned AI tells (match-and-refuse)

- **Em-dash (—) and en-dash-as-separator (–): zero anywhere visible.** Use periods,
  commas, colons, or plain hyphens.
- Eyebrow labels (small uppercase tracked text above headings): max 1 per 3 sections.
- Numbered section markers (`01 · About`) as scaffolding; section-number eyebrows;
  `01/4` pagination labels on tiles.
- Side-stripe borders (`border-left: 3px solid accent`) on cards/callouts.
- Hero version labels (BETA, V0.6) unless the brief is a launch.
- Scroll cues ("↓ scroll to explore"), locale/weather strips, decoration text strips
  at hero bottom (`DESIGN · BUILD · SHIP`), vertical rotated text.
- Decorative status dots, pills/labels overlaid on photos, fake photo credits,
  version footers on marketing pages, "Quietly trusted by" copy, custom cursors.
- Duplicate CTA intent: one label per intent per page ("Get in touch" + "Let's talk"
  on the same page = fail).

## 8. States and quality floor

Every interactive surface ships loading (skeletons shaped like the final layout),
empty, and error states. `:active` gives tactile feedback (`scale-[0.98]`). Labels
above inputs, never placeholder-as-label. Semantic z-index scale, no `z-[999]`.

## 9. Pre-flight checklist (run before every respond)

Mentally verify, fix anything failing, THEN respond:

1. Design read stated/known; brief (if provided) actually obeyed.
2. Zero em/en-dashes visible anywhere.
3. One accent, one neutral family, one theme, one radius system, one icon family.
4. Hero: ≤ 2-line headline, ≤ 20-word subtext, ≤ 4 text elements, CTA above the fold.
5. Eyebrow count ≤ ceil(sections / 3); no numbered-section scaffolding.
6. No two sections share a layout family; ≤ 2 consecutive zigzags; no 3-equal-cards.
7. Every CTA/form passes contrast; no CTA label wraps at desktop.
8. Real images or labeled placeholders; no div fake-screenshots; no sketchy SVGs.
9. Motion motivated + reduced-motion safe; content visible without JS.
10. Mobile collapse explicit; `100dvh` not `h-screen`.
11. Copy self-audit done; no AI-tell strings; realistic data.
12. Every block id from the layout appears as `data-dreative-id` (design-page only).

If a check fails, the output is not done. Fix it before responding.
