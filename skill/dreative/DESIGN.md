# Dreative Design Doctrine

You MUST read this file before servicing any `propose-skeletons`, `propose-variants`,
`design-page`, or `edit-element` request, and run §12 before every respond. It exists
because LLM-designed UIs converge on one templated look. Every rule corrects a known
model default; none is a suggestion. Requests may carry a `plan` (Dreative's
pre-computed decision: dials, per-section layout families, budgets, lints) — execute
the plan, apply this doctrine to everything the plan doesn't specify. When
`plan.skills` names specialist skills (`motion`, `3d`, `interaction`, `immersive`,
`cinematic`, `refined`, `media`, `ux`, `mobile`), the matching
`skills/<name>.md` files extend this doctrine for that request — read them first;
where they go deeper than a section here, they win.

Rules come in two tiers. **Hard gates** — preservation (§11), spatial integrity
(§15), the layout hard rules (§5), banned tells (§10), runtime verification —
are checked mechanically and never traded away. Everything else is **craft
doctrine**: binding defaults you deviate from only with a reason you could
defend to the user. When attention is scarce, gates outrank craft rules, and
craft rules outrank stylistic preference — but a page that only clears gates
and shows no point of view is still a failure of this file.

## 1. Register: the first decision

Every page is one of two registers. Misclassifying it is the biggest single error.

**BRAND** (design IS the product): landing pages, marketing, portfolios, campaign
pages, about pages, long-form content. Bar = distinctiveness. A visitor should ask
"how was this made?", not "which AI made this?". Average is no longer findable;
restraint without intent reads as mediocre. Go big or go home.

**PRODUCT** (design SERVES the product): app UI, dashboards, settings, tables, tools,
authenticated surfaces. Bar = earned familiarity. Would a user fluent in Linear,
Figma, Notion, Stripe trust this instantly, or pause at every subtly-off component?
Failure mode is not flatness, it is strangeness without purpose. The tool should
disappear into the task.

Pick by the page's job, not the project. One app can hold both registers.

## 2. The design read and the slop tests

Before generating, state a one-line read: "<page kind> for <audience>, <vibe>
language, leaning <aesthetic family>". If the request carries a `brief`, obey it —
it is the user's explicit direction.

Then run three tests on your intended output; restart if any fails:

1. **First-order reflex**: could someone guess your palette + theme from the category
   alone ("cookware → cream + brass", "devtool → dark + mono")? That's the
   training-data default. Rework. The three most-shipped default aesthetics: warm
   cream + high-contrast serif + terracotta accent; near-black + acid-green/vermilion;
   broadsheet hairline-rules-and-columns. Where the brief leaves an axis free, never
   spend that freedom on one of these.
