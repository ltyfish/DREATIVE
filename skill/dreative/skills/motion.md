# Dreative Specialist Skill — Motion & Scroll Choreography

## Contract

Follow `../references/SKILL_CONTRACT.md`. Dependencies: `ux`, `mobile`. Deliver a
named motion system, trigger/timing/easing inventory, cleanup strategy, mobile
translation, reduced-motion fallback, and sampled runtime evidence. Do not load
when state changes and CSS feedback are sufficient. Done means choreography runs
as planned without jank, scroll traps, hidden content, or input loss.

Load this file when `plan.skills` includes `motion`, or the brief/prompt asks for
animation, parallax, scroll storytelling, kinetic type, or "cinematic" feel.
It EXTENDS DESIGN.md §6 (which still applies: 100/300/500 durations, ease-out
exponential curves, reduced-motion fallbacks, no scroll listeners, no bounce).
This file is about doing ambitious motion WELL, not about adding more of it.
Every effect here needs a mobile strategy per DESIGN.md §13 (shorter pins,
halved parallax, 600ms mobile entrance budget) — decide it at design time.
If the requested motion needs structure the current markup can't express (pinned
sections, split text, persistent stages), use DESIGN.md §11's transformation-depth
ladder: offer restructure as an option and, once confirmed, rebuild the markup —
don't fake choreography onto the old skeleton. When the page's imagery or video
participates in the choreography (reveals, scrubbed sequences, distortion,
hover-woken loops), read `media.md` — media is motion material there, with the
DOM-tier and WebGL treatment vocabularies and the generation pipeline.
On phones the whole inventory recalibrates: `mobile.md` §2 is the translation
table (what keeps, what halves, what dies) — decide it at design time.

## 0. Pick the tool by the job, not by habit

- **CSS only** — hover/focus/press states, one-shot entrances, marquees, simple
  scroll reveals via `animation-timeline: view()`. Zero JS cost; always first choice.
- **Motion (`motion/react`, formerly Framer Motion)** — React apps: presence
  (`AnimatePresence`), layout animation (`layout` prop = free FLIP), springs,
  `whileInView`, gesture props. The default for React product+brand pages.
- **GSAP + ScrollTrigger** — timeline choreography: multiple elements coordinated
  over one scroll range, scrubbed sequences, pinned sections, kinetic type.
  Use when a Motion version would need 4+ manually-synced `useScroll` hooks.
- **Lenis** — smooth scroll wrapper for scroll-driven brand pages. Only on brand
  register with motion dial ≥7; never in product UI. Sync ScrollTrigger with
  `lenis.on('scroll', ScrollTrigger.update)`.

One animation system per page. Motion AND GSAP on the same page = two spring
vocabularies fighting; pick one and commit.

## 1. Springs beat durations for anything interactive

Duration+easing is for one-shot choreography (entrances, exits). Anything that
tracks input or can be interrupted (drag, hover follow, toggles, layout shifts)
uses springs — they redirect mid-flight without a visible restart.

- Motion defaults: `{ type: "spring", stiffness: 300, damping: 30 }` = snappy UI;
  `stiffness: 120, damping: 20` = soft brand movement. Overshoot (`damping < 15`)
  only on playful briefs, and only on small elements — never on layout.
- `visualDuration` (Motion ≥11.13) sets spring feel by time: easier to reason about.
- Never spring opacity or color; springs are for transform. Crossfade those.

## 2. Orchestration: one timeline, one story

The scattered-reveals look (every section fades up independently) is the #1 motion
tell. Instead:

- **Hero entrance** = ONE composed sequence: parent `staggerChildren: 0.08`,
  `delayChildren` after nav settles; elements enter in reading order; total ≤ 900ms.
  Nothing else on the page gets entrance choreography.
- **Below the fold**: at most 2-3 sections get `whileInView` reveals (`once: true`,
  `margin: "-20% 0px"`), and they should differ (a clip reveal here, a stagger
  there) — not the same fade-and-rise stamped on everything.