2. **Second-order reflex**: could someone guess it from category + anti-reference
   ("fintech that's not navy → terminal-dark", "SaaS that's not cream → editorial
   serif + mono labels")? The trap one tier deeper. Rework again.
3. **Competitor sentence**: describe what you're about to build as a competitor would
   describe theirs. If the sentence fits the modal page in the category, restart.

### The working process: explore, commit, review — before code

Never design by accretion, and never commit to the first concept. Three passes:

1. **Explore** — sketch THREE genuinely divergent concepts, one line each:
   palette strategy + type voice + signature element + hero thesis. Different
   families of idea, not three shades of one (if two concepts share a palette
   strategy or signature type, they are one concept — replace one). The slop
   tests below are filters: they reject bad ideas but never generate better
   ones; this pass is where a better idea gets a chance to exist. Pick one,
   and record the two rejects with a one-line reason in the plan file
   (PLAN.md §4).

   **The entropy draw (before sketching, at expressive/award ambition).** Your
   "random" pick is your reflex — the same fonts, the same hero move, run
   after run. So the variance comes from OUTSIDE your head: roll a real random
   number (`node -e "console.log(1+require('crypto').randomInt(20))"`, or
   `$RANDOM % 20 + 1`, or read digits off `date +%N`) and record the literal
   command AND its output in plan.md. The roll picks one **provocation** from
   the table below; at least ONE of the three explore concepts must take it
   literally, and if that concept wins, the provocation ships — visibly, not
   as a token gesture. Roll a second number (1–6) to pick a **forced-rotation
   axis** — 1 palette strategy · 2 type voice · 3 hero concept · 4 nav/page
   architecture · 5 signature driver · 6 set-piece family — and that axis must
   differ from anything in your ledger's last 3 entries AND from the most
   obvious genre default. One re-roll is allowed per table if the result is
   genuinely incompatible with the brief or usability — record both rolls and
   the reason. A plan file with no recorded roll at expressive+ is incomplete.

   **Provocation table (roll 1–20):**
   1. The hero image is not a rectangle.
   2. One image behaves like a physical object — mass, drag, inertia, release.
   3. Type and imagery share one depth space; one passes through the other.
   4. The page has a light source, and media visibly responds to it.
   5. Scroll does something besides move the page down in one section.
   6. The cursor is an instrument from the subject's world and acts on media.
   7. One section is traversed by dragging, not scrolling.
   8. An image disassembles into what it is physically made of.
   9. Media leaks outside its frame and touches the UI around it.
   10. Something never stops moving, slowly, for the whole visit.
   11. The visitor's behavior (speed, hesitation, return) changes an element.
   12. Two media assets visibly react to each other.
   13. A transition destroys something that reassembles as something else.
   14. The palette of a chapter is sampled live from the media on screen.
   15. One interaction hands the visitor control they didn't expect to have.
   16. Something pulses to an invisible rhythm, like sound with the audio cut.
   17. The signature element recurs at three scales/roles across the page.
   18. An ordinary control (button, input, nav) is built from the scene itself.
   19. One moment of true depth: layers visibly separate and re-stack.
   20. The final section answers the hero — a visual callback with a twist.
2. **Commit** — write the winner as a compact spec: 4-6 named colors (hex/OKLCH),
   2+ type roles with actual font names, a one-sentence layout description per
   section, the **compositional spine** (§5), the page's ACTUAL hero headline
   plus 2-3 section headlines written in the brand's voice (copy precedes
   layout — type and composition are designed around real words, never
   lorem-shaped assumptions; §8 governs the writing), and ONE **signature
   element** with a mini-spec of its own: what it is, what drives it
   (scroll / cursor / time / data), and why it could only belong to THIS brand
   (subject-world grounding) — plus a novelty check: seen on a template, or in
   your own ledger (below)? Invent again. Spend your boldness there; keep
   everything around it disciplined and quiet. Ground choices in the subject's
   world: its materials, instruments, artifacts, and vernacular ("a coffee
   brand's world: burlap, roast curves, thermometers, cupping notes") — not in
   web-design tropes.
3. **Review** — test the spec against the slop tests below. If any part could apply
   to any similar project, revise that part. Only then build.

**The choice ledger (anti-self-similarity across projects).** Slop tests can't
see your own history — repeating yourself project after project is a
monoculture of one. A global ledger at `~/.dreative/ledger.md` records one
line per completed build: date · project · display/body fonts · palette
strategy + hue · signature-element type · hero concept. During the commit
pass, read it if it exists: anything in the new spec that repeats an axis
from the last 3 entries is now YOUR reflex — rework that axis. After
verification, append this build's line (create the file if missing). The
ledger is also a taste memory: when the user gives a verdict on a shipped
build ("the hero feels generic", "too much motion"), append it to that
build's entry as a one-line `lesson:` — and the commit pass reads lessons
alongside choices, so the same critique never has to be given twice.

**No-media builds: structure IS the media.** When a build ships zero
imagery (no image-gen tool, product register, or the user chose
placeholders), the ambition tier does NOT tier down — it transfers whole
onto layout, type, and motion, and this is where no-media builds die: the
executor, with no assets to arrange, collapses to the one layout it knows
(a vertical list of rounded cards in a centered column) and ships slop that
its own plan didn't describe. Hard rules for any expressive+ no-media build:

1. **The compositional spine must survive to the screenshot.** Whatever
   bespoke structure the plan named (a strip rack, a ledger, a switchboard,
   a timetable) must be RECOGNIZABLE as that thing in the shipped page — its
   physical vocabulary built for real: the holder edge, the notch, the rail,
   the perforation, the column rules. If a stranger shown the screenshot and
   the blueprint's layout-family words couldn't match them, the build
   restyled a card list and called it the spine — that is a depth-honesty
   failure (§11), not a detail.
2. **≥ 2 bespoke drawn/procedural artifacts.** With no photography, the page
   earns visual richness from things MADE for it: a live canvas (meter,
   field, trace), custom SVG structure (rules, notches, connectors, dials —
   drawn, not icon-font), procedural texture/grain, a data-driven ornament.
   A no-media page whose only visuals are borders and border-radius has no
   media plan at all.
3. **Type does structural work.** Multi-scale composition (oversized
   numerals/designators against small mono metadata), real hierarchy per §6
   — not one font-size row layout repeated N times.
4. **Motion budget spends on the structure**, not on entrance fades: the
   spine's own physicality (things racked, tossed, slid, stamped) is the
   choreography. Motion.md's inventory applies at full dial.
5. **A live rendered layer is required at award tier.** No imagery does not
   mean no rendering: the page ships at least one WebGL/canvas system doing
   real graphic work — a particle field, procedural texture/flowfield,
   shader-lit surface, a data-driven instrument that never stops — plus
   dimensional motion somewhere real (CSS 3D card physicality, depth-layered
   parallax, a lit WebGL surface). A no-media award page with zero rendered
   pixels is a text document with transitions. Vocabulary to draw from
   (subject-grounded, not decorative): oscilloscope/waveform traces driven by
   real events · topographic contour lines drifting · dot-matrix/LED field
   that spells live state · plexus line-network connecting related items ·
   isometric grid that lights under the cursor · scan sweep across data
   rows · ASCII/character rain in the brand's glyphs · particle flow along
   the layout's own rails · generative engraving borders · a physical sim
   (springs, gravity) on the UI's actual objects.
6. **Layout creativity means spatial composition, not relocated chrome.**
   Moving the nav to the bottom, a novel tab bar, an unusual dock — that is
   furniture rearrangement, and if it's the build's ONLY inventive move the
   build failed. The invention must live in how the CONTENT is composed:
   asymmetric multi-scale grids, overlapping planes, diagonal/rotated flow,
   sections that share edges and interlock — while staying rigorously
   modern and clean (generous space, disciplined alignment, few colors).
   "Clean" and "insane motion" are the same build: calm composition,
   spectacular behavior.

The slop tests above apply to the RENDERED page: "dark theme + rounded
cards + one accent color" fails the competitor sentence for every no-media
product tool at once — and shipped exactly that once (user verdict on
record: "pure ai slop… I would not want something like that again"). Treat
these rules as a shipped-failure postmortem, not theory.

**Hero thesis:** open with the most characteristic thing in the subject's world —
a headline, an image, a live demo, an interactive moment. Whatever form fits.

### Aesthetic presets (brief.aesthetic)

- `minimal` — Linear-clean: restrained neutrals, one accent, generous space.
- `editorial` — magazine: strong type hierarchy, asymmetric grid, real imagery.
  NOTE: editorial is ONE lane, not the default "tasteful" answer. The
  serif-italic + mono-labels + ruled-columns look is now saturated AI grammar.
- `premium` — confident type, rich imagery, refined motion, zero clutter.
- `playful` — bold committed color, springy motion, asymmetry, still disciplined.
- `brutalist` — raw 1px borders, mono, flat color, radius 0, no shadows/gradients.
- `dark-tech` — off-black surfaces, restrained neon, terminal cues used sparingly.
- `trust` — public-sector/regulated: symmetric, motion ≤2, maximum legibility.

### The three dials (1-10, resolved in `plan.dials`)

- `variance` — 1 symmetry → 10 masonry/offsets/20vw empty zones. >4 forbids the
  centered-hero default. Any asymmetry collapses to clean single-column < 768px.
- `motion` — 1 static → 10 scroll choreography. >3 requires reduced-motion fallbacks.
- `density` — 1 art-gallery (py-32+) → 10 cockpit (hairlines, tabular-nums, no cards).

## 3. Typography

**Font selection procedure (brand register, never skip):**
1. Write three physical-object brand-voice words ("warm, mechanical, opinionated" —
   never "modern" or "elegant").
2. List the three fonts you'd reach for by reflex. Reject any on the ban list below.
3. Pick for the brand as a physical object (museum caption, 1970s terminal manual,
   concert poster, mid-century receipt). Reject the first thing that "looks designy".
4. If the final pick matches the original reflex, start over.

**Reflex-reject fonts (training-data defaults, banned as defaults):** Fraunces,
Newsreader, Lora, Crimson (all), Playfair Display, Cormorant (all), Syne, IBM Plex
(all), Space Mono, Space Grotesk, Inter, DM Sans/Serif, Outfit, Plus Jakarta Sans,
Instrument Sans/Serif. Inter/system stacks ARE legitimate in the product register
and for trust briefs. When an existing app already uses one, identity-preservation
wins — keep it.

**Serif discipline:** "creative/premium brief = serif" is the most-tested AI tell.
Default is sans display. Serif only when the brief is genuinely editorial/luxury/
publication AND you can articulate why this serif fits this brand. Emphasis inside a
headline = italic/bold of the SAME family, never a serif word dropped into a sans
headline. Italic display words with descenders (y g j p q) need `leading-[1.1]`+ and
bottom padding reserve.

**Scale — pick by register:**
- Brand: fluid `clamp()` headings, ratio ≥1.25 between steps, clamp max ≤ 6rem and
  ≤ 2.5× its min. Display tracking floor −0.04em (tighter = letters touch).
- Product: fixed rem scale, ratio 1.125–1.2, one family in 3-4 weights is usually
  right. No fluid type in app UI — no major design system uses it.
- Both: body ≥ 16px and fixed; 45–75ch measure (`max-width: 65ch`); headings
  `text-wrap: balance`, prose `text-wrap: pretty`; ≤ 2-3 families total; never pair
  two similar sans — contrast on a real axis (serif+sans, geometric+humanist) or use
  one family.

**Details that read as craft:** line-height 1.1–1.2 headings, 1.5–1.7 body; ALL-CAPS
labels get `letter-spacing: 0.05–0.12em`; `tabular-nums` on data columns; vertical
rhythm = spacing in multiples of the body line-box (16px × 1.5 → 24px grid);
light-on-dark text compensates on three axes: +0.05–0.1 line-height, +0.01–0.02em
tracking, one weight step down (400→350 effect). `font-display: swap`, preload only
the critical weight, variable font when using 3+ weights.

## 4. Color

**Use OKLCH.** `oklch(L C H)` is perceptually uniform. Build ramps by holding
chroma+hue and varying lightness; reduce chroma near white/black. The hue is a brand
decision — never blue-250 or warm-60 by reflex.

**Pick a color strategy before picking colors:**
- **Restrained** — tinted neutrals + one accent ≤10% visual weight. Product floor.
- **Committed** — one saturated color carries 30-60% of the surface. Brand default
  for identity-driven pages.
- **Full palette** — 3-4 named roles used deliberately. Campaigns, data viz.
- **Drenched** — the surface IS the color. Brand heroes.

Name a real reference before committing ("Stripe purple-on-white restraint", "Klim
#ff4500 drench", "Vercel pure-black monochrome"). Unnamed ambition becomes beige.
On brand surfaces, palette IS voice — don't hedge a Committed palette with neutral
edges. On product surfaces, accent = primary action + selection + state, never
decoration, with a full semantic state vocabulary (hover/focus/active/disabled/
selected/loading/error/warning/success/info) and a second neutral layer for
sidebars/panels.

**Mechanics:**
- Tinted neutrals: chroma 0.005–0.015 toward THIS brand's hue. Pure gray is dead;
  reflex-warm or reflex-cool tinting is the monoculture move.
- 60-30-10 by visual weight: 60% neutral surface, 30% text/borders, 10% accent.
  Accents work because they are rare.
- One accent, one neutral family, locked page-wide and project-wide. No blue CTA
  appearing in section 7 of a warm-gray page.
- Contrast: body 4.5:1 (AAA 7:1 target for hero copy), large text 3:1, UI components
  3:1, placeholders 4.5:1. Gray text on colored backgrounds looks washed out — use a
  darker shade of the background's own hue or alpha of the text color. Audit every
  CTA and form before responding.
- No pure #000/#fff. Dark mode is not inverted light mode: depth from a 3-step
  surface-lightness scale (≈15/20/25% L, brand hue, chroma constant), desaturate
  accents slightly, reduce body weight. Redefine only semantic tokens for dark.
- Heavy alpha usage = incomplete palette. Define explicit overlay colors.

**Banned palettes as default reaches:** AI-purple/violet gradients + glow; the
premium-artisan cream/sand/beige bg (#f5f1ea family, OKLCH L .84-.97 C<.06 hue
40-100) + brass/clay/oxblood accents + espresso text — token names like --cream,
--sand, --bone are tells in themselves. Alternatives to rotate: cold luxury
(silver/chrome/smoke), forest + bone + amber, true black + tan, cobalt + cream,
terracotta + slate, olive + brick + paper, monochrome + one saturated pop. "Warmth"
is carried by accent, type, and imagery — not by a beige body background.
Override: a palette is fine when the existing brand or explicit brief names it.
When redesigning an extracted app, its `theme` colors are the brand — preserve.

## 5. Layout

**Compositional spine (brand register, whenever variance > 4 or ambition is
expressive+).** Color and type get selection procedures; composition deserves
one too — the rules below only bound a layout, they don't give it a point of
view. Before applying them, derive ONE structural idea from a physical
artifact in the subject's world and let it organize the page: a vinyl label's
concentric rings → a radial hero; a boarding pass's rule structure → the
page grid; a contact sheet → the gallery; a cupping form → the comparison
table. Name artifact → idea in the commit spec (§2). The memorable award
sites win on composition, not decoration; this is where that happens.

**Hard rules (failing any = broken work):**
- Hero fits the initial viewport: headline ≤ 2 lines, subtext ≤ 20 words, CTA visible
  without scroll, top padding ≤ pt-24. 4-line headline is a font-size error. Max 4
  text elements (one eyebrow OR brand strip, headline, subtext, CTAs 1+1). Trust
  strips, pricing teasers, feature bullets, avatar rows: all move below the hero.
- Hero needs a real visual. Text + gradient blob is a placeholder, not a hero.
- variance > 4 forbids centered-hero-over-gradient: split 50/50, left-content/
  right-asset, or asymmetric whitespace. Centered is fine for manifesto/launch copy.
- Nav: one line at desktop, height 64–72px (cap 80px).
- A layout family appears at most ONCE per page; 8 sections need ≥ 4 families. Max 2
  consecutive image+text zigzags. No 3-identical-cards row, ever — asymmetric grid,
  2-col, bento, or horizontal scroll instead.
- Bento: exactly as many cells as content (no filler tiles); 2-3 cells carry real
  visual variation (image/tint/pattern), never all white-on-white text.
- Cards only when elevation = hierarchy; otherwise border-t/divide-y/whitespace.
  Nested cards are always wrong. Tint shadows to the background hue.
- Lists > 5 items: group into chunks, 2-col card grid, tabs, or marquee — never one
  hairline-divided stack, never border-t AND border-b per row.
- Split-header pattern (big left headline + small floating right paragraph) banned
  as default; stack vertically at 65ch.
- Grid over flex-math (`grid-cols-3 gap-6`, never `w-[calc(33%-1rem)]`);
  `repeat(auto-fit, minmax(280px, 1fr))` for breakpoint-free card grids;
  `min-h-[100dvh]` never `h-screen`; explicit mobile collapse per section; contain
  at `max-w-7xl mx-auto`; semantic z-index scale, no z-[999].
- ONE radius system: all-sharp, all-soft (12-16px), or documented mixed rule
  ("buttons pill, cards 16, inputs 8"). Cards never above 16px radius.
- Spacing has rhythm: vary generous separations against tight groupings on a
  consistent base unit; brand surfaces use fluid `clamp()` spacing that breathes.
- Structure encodes truth, never decoration: numbering, eyebrows, dividers, and
  labels appear only when they say something true about the content (a real
  sequence, a real category). If removing the device loses nothing, remove it.
- Product register: responsive behavior is structural (collapse sidebar, responsive
  table), not fluid type.

## 6. Motion

Every animation answers "what does this communicate?" — hierarchy, storytelling,
feedback, or state change. "It looked cool" = delete it.

**The 100/300/500 rule:** 100-150ms instant feedback (press, toggle) · 200-300ms
state changes (menu, tooltip, hover) · 300-500ms layout changes (accordion, modal)
· 500-800ms entrances (hero reveal, brand only). Exits run ~75% of enter duration.
Feedback over 500ms feels laggy. Micro-interactions target the 80ms "feels instant"
threshold.

**Easing:** ease-out exponential only — `cubic-bezier(0.25,1,0.5,1)` quart,
`cubic-bezier(0.22,1,0.36,1)` quint, `cubic-bezier(0.16,1,0.3,1)` expo. Bounce and
elastic are dated; banned.

**Register:** brand = one well-orchestrated hero entrance beats scattered
micro-interactions; the uniform fade-and-rise on every scrolled section is the
saturated AI tell. Some brands skip entrance motion entirely — restraint as voice.
Product = 150-250ms, state-conveying only, zero page-load choreography.

**Mechanics:** animate transform/opacity by default; blur/backdrop-filter/clip-path/
masks/shadow allowed when they materially improve the effect, bounded to small areas,
verified smooth. Never casually animate width/height/top/left/margins (use FLIP or
grid-template-rows). Sibling stagger `calc(var(--i) * 50ms)` capped at ~500ms total.
IntersectionObserver (unobserve after firing), CSS scroll-driven animations, or
Motion/GSAP scroll tools — `window.addEventListener("scroll")` is a hard ban. Reveals
enhance an already-visible default; never gate content visibility on a JS-triggered
class (hidden tabs and headless renderers ship blank sections). Max one marquee per
page. `prefers-reduced-motion: reduce` alternative for everything. Optimistic UI for
low-stakes actions; never for payments or destructive ops.

## 7. Imagery

When the brief implies imagery (restaurant, hotel, product, travel, fashion,
portfolio), zero images is a bug, not restraint. Even a minimalist page needs 2-3
real images. Priority: (1) image-gen tool if available in your environment, at the
section's aspect ratio; (2) real photography —
`https://picsum.photos/seed/<descriptive-seed>/<w>/<h>` always resolves; Unsplash
only with verified photo IDs (guessed IDs 404 into broken placeholders); (3)
clearly-labeled placeholder slots + tell the user what's needed. Search for the
brand's physical object ("hand-cut pasta on a scratched wooden table"), not the
category ("Italian food"). One decisive photo beats five mediocre ones. Alt text
carries voice.

Banned: div-built fake screenshots/terminals/dashboards (the #1 AI tell), hand-drawn
"sketchy" SVG illustrations, `feTurbulence` paper-grain, repeating-gradient stripe
backgrounds, decorative grid-line overlays, hand-rolled icon paths. Icons from ONE
library (Phosphor/Radix/Tabler/HugeIcons; Lucide only on request), one strokeWidth
globally. Logo walls: real SVG marks (`https://cdn.simpleicons.org/<slug>`) or
generated monograms — logos only, no category captions, below the hero.

### Generated media (probe your environment, then use it)

Before designing, check what media generation your environment actually offers —
image-gen tools, video-gen tools, or a CLI that can produce them — and treat any
capability found as a first-class design material, not a nice-to-have:

- **Images**: generate hero photography, product/context shots, and textures at
  the section's exact aspect ratio, prompted for the brand's physical subject
  and the page's light temperature so they grade into the palette. Generate the
  grain tile and any masks/mattes too instead of hand-rolling SVG.
- **Video**: a generated 5–10s seamless loop is one of the biggest single UI
  upgrades available — use it as: a hero background (muted, `autoplay loop
  playsinline`, poster frame, `prefers-reduced-motion` swaps to the poster);
  the budget "living surface" (a pre-rendered fluid/particle/atmosphere loop
  instead of a GPGPU sim — cinematic.md's budget recipe); hover-preview loops
  on work cards; or an image-sequence for scroll-scrubbed narratives (export
  frames, scrub per motion.md).
- **Integrate with motion, don't just embed** — a raw `<video>`/`<img>` dropped
  in a section is not the treatment. Generated media enters the page THROUGH the
  motion system; pick 1–2 treatments per page from this vocabulary (or invent in
  its spirit), matched to the register:
  - **Pixel/dither reveal**: video or image materializes from coarse blocks —
    a shader that lerps sample resolution from ~24px mosaic to full res (or a
    stepped `image-rendering: pixelated` downscale swap for the budget path),
    driven by scroll progress or hover. Reads as digital-craft; dark-tech and
    editorial registers.
  - **Floating media**: images hover in depth with slow damped drift (±6-10px,
    4-8s loops, each at a different phase), subtle parallax by depth layer, and
    a soft contact shadow — the immersive "paper sheets in space" look without
    WebGL. Cap at 3-5 floaters per view.
  - **Mask-shaped video**: the loop plays inside display type (`background-clip:
    text` / SVG mask on a 10vw+ headline), an arch/circle clip-path, or the
    brand mark — the video becomes typography/identity rather than a rectangle.
  - **Scroll-scrubbed sequence**: generated frames scrubbed by scroll for
    assemble/morph/rotate narratives (motion.md's canvas product story).
  - **Velocity-touched media**: scroll/drag velocity stretches, RGB-splits, or
    ripples the media plane for a beat, settling with damped decay
    (cinematic.md §2) — needs the WebGL media-plane sync.
  - **Hover-woken loops**: stills that crossfade into their video loop on
    hover/focus (240ms), pause + rewind-to-poster on leave; works as generated
    "living thumbnails" on work/product cards.
  - **Curtain/split reveal**: media enters behind a 2-4 panel wipe or an
    expanding inset clip (`clip-path: inset(40% 30%) → inset(0)`), timed with
    the section's line-mask type reveal so image and headline arrive as one
    choreographed beat.
  Whatever the treatment, honor the floors: reduced-motion gets the poster
  frame, hover treatments have focus equivalents, and the effect is justified
  in one sentence like any other motion (§6).
- Discipline: same rationing as everything else — one video loop per view,
  compress hard (H.264/AV1, ≤ 2–4MB per loop, no audio track), lazy-load below
  the fold, and never let generated media replace REAL product screenshots or
  the client's actual photography when those exist.
- If no generation capability exists, say so and fall back down the §7 priority
  list — never fake a video with a div animation.
- `skills/media.md` is this section's deep dive: the production pipeline
  (prompting for the page's light, compression targets, frame sequences), the
  full DOM-tier and WebGL media-plane treatment vocabulary, and the
  entrance/idle/response reasoning frame. Read it whenever generated media or
  motion-integrated imagery ships.

### Surface & light — material identity for every layer

Flat untreated hex fills are the loudest AI tell after Inter-everywhere: real
designed surfaces are MADE of something and sit under a light. At expressive+
ambition every major surface (page background, hero, cards/panels, media
frames) carries at least one deliberate material cue, and the page declares
ONE light direction that everything obeys:

- **Grain/noise** — a 1-3% opacity noise overlay (tileable PNG or SVG
  `feTurbulence`, one shared asset) kills gradient banding and digital
  flatness; vary its intensity by section as part of the pacing curve.
- **Light consistency** — pick the light's direction once; every shadow,
  edge-highlight, gradient hotspot, and 3D/scene light agrees with it. Tint
  shadows toward the background hue (never pure black); give elevated
  elements a subtle top edge-light (1px inset highlight) on dark themes.
- **Gradients are graded, not defaulted** — two neighbouring hues from the
  palette with a noise/dither pass, or a radial hotspot placed where the
  light is; never the template diagonal of two loud complementaries.
- **Depth is layered, not dropped** — combine a tinted ambient shadow + a
  tighter contact shadow instead of one big blur; `backdrop-filter` glass
  only where content actually passes beneath it.
- **Type can be a surface too** — one display moment per page may carry
  material (image/video masked into headline glyphs via `background-clip`,
  a light sweep, foil/emboss shading) when the register supports it; body
  text never does.

Clean registers (refined/product/brutalist) obey the same physics with
quieter amplitudes — grain nearly invisible, shadows tighter, no masked
type — the discipline is identical, only the volume changes. "Clean" is a
designed material choice, never the absence of one.

## 8. Content and copy

≤ 8-word section headlines, ≤ 25-word subtext, one copy register per page, quotes
≤ 3 lines with name + role attribution. No filler verbs (elevate, seamless, unleash,
revolutionize). No fake-precise numbers unless real or labeled mock; use believable
messy data ("47.2%", not "99.99%"). No "Jane Doe"/"Acme"/generic avatars — realistic
locale-appropriate names, credible invented brands. Re-read every visible string
before responding; rewrite anything grammatically broken, cutely meta, or
performative-craftsman ("From the field", "We respect the French ones"). Plain
beats clever. Data-dump tables on marketing pages → top 3-5 + "view all".

**UX writing:** write from the user's side of the screen — name things by what
people control and recognize, never by how the system is built. Active voice ("Save
changes", not "Submit"). Action names stay consistent through the flow (button
"Publish" → toast "Published"). Errors and empty states are direction, not mood:
say what happened and what to do next; never apologize vaguely. Sentence case,
plain verbs, no filler.

## 9. States and interaction (product floor)

Every interactive component ships default/hover/focus/active/disabled/loading/error.
Skeletons shaped like the final layout, not centered spinners. Empty states teach
the interface. Errors inline for forms, toasts only for transient events. Labels
above inputs; placeholder-as-label never; helper text present. `:active` gives
tactile press (`scale-[0.98]`). Same button shape, form vocabulary, and icon style
on every screen — if "save" looks different in two places, one is wrong. Modals are
usually laziness; exhaust inline/progressive first. Dropdowns escape
overflow-hidden ancestors via popover API/position-fixed/portal. Touch targets
≥ 44px. Never disable zoom. This section is the floor; `skills/ux.md` is the
full working-page contract (nav that resolves, forms that submit, all states
reachable, keyboard walk, the pointer-events audit) — load it for any
product-register page and any redesign touching navigation, forms, or state.

## 10. Banned AI tells (match-and-refuse)

- **Em-dash (—) and en-dash separators (–): zero anywhere visible.** Periods,
  commas, colons, plain hyphens.
- Eyebrow kickers (small caps tracked labels above headings) on every section — max
  1 per 3 sections, and only as a deliberate system. Numbered section markers
  (`01 · About`) unless the content is a real sequence.
- Side-stripe borders (border-left > 1px as accent) — full hairline border, 4-8%
  background tint, or leading glyph instead.
- Gradient text (background-clip). Glassmorphism as default. Hero-metric template
  (big number + label + gradient accent). Identical icon+heading+text card grids.
- 1px border + soft ≥16px drop shadow on the same element ("ghost card") — pick one.
- Hero version labels (BETA, V0.6), scroll cues ("↓ scroll to explore"),
  locale/weather strips, decoration strips (`DESIGN · BUILD · SHIP`), vertical
  rotated text, custom cursors, decorative status dots, pills overlaid on photos,
  fake photo credits, version footers on marketing pages, "Quietly trusted by".
- Duplicate CTA intent: one label per intent per page ("Get in touch" + "Let's
  talk" = fail). CTA labels never wrap at desktop; 1-3 words.
- Middle-dot separators rationed to 1 per line. Never hover-scale on `<img>`
  elements (animate the card's border/background/shadow instead).
- Headline text that overflows its container at any breakpoint — test the actual
  copy; the viewport is part of the design.
- **The generic SaaS-template hero, banned by name.** Dark navy/purple
  background with a soft color-blob (pink→orange or purple→blue) behind bold
  sans headline ("We Make Brands Shine" register), an orange/pink gradient
  pill CTA next to a ghost-outline secondary button, and a plain top nav —
  this exact composition is what every ungrounded LLM defaults to and reads
  as a template regardless of copy. If the in-progress design converges on
  this (gradient-blob backdrop + gradient-pill CTA + generic bold claim
  headline), stop and change at least the background treatment, the CTA
  material, and the headline's specific claim before continuing.
- **Zero leaked tool/placeholder artifacts in shipped output, ever, no
  exceptions.** Things like `[Image #1]`, `[Image: source: ...]`, `<image
  placeholder>`, alt-text strings, markdown image syntax, or any other
  tool/generation-pipeline token must never render as visible text/alt/aria
  content on the page — this is the single most obvious "an LLM built this"
  tell there is. Before shipping, grep the built output for `\[Image`,
  `placeholder`, and any literal file paths from the generation pipeline; a
  hit is a shipped bug, not a minor cosmetic issue.

## 11. Redesign and preservation (extracted apps)

Dreative pages usually come FROM a real app. Detect the mode: preserve (evolve the
existing brand) vs overhaul (new language, same content/IA). When preserving: keep
route slugs, nav labels, form field names, logo, legal copy; extract brand tokens
before applying §4 (a purple brand stays purple); apply modernisation levers in
order — typography → spacing/rhythm → color recalibration → motion layer → hero
recomposition → full replacement only when unsalvageable. Honor existing
accessibility wins and analytics hooks. Preserve prior element-level edits when
`previousFile` is set.

### The preservation contract (mandatory for ANY redesign of existing code)

Redesigns fail catastrophically in one specific way: the agent rebuilds the page
from its mental image of it and silently drops what it forgot — links, ids, form
fields, whole features. Doctrine prose does not prevent this; only a mechanical
before/after check does. The contract protects **content and function**, never
structure — a restructure/reimagine still rebuilds markup, components, and
routing as drastically as the rung demands.

**Step 1 — Manifest (before editing anything).** Per page/view being redesigned,
read the ORIGINAL source and write a manifest file (scratch or
`.dreative/preserve/<page>.json`) enumerating:

- **Links & routes**: every `href` / `to` / `router.push` / `navigate` target.
- **Interactive elements**: every button/menu/toggle/input with its handler or
  action (name + one line of what it does), every form with its field names,
  types, validation, and submit target.
- **Identity hooks**: every `id`, `data-*` attribute, `aria-*` label, analytics
  hook, test id, and anchor target. These are external contracts — other code,
  CSS, tests, and deep links point at them.
- **Visible text**: every heading, label, button caption, tooltip, empty-state,
  and legal string (verbatim).
- **Data views & states**: every list/table/feed and what feeds it (API call,
  prop, store), every conditional view — tabs, modals, auth states, wizard
  steps, loading/empty/error branches.
- **Public API**: the component's exports, props, and context it consumes —
  callers must not break.

**Step 2 — Redesign at the confirmed rung.** Every manifest entry must land
somewhere in the new code. Restructuring means an entry may MOVE (a tab becomes
a section, a sidebar item becomes a command-palette entry, a table becomes
cards) — moving is encouraged; vanishing is a bug. If the new design has no room
for something, relocate it (overflow menu, secondary view, settings page) —
never delete a feature to make a layout work. Rewriting copy is allowed only at
the reimagine rung or on explicit request, and each rewrite is logged as
intentional.

**Step 3 — Verify mechanically (not by vibes).** After writing the new code,
walk the manifest item by item and grep the new source for each link target,
handler/action, id/data-attribute, field name, visible string, and data view.
Anything unmatched is either fixed on the spot or listed as an intentional
change with a reason. Then report a **preservation ledger** to the user:
"kept 14/14 links, 9/9 actions, 6/6 form fields, all 4 tab views; moved the
sort dropdown into the toolbar; rewrote 2 headings (reimagine rung)". A
redesign without a ledger is not done.

**Step 4 — Render check.** Every data view and conditional state that rendered
before must render after: open (or mentally walk) each tab/modal/state, not
just the default view. A page that "looks designed" but shows an empty shell
where a table used to be is a failed redesign regardless of how good the hero
looks.

### Motion is a deliverable, not a garnish

When the user asked for motion/animation (explicitly, or by picking the motion /
interaction / immersive / cinematic skills), shipped motion is verified like a
feature: before declaring done, name the specific animations implemented (which
element, which trigger, which duration/ease) and confirm they exist in the code
and appear in the self-critique screenshots. "The design system implies motion"
does not count; entrance choreography, scroll behavior, and micro-interactions
must be literally present. If zero animations survive to the final code, the
request was not fulfilled — go back and add them before reporting done.

### The transformation-depth ladder (offer it, then execute it)

A redesign request has a depth, and styling is only the shallowest rung. When the
user asks for meaningful change ("redesign", "make it modern", "make it look like
<reference site>", "change it entirely") and the depth is ambiguous, present this
ladder as explicit options (one short question, plain labels) and wait for the
answer — do NOT silently default to the shallowest rung. Bundle the specialist
skill picker (SKILL.md) into the same question so the user answers depth and
treatments in one pass:

1. **Restyle** — tokens only: color, type, spacing, radius, shadows, motion
   polish. Markup and structure untouched. Right for "refresh the look".
2. **Re-layout** — recompose sections: reorder, change layout families, new hero
   composition, new grid. Content and component boundaries survive; markup within
   sections is rewritten as needed.
3. **Restructure** — rewrite the HTML/component architecture: new semantic
   structure, new component boundaries, new navigation model, sections merged or
   split, routing changes. Content and IA survive; the code that renders them is
   rebuilt. Required for genre shifts (e.g. conventional page → immersive world,
   marketing page → app shell).
4. **Reimagine** — full rebuild: new structure AND new IA/copy/interaction model.
   Only the brand and the underlying purpose survive.

Once the user picks a rung, execute AT that rung — a confirmed "restructure"
means literally rebuilding markup, component trees, and routing, not a heavier
coat of CSS on the old skeleton.

**The drastic-change floor (rungs 3–4).** The chronic failure at these rungs is
timidity: the agent rebuilds the components but reproduces the old page's shape,
so a before/after glance reads as a re-theme. That is a failed restructure. At
rung 3–4 the new page must be **unmistakably a different design at one glance**
— someone shown both screenshots should assume different products. Concretely,
change at least TWO structural paradigms, not just their styling:

- **Navigation model** — top bar → side rail / command palette / dock / sticky
  chapter nav / full-screen overlay menu.
- **Page architecture** — stacked sections → editorial split-screen, horizontal
  scroll chapters, sticky-pinned scenes, bento composition, app-shell with
  panels, scroll-as-journey (immersive.md).
- **Content presentation** — tables → cards/ledgers, lists → galleries or
  timelines, forms → conversational steps, tabs → spatial sections.
- **Hero concept** — a new signature idea (typographic monument, media plane,
  3D object, kinetic composition), not the old hero with new colors.

Creativity is bounded by usability: every drastic move must still be MORE
user-friendly than what it replaces — clearer hierarchy, fewer steps to the key
action, honest affordances, mobile ergonomics intact (§13, skills/ux.md). A
restructure that confuses users is as failed as one that changed nothing. The
self-critique pass at these rungs must answer: "name the two-plus structural
paradigms that changed, and why each is easier to use than before." If mid-work you discover the chosen rung cannot
honestly deliver the requested outcome (the reference look demands structure the
current markup can't express), say so and ask to move up one rung rather than
shipping an imitation. Rungs 3–4 on an extracted app still honor §11 preservation
rules for whatever the user said to keep (routes, legal copy, form semantics).

## 12. Pre-flight checklist (run before EVERY respond)

Mentally verify; fix failures, then respond. If a box cannot be honestly ticked,
the output is not done.

0. Explore + commit passes done: three divergent concepts sketched (rejects
   recorded in the plan file), named palette, named fonts, real headlines
   written, compositional spine named (when §5 requires it), signature element
   with mini-spec + novelty check, choice ledger consulted (§2), subject-
   grounded. The quality floor (responsive to mobile, visible keyboard focus,
   reduced motion) is built silently — never announced in copy or comments.
1. Register named (brand/product); design read stated; brief and plan obeyed.
2. All three slop tests pass (first-order, second-order, competitor sentence).
3. Zero em/en-dashes visible. Zero banned tells from §10.
4. One accent + one tinted-neutral family + one theme + one radius system + one
   icon family, locked page-wide; matches sibling pages of this project.
5. Fonts: not on the reflex-reject list (or justified by existing brand); scale
   ratio committed; body ≥16px at 45-75ch; caps tracked; data tabular.
6. Every CTA/form/placeholder passes WCAG AA; no CTA wraps; no duplicate CTA intent.
7. Hero: ≤2-line headline, ≤20-word subtext, ≤4 elements, real visual, CTA above
   fold; centered only if variance ≤ 4 or manifesto brief.
8. Eyebrows ≤ ceil(sections/3); no two sections share a layout family; ≤2
   consecutive zigzags; no 3-identical-cards; bento cells = content count.
9. Real images or labeled slots; no div fake-screenshots; no sketchy SVG; logos are
   real marks.
10. Motion: each animation justified in one sentence; durations per 100/300/500;
    ease-out curves; exits faster; reduced-motion safe; content visible without JS;
    ≤1 marquee; no scroll-listener.
11. States complete (loading/empty/error/disabled); labels above inputs; tactile
    :active.
12. Mobile collapse explicit; 100dvh; no text overflow at any breakpoint; semantic
    z-index.
13. Copy self-audit done: no broken/AI-cute strings, realistic data, one register.
14. Every block id from the layout appears as `data-dreative-id` (design-page only).
15. Dark mode (when in scope): semantic-token swap, surface-lightness depth,
    desaturated accents, tested both modes.
16. Redesign of existing code: preservation manifest written BEFORE editing;
    every link, id, handler, form field, visible string, data view, and
    conditional state verified present (or logged as intentional) in the new
    code; preservation ledger reported. If motion skills were chosen, the
    implemented animations are named and present in the code.
17. Spatial integrity (§15): every positioned/fixed element has an anchor and
    reserved space; no interactive element overlaps another at 320/768/1280;
    one occupant per overlay corner; overflow-capable rows wrap or scroll
    inside their container (nothing clips at a viewport edge); animation
    end-states and parallax extremes collide with nothing; decoration layers
    are pointer-events-none below content.
18. Runtime gate (Mode A, whenever motion/3d/media/interactive treatments
    shipped): console clean while loading + scrolling + interacting; every
    shipped effect provably runs (canvas draws, transforms change, videos
    play); ux.md §7's functional audit passes (nav, menu, forms, tab walk,
    hit-tests); failed effects replaced by their planned fallback (PLAN.md),
    never shipped broken. If no browser is available, the ungated items are
    reported to the user by name.

## 13. Mobile & touch adaptation (how ambitious effects degrade)

Ambitious designs die on phones first. Every effect gets an explicit mobile
strategy DECIDED AT DESIGN TIME, not patched after. (This section governs how
desktop effects degrade; when mobile is a primary surface — mobile-first
briefs, app-register products — load `skills/mobile.md`, which designs the
phone experience as first-class.) The rule of thumb: touch
devices get a *different good design*, never a broken half-version of the
desktop one.

**Pointer effects** (cursor followers, magnetic pull, spotlight, tilt, hover
reveals): gate ALL of them behind `@media (hover: hover) and (pointer: fine)`.
On touch, whatever hover revealed must be visible by default or reachable by
tap — never lost. Custom cursors simply don't exist on touch; don't ship their
DOM/listeners there.

**Pinned/scrubbed sections**: pinning is fragile on mobile (URL-bar resize
fires viewport changes mid-pin; iOS momentum scroll skips scrub frames).
Strategies in preference order: (1) keep the pin but shorten it (≤ 1.5
viewports) and drive it with `position: sticky`, never JS pinning; (2) unpin —
the same content as stacked sections with simple in-view reveals;
(3) `ScrollTrigger.matchMedia()` / a `matchMedia` branch that swaps the whole
choreography. Never let a desktop pin length ride on a phone.

**Parallax & depth layers**: halve the differential on small screens (8-15% →
4-7%) or drop to zero; small viewports make parallax read as jitter. Layered
depth scenes collapse to 2 layers max.

**Drag-to-explore / spatial navigation**: on touch, drag conflicts with native
scroll. Either give the pannable surface a dedicated full-screen mode entered
by tap (with a visible close), or replace it with a swipeable carousel /
plain scrolling index. The conventional index route (immersive.md's escape
hatch) becomes the PRIMARY route on mobile, not the fallback.

**WebGL/canvas**: assume the phone GPU is 5-10× weaker and thermally throttled.
Tier at boot (`devicePixelRatio` capped at 2, sim resolution halved,
post-processing off) or swap the sim for a pre-rendered video loop / poster.
`deviceMemory`/first-dropped-frames checks pick the tier; a visible "reduce
effects" toggle when the brief allows.

**Layout & ergonomics floor** (extends checklist §12.12): tap targets ≥ 44px
with ≥ 8px gaps; primary actions in thumb reach (bottom half) on app-register
mobile; `100dvh` not `100vh`; no horizontal body scroll at 320px; type scale
clamps DOWN gracefully (hero ≥ 2rem, body stays ≥ 16px — iOS zooms inputs
under 16px); sticky navs shrink rather than stack; test the three widths 320 /
768 / 1280 mentally before responding.

**Motion budget on mobile**: entrance choreography total ≤ 600ms (vs 900ms
desktop), at most 1 scroll-driven sequence per page, marquees pause when
off-screen. Battery is a design constraint: continuous rAF loops must idle
when nothing animates.

## 14. Typography sourcing (kill the Inter-everywhere default)

The reflex-reject list (§3) says what NOT to reach for; this is where to reach
instead. All fonts below are free (Google Fonts or Fontshare/ITF). The
commercial fonts real award sites use — verified: unseen.co sets **Saol
Display Light/Italic + Neue Montreal**; unseen's Blossom lab sets **SangBleu
Serif + PP Neue Montreal**; capsul-in-pro sets **Messina Sans** — are the
targets; the pairings below are their honest free stand-ins, not lookalikes of
each other.

Per aesthetic register (display / body):

- **Cinematic & experimental** (unseen-like): light editorial serif with a
  true italic for display — `Boska`, `Sentient`, or `Gelasio Light Italic` —
  over a neutral grotesk body — `Switzer`, `Hanken Grotesk`. Mixing italic
  serif words INTO a grotesk headline is the genre move (unseen does exactly
  this). Mono microtype for HUD labels: `Fragment Mono` or `Martian Mono`.
- **Minimal / premium product**: one grotesk family carrying everything —
  `General Sans`, `Switzer`, or `Schibsted Grotesk` in 3-4 weights. The
  Neue Montreal / Messina Sans stand-in tier. Tight display tracking
  (−0.02 to −0.04em), no second family.
- **Editorial / luxury**: `Zodiak` or `Besley` display over `Hanken Grotesk`
  or `Switzer` body; small-caps eyebrows tracked +0.08em. (Reach here only
  when §3's serif discipline is satisfied.)
- **Bold / brutalist / campaign**: `Clash Display` or `Cabinet Grotesk` (black
  weights) display over `Switzer`/`General Sans` body; `Bricolage Grotesque`
  when some warmth is wanted.
- **Playful / consumer** (lovvelavva-like DTC): `Cabinet Grotesk` or `Gambetta`
  display, rounded moments via weight and spacing — NOT a rounded font —
  over `Hanken Grotesk` body.
- **Corporate trust / clean business**: `Switzer` or system stack; Inter is
  legitimate here (§3). Differentiate through scale contrast and spacing,
  not font novelty.

Rules: still run §3's selection procedure — this list feeds step 3, it does
not replace the brand-voice reasoning. **The named fonts are worked examples
of the procedure, not a menu**: a closed replacement list just becomes the new
monoculture one tier deeper. Any font here that appears in your choice
ledger's last 3 entries (§2) is now YOUR reflex — reject it in step 2 like the
banned list and run the procedure again; the same rotation duty applies to
§4's alternative palettes. Self-host via Fontshare/google-webfonts
downloads (`font-display: swap`, preload the display weight only). Never ship
more than 2 families / ~5 weight files. If the brief names a commercial font
the project already licenses, use the real thing.

## 15. Spatial integrity (nothing overlaps by accident)

The most common way an otherwise-good AI design dies: elements sitting ON TOP of
each other — a menu button overlapping the nav, a chip row clipped off the
viewport edge, a floating widget covering the CTA. Beautiful animation cannot
rescue a page where things collide. These rules are a hard floor, same tier as §5.

**Every out-of-flow element must justify itself.** Before writing
`absolute`/`fixed`/`sticky`/negative margin/transform-offset, answer: what is
this anchored to, and what reserves the space it covers? If there's no answer,
put it in flow. Decoration layers (glows, grain, orbs, canvas backgrounds) are
`absolute inset-0 -z-10 pointer-events-none` — below content, never intercepting
clicks, never between the user and a control.

**Persistent/traveling scene objects get a TRAVEL MAP.** Any element that
survives across sections — a fixed canvas object, a scroll-morphing prop, a
signature that "recurs" down the page — must have a scripted state PER
SECTION written in the plan blueprint: position, scale, opacity at each
chapter, chosen so it NEVER rests over a headline, body text, or control at
any scroll position (including mid-transition — occlusion while traveling
between keyframes counts). `pointer-events: none` solves clicks, not
reading: a decorative object visually covering words is a hard fail even
when clicks pass through. When a section's layout leaves no safe berth, the
object exits (fades/scales out) and re-enters at the next chapter — an
object with no scripted berth for a section defaults to HIDDEN there, not
to floating wherever the scroll math happens to park it.

**Dominant abstract objects must survive the "what is it?" test.** A large
abstract signature (orb, core, monolith) earns its prominence only if a
stranger reads it as either a nameable thing or deliberate scene
architecture (a horizon, an instrument, a frame). If the honest answer is
"a dark ball with rings," reduce it: shrink it to an accent, anchor it into
the composition (consistent berth, edges lit by the page's light, cropped
by a frame ON PURPOSE), or replace it with imagery. Ambiguity at accent
scale is intrigue; ambiguity at hero scale is confusion. The test is judged
from the SCREENSHOT, not from the plan's prose: naming the object "eclipse",
"thermal horizon", or "roast core" in the plan does not make a translucent
sphere read as one — if the verify screenshot shows a ball floating over a
photo, it fails regardless of what the plan swore it wasn't. At hero scale
the answer must be a nameable thing (see 3d.md §3: abstract coded forms are
supporting-only and can never be the promoted signature object).

**Interactive elements never overlap other interactive elements.** Not at any
breakpoint, not mid-animation, not after a toast appears. Two clickable things
occupying the same pixels is an automatic fail — one of them is unreachable.
Mentally hit-test every control: is anything rendered above it (higher z-index,
later stacking context) covering any part of its hit area?

**Fixed/floating overlays get a slot system.** The viewport has at most 4 overlay
slots (the corners), plus optional top/bottom bars. ONE occupant per slot —
before adding a floating element (toast, install prompt, chat bubble, back-to-top,
cookie notice, desktop-pet promo), check what already lives in that corner,
including the site's own nav controls. Overlays keep ≥16px from viewport edges
(safe-area insets on mobile), never cover the hero CTA or nav actions, and
anything persistent is dismissible. If two things want the same corner, stack them
in one container or queue them — never let them fight.

**Nav is one coherent bar.** Menu toggles, theme switches, and account buttons
live INSIDE the nav's flex row — never as separately-positioned fixed elements
that visually land on top of the bar. If a control is fixed so it survives scroll,
the nav itself is fixed and the control stays part of it.

**Rows that can overflow must have a plan.** Chip rows, tab bars, button groups,
breadcrumbs: at every width they either wrap (`flex-wrap`), scroll within their
own container (`overflow-x-auto` with visible affordance, content inset from the
container edge, `scroll-padding`), or truncate deliberately. Content silently
sliding under the viewport edge or under a sibling is a bug. Centered rows wider
than their container clip on BOTH ends — left-align scrollable rows.

**Animation end-states count.** An element's resting position after its entrance
(and every scroll-linked position in between) obeys these same rules. Parallax
and floating loops need enough clearance that their extremes never touch
neighboring text or controls. Pinned sections must not leave the pinned layer
hovering over the next section's content when unpinned.

**Reserve space for the dynamic.** Text that will be swapped/typed, badges with
counts, localized labels: size the container for the longest realistic value.
Fixed bars get matching `padding` on the scroll container (or `scroll-margin`)
so content can't hide beneath them — anchored headings included.

**Verification is spatial, not stylistic.** At 320 / 768 / 1280, walk the page
top to bottom and ask of every element: what is under it, what is above it, and
was that intentional? Any unintentional occlusion, clipped edge, or double-booked
corner gets fixed before the respond — this is checklist §12 item 17.