- Stagger direction carries meaning: top-down for lists, center-out for grids
  (`delay: Math.abs(i - mid) * 0.05`), left-right only for horizontal sequences.
- Exits are faster than entrances (~75%) and simpler (fade + small offset; never
  reverse the full entrance).

## 3. Scroll choreography (motion dial ≥ 7)

- **Scrub vs trigger**: scrub (`scrub: 0.5–1` or Motion `useScroll`+`useTransform`)
  for progress-bound narrative (a product rotating, a number counting, a diagram
  assembling). Triggered one-shots for everything else. Scrubbed text reveals are
  worn out; scrub things that MOVE, trigger things that APPEAR.
- **Pinning**: max ONE pinned sequence per page (`ScrollTrigger pin: true`, or
  `position: sticky` + a tall parent — prefer sticky, it's free and un-janks).
  Pin length ≤ 2.5 viewport heights; past that users feel trapped.
- **Parallax**: subtle = 8-15% differential (`useTransform(scrollYProgress, [0,1],
  ["-8%","8%"])`); apply to media/decoration, never body text. 2-3 layers max.
- **CSS scroll-driven animations** (`animation-timeline: view(); animation-range:
  entry 0% cover 40%`) handle simple reveals/parallax with zero JS — use for
  progressive enhancement, gate with `@supports (animation-timeline: view())`.
- Progress-linked values snap to keyframes users can feel: use eased ranges
  (`useTransform` with cubic arrays), not raw linear mapping.
- Never scroll-jack (hijacking wheel delta into slide-snapping). `scroll-snap` on
  a horizontal strip is fine; taking over vertical page scroll is not.

## 4. Kinetic type and text reveal

- Split text with `SplitText` (GSAP, now free) or manual word-`<span>` wrapping;
  animate **words or lines, not characters** for readability (chars only for short
  display words ≤ 12 chars). Wrap split parents in `overflow-hidden` line masks and
  slide lines up `y: "110%" → 0` — the line-mask reveal reads as premium; per-char
  fade reads as 2021 template.
- `aria-label` the original string on the split container; split spans get
  `aria-hidden`. Re-splitting on resize: debounce, or use `SplitText`'s autoSplit.
- Counters: animate with `useSpring`/gsap `snap: 1`, `tabular-nums` mandatory,
  duration ≤ 1.2s, trigger once in view.

## 5. Layout & presence

- Motion `layout` prop for reflow (filtering grids, expanding cards, reordering) —
  it's FLIP under the hood, transform-only. `layoutId` for shared-element morphs
  (card → modal). Wrap conditional trees in `AnimatePresence mode="popLayout"`.
- Accordion/height: `grid-template-rows: 0fr → 1fr` (CSS, cheap) or Motion
  `height: "auto"` (it measures for you). Never `max-height: 9999px`.
- **View Transitions API** for page-level transitions (`document.startViewTransition`,
  or the framework wrapper e.g. Next `<ViewTransition>`): name persistent elements
  with `view-transition-name` so they morph across routes. Feature-gate; fall back
  to instant navigation, not a JS fade.

## 5.5 Velocity & physical feel (what makes motion feel ALIVE, dial ≥ 6)

Static easings play back; physical motion RESPONDS. The difference between a
tweened page and a top-tier one is that top-tier motion carries momentum:

- **Scroll velocity as an input.** Track smoothed velocity (Lenis exposes it;
  else lerp `(scrollY - last) / dt`) and drive secondary properties from it:
  skew images/cards ±2-4° along the scroll axis, stretch letter-spacing or
  scaleY on display type a few %, increase a shader's blur/chromatic-
  aberration/RGB-split uniform with speed. Everything eases back to rest via
  the same lerp when scrolling stops — the settle IS the effect.
- **Inertia and release.** Anything draggable keeps momentum on release
  (Motion's `dragMomentum`, GSAP InertiaPlugin, or a manual velocity fling
  with friction) and settles with an overshoot spring, never a hard stop.
  A drag that stops dead on mouseup feels like a slideshow.
- **Lag as depth.** Layered elements follow the scroll/cursor with different
  lerp factors (0.05-0.15 spread) so the composition visibly re-stacks in
  motion — cheap, GPU-light, reads as physicality on every pointer move.
- **One motion signature per build.** Pick the personality once — a named
  easing family (e.g. `expo.out` + one overshoot) OR one spring config — and
  use it everywhere; mixed default eases read as assembled-from-snippets.
  `linear` only for marquees/orbits; never ship a default ease unexamined.

## 6. Performance and accessibility (non-negotiable)

- Transform/opacity only in hot paths; promote animating layers sparingly
  (`will-change` set just-in-time, removed after). > 6 simultaneously-animating
  elements = re-choreograph.
- All scroll work driven by IntersectionObserver / ScrollTrigger / `useScroll`
  (rAF-batched) — a raw `scroll` listener is a hard ban (DESIGN.md).
- Test the tab hidden→visible case: loops must not accumulate; `whileInView` must
  not re-fire (`once: true`).
- `prefers-reduced-motion`: scrubbed narratives get a static end-state, entrances
  become plain fades ≤ 200ms, marquees stop. In Motion use `useReducedMotion()`
  and branch the variants — don't just shorten durations.
- Content exists without JS: initial styles are the VISIBLE state; animation
  libraries then hide/offset from JS before first paint (`gsap.set`, Motion
  `initial`). An SSR'd page must never flash-then-hide.

## 7. Recipes (copy the shape, restyle the skin)

- **Hero sequence**: nav fades in (150ms) → headline lines mask-slide up, 80ms
  stagger → subtext + CTA fade-rise together → hero media scales 1.04→1 with 6px
  blur→0. Total 900ms, expo-out.
- **Sticky product walkthrough**: `sticky` media column + scrolling step copy;
  step index from IntersectionObserver on copy blocks; media crossfades/transforms
  per step (springy, 300ms).
- **Marquee**: duplicated track, `animation: scroll Xs linear infinite`,
  `width: max-content`, pause on hover, speed from content width (px/s constant,
  ~60-90px/s), masked edges with `mask-image: linear-gradient`.
- **Scrub showcase**: sticky canvas/image sequence, `useScroll` on the wrapper,
  map progress to frame index / rotation; preload frames; ≤ 2.5 viewports tall.
- **Canvas product story** (capsul-in-pro.com's form): a single-product launch
  page as one scroll-scrubbed narrative — the product renders on a full-page
  canvas (image-sequence or WebGL) and scroll drives its assembly/rotation
  while short copy beats fade in at fixed progress stops; the site ships as
  one bundled app with explicit portrait/landscape variants (it gates on
  orientation rather than half-working in both). Copy the shape: one subject,
  one scrubbed timeline, copy anchored to progress ranges, per-orientation
  choreography decided up front.
- **Text on a path** (verified on epic.net): a manifesto paragraph flows along a
  curved SVG path (`<textPath>` or per-word transforms sampled from a curve) and
  relaxes toward straight lines as scroll progress advances — the curve
  amplitude is the scrubbed value. One per site; body text elsewhere stays flat.
- **Orbiting cursor label** (epic.net's video CTA): a circular text ring
  ("PLAY VIDEO ⟲") slowly rotates around the pointer while it's over the media
  region — SVG `<textPath>` on a circle, damped position follow, constant
  rotation. Replaces the play button; fine pointers only, real button fallback.

## 8. Setup blueprints — install and WIRE the stack (do not skip)

Doctrine without dependencies ships a static page. When this skill is active,
actually add the libraries to the project and wire them before designing
sections. Pick the stack per §0, then:

**GSAP + ScrollTrigger + Lenis (brand pages, the unseen.co-family stack):**

```
npm i gsap lenis
```

```js
// one module, imported once at app root (e.g. src/lib/motion.ts)
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
export const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

React: run that inside a `useEffect` in a `<SmoothScroll>` provider mounted in
the root layout (destroy on unmount); Next.js needs `"use client"` on it.
ONE Lenis instance, ONE gsap ticker — never per-component.

**React StrictMode is a hard constraint (the invisible-page bug).** Dev
StrictMode mounts every effect TWICE. A bare `gsap.from(el, { opacity: 0 … })`
in a `useEffect` whose cleanup only kills ScrollTriggers leaves the element at
`opacity: 0`; the second effect run then reads that 0 as the animation's END
state, and every reveal animates invisible→invisible — the page renders as
blank sections with only untouched elements visible, no console error, and a
passing build. Field-observed shipping failure. The rule: ALL GSAP work inside
React effects lives in `gsap.context(() => { … })` (or `useGSAP`) and the
cleanup calls `ctx.revert()` — never a kill-only cleanup, never `gsap.from`
outside a context in a component. This is not a StrictMode workaround to
disable (`<StrictMode>` stays); it's the correct teardown. Any `from()`-based
reveal must be verified in a RENDERED page (SKILL.md §V) precisely because
this failure mode is invisible to builds and greps.

**motion/react (React product+brand):** `npm i motion` — import from
`"motion/react"`. Shared transition vocabulary in one exported object
(`export const spring = { type: "spring", stiffness: 300, damping: 30 }`), used
everywhere; `MotionConfig reducedMotion="user"` at the root.

**Easing tokens (either stack):** commit page-wide —
`expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)` for entrances/reveals,
`power2.inOut` for scrubbed/camera moves, springs for interactive. Define once
(gsap defaults via `gsap.defaults({ ease: "expo.out" })` or CSS custom
property `--ease-out-expo`), reference everywhere.

**Line-mask headline reveal (the canonical premium move, copy this shape):**

```jsx
// each line: <div class="overflow-hidden"><div class="line">…</div></div>
gsap.set(".line", { yPercent: 110 });
gsap.to(".line", {
  yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08,
  scrollTrigger: { trigger: el, start: "top 80%", once: true },
});
```

Use GSAP `SplitText` (free) with `type: "lines", mask: "lines"` instead of
hand-wrapping when available; `aria-label` the original string per §4.

## 9. Definition of done — the shipped-motion inventory

A motion request is fulfilled only if the final code contains, verifiably
(grep the imports, name the elements):

- **Dial 4–6 (product/calm brand):** composed hero entrance timeline (§2), the
  three global feel constants (interaction.md §0), 1–2 `whileInView`/triggered
  section reveals, animated states (loading/success). No smooth scroll.
- **Dial 7–8 (expressive brand):** all of the above PLUS Lenis smooth scroll,
  line-mask headline reveals on hero + section headings, one scrubbed scroll
  sequence (pin, parallax system, or progress-bound narrative), one signature
  pointer effect (interaction.md §1), and a page/route transition treatment.
- **Dial 9–10 (award-site):** all of the above PLUS the immersive.md or
  cinematic.md architecture actually built (persistent stage/canvas, preloader
  choreography, spatial or sim-driven route transitions, custom cursor).

Before reporting done, list which inventory items shipped and where (element +
trigger). "The page has hover states" does not clear dial 7+. If a listed item
was deliberately cut, say so and why. This inventory is a **hard gate**, not a
checklist: the SKILL.md verification pass fails the task on any dial-appropriate
item that is neither proven running nor logged as a deliberate cut with a
reason — an incomplete inventory means keep building, not ship with a caveat.
The runtime stage must PROVE the items run (transforms changing, triggers
firing, console clean), not just find them in the source. On mobile, grade
against the shifted dial (mobile.md: desktop N ≈ mobile N−2), not the desktop
list.
