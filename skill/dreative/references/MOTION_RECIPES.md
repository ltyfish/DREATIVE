# Motion recipes

Working starting code for scroll-led and interaction motion. Every recipe below runs
in `systems/motion-recipes.html` (`motion-recipes.js`) against real gsap 3.13+ and
lenis 1.3 builds and is covered by browser tests. Copy the recipe, then change the
material, geometry and timing for this project. A recipe is a mechanism, not a
design: the composition it moves is yours.

## Stack and setup

Install: `npm i gsap lenis` (every GSAP plugin, including SplitText, Flip and
ScrollSmoother, is free). In React also `npm i @gsap/react`.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

// R0: one scroll owner. Lenis advances on the GSAP ticker; ScrollTrigger updates from Lenis.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = reduce ? null : new Lenis({ lerp: 0.1, smoothWheel: true });
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 761px)", fine: "(pointer: fine)" }, (ctx) => {
  const { motion, desktop, fine } = ctx.conditions;
  if (!motion) return;            // reduced motion: CSS already shows the resolved layout
  // ...recipes; everything created here is reverted when conditions change
});
document.fonts.ready.then(() => ScrollTrigger.refresh()); // and again after hero media decode
```

React/Next: put motion in a `"use client"` component and wrap setup in
`useGSAP(() => { ... }, { scope: ref })` (reverts on unmount, safe under StrictMode).
Create Lenis once in a root client provider (or `lenis/react`'s `ReactLenis` with
`autoRaf: false` plus the ticker line). Never create ScrollTriggers during SSR.
Vue/Svelte: create in `onMounted`/`onMount`, `ctx.revert()` on unmount.

Skip Lenis when the page is mostly a task surface (dashboards, docs, long forms) or
uses nested scroll containers you have not tested; keep native scroll and the rest
of the recipes work unchanged.

## Timing and easing tokens

Starting values. Tune by watching playback, then keep the tuned values as tokens.

| Use | Duration | Ease |
|---|---|---|
| Display text / image reveal on enter | 0.9–1.4s, line stagger 0.06–0.1s | `expo.out` · CSS `cubic-bezier(.16,1,.3,1)` |
| Clip/aperture open (time-based) | 1.0–1.4s | `expo.inOut` · `cubic-bezier(.87,0,.13,1)` |
| UI state (menu, filter, drawer, bag) | 0.35–0.6s | `power3.out` · `cubic-bezier(.22,1,.36,1)` |
| Hover / press feedback | 0.15–0.3s | `power2.out` |
| Shared-element flight (Flip) | 0.7–1.0s | `expo.inOut` or `power4.inOut` |
| Scrubbed timeline | scroll-driven; `scrub: 0.5–1` for weight | `none` on the driver, ease inside segments |
| Magnetic / follower | quickTo 0.4–0.7s | `power3.out` or `elastic.out(1,0.4)` |

Rhythm: lead with the largest shape, follow with text 0.1–0.2s later, end on a hold.
Overlap neighbours by 20–40% of their duration; sequences without overlap feel
mechanical. One strong ease family per site reads as a voice; mixing five reads as
a template. Pinned scenes: 100–200% viewport of scroll per scene on desktop, less on
mobile; add a hold (`tl.to({}, {duration: 0.4–0.8})`) so the resolved state can be read.

## Recipes

### R1 Masked line reveal (display type)
```js
SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, linesClass: "line",
  onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: el, start: "top 80%", once: true } }) });
```
```css
.line-mask { padding-bottom: .14em; margin-bottom: -.14em; } /* tight leading clips descenders otherwise */
```
`autoSplit` re-splits after font load and resize; returning the tween from `onSplit`
lets SplitText revert it. Split words or chars only when they are animated separately.

### R2 Clip-path image reveal with counter-scale
```js
gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 75%", once: true } })
  .fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
  .fromTo(frame.firstElementChild, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
```
The frame is `overflow:hidden`; the image settles while the mask opens, so the crop
lands rather than slides. Vary the inset edge per direction of travel.

### R3 Parallax inside a fixed frame
```js
gsap.fromTo(frame.firstElementChild, { yPercent: -10 }, { yPercent: 10, ease: "none",
  scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
```
```css
.frame { overflow: hidden; } .frame > img { height: 124%; margin-top: -12%; object-fit: cover; }
```
Overscan = 2 × travel. Give foreground type or a second image a different rate to
create depth between layers, not just inside one.

### R4 Pinned scene as a labelled timeline (aperture + parting type)
```js
const tl = gsap.timeline({ defaults: { ease: "power2.inOut" },
  scrollTrigger: { trigger: scene, start: "top top", end: desktop ? "+=180%" : "+=120%", pin: true, scrub: 0.6, anticipatePin: 1 } });
tl.addLabel("establish")
  .to(left,  { xPercent: -60, duration: 1 }, "establish")
  .to(right, { xPercent:  60, duration: 1 }, "establish")
  .fromTo(aperture, { clipPath: "inset(32% 36% 32% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }, "establish+=0.2")
  .addLabel("hold")
  .from(caption, { autoAlpha: 0, y: 24, duration: 0.4, ease: "power3.out" }, "hold-=0.2")
  .to({}, { duration: 0.6 });
```
The aperture is a full-bleed element revealed by `clip-path` (no layout work per frame).
Put the real hero image or video inside it. Durations inside a scrubbed timeline are
proportions of the scroll distance, so the labels are your storyboard.

### R5 Horizontal rail (desktop pin, mobile native)
```js
if (desktop) {
  const distance = () => track.scrollWidth - innerWidth;
  const move = gsap.to(track, { x: () => -distance(), ease: "none",
    scrollTrigger: { trigger: rail, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
  labels.forEach((label) => gsap.from(label, { yPercent: 60, autoAlpha: 0,
    scrollTrigger: { trigger: label, containerAnimation: move, start: "left 85%", end: "left 55%", scrub: true } }));
}
```
```css
@media (max-width: 760px) { .rail { overflow-x: auto; scroll-snap-type: x mandatory; } .panel { scroll-snap-align: center; } }
```
Use `containerAnimation` for anything that should react to horizontal position.

### R6 Shared-element handoff (image becomes the detail view)
```js
function open(card) {
  const state = Flip.getState(img);
  dialog.hidden = false; slot.appendChild(img);          // move the same node
  lenis?.stop();
  Flip.from(state, { duration: 0.9, ease: "expo.inOut", absolute: true, zIndex: 30, onComplete: () => closeBtn.focus() });
}
function close() {
  const state = Flip.getState(img);
  card.prepend(img);
  Flip.from(state, { duration: 0.8, ease: "expo.inOut", absolute: true, zIndex: 30, onStart: () => (dialog.hidden = true) });
  lenis?.start(); card.focus();
}
```
This is the canonical "hero/product image travels into the shop/detail" join. The
same image node moves, so there is no crossfade or crop jump. Give the dialog
`role="dialog"`, Escape to close and focus return. For route changes use the View
Transitions API (`document.startViewTransition`, matching `view-transition-name` on
source and destination) with an instant fallback.

### R7 Velocity-reactive marquee
```js
const loop = gsap.to(inner, { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
const skew = gsap.quickTo(inner, "skewX", { duration: 0.5, ease: "power3.out" });
let v = 0;
ScrollTrigger.create({ trigger: inner, start: "top bottom", end: "bottom top",
  onUpdate: (self) => { v = gsap.utils.clamp(-1500, 1500, self.getVelocity()); } });
const decay = () => { v *= 0.9; loop.timeScale(1 + Math.abs(v) / 250); skew(v / -150); };
gsap.ticker.add(decay);   // remove in cleanup
```
Duplicate the content once inside `inner` (`aria-hidden` on the copy) so `-50%` loops.

### R8 Loader tied to real readiness
```js
const critical = [document.fonts.ready, ...[...document.querySelectorAll("[data-critical]")].map((img) => img.decode().catch(() => {}))];
Promise.all(critical).then(() => { intro.play(); ScrollTrigger.refresh(); });
```
`intro` is a paused timeline whose first frames are the loader's exit and whose last
frames are the hero's resolved state. Never show a fake percentage; cap the wait
(e.g. race with a 2.5s timeout) and let the hero work without the loader.

### R9 Stacked sticky scenes
```js
sheets.slice(0, -1).forEach((sheet, i) => gsap.to(sheet, { scale: 0.9, filter: "brightness(0.55)", ease: "none",
  scrollTrigger: { trigger: sheets[i + 1], start: "top bottom", end: "top top", scrub: true } }));
```
```css
.sheet { position: sticky; top: 0; height: 100vh; transform-origin: 50% 0; }
```
No pin needed; CSS sticky does the holding and the next sheet does the covering.

### R10 Pointer craft (magnetic control, image-follow)
```js
const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect();
  x((e.clientX - r.left - r.width / 2) * 0.35); y((e.clientY - r.top - r.height / 2) * 0.35); });
el.addEventListener("pointerleave", () => { x(0); y(0); });
```
Only under `(pointer: fine)`. For a list whose rows reveal an image under the cursor,
the same two `quickTo` calls move one shared image element; touch gets the image inline.

## Compose recipes into the signature moment

A signature moment usually chains two or three recipes around one subject:

- **Opening → shop:** R8 loader exits into R4 aperture holding the hero product
  image; the aperture's final frame is the first product card's image, and R6 carries
  it into the detail view when tapped.
- **Story → evidence:** R1 headline, R4 pinned scene whose timeline swaps
  close-up crops of the same garment (macro → detail → full), released into a size
  and fabric panel that uses the same crop.
- **Collection index:** R5 rail of products at large scale; R10 image-follow on the
  list view; R6 into detail; filter changes use `Flip.getState` / `Flip.from` on the
  grid so items keep identity.

Write the score first: `input → establish → transform → hold → handoff → release`,
naming the actual image and the destination element.

## Pitfalls that break award-level motion

- Animating `width/height/top/left` per frame: use transform, `clip-path`, opacity.
- Pin inside a transformed parent or `overflow:hidden` ancestor: pins jump. Pin the
  section itself; give pinned sections no transform.
- Measurements taken before fonts/images load: call `ScrollTrigger.refresh()` after
  `document.fonts.ready` and hero image `decode()`.
- Two scroll smoothers, or CSS `scroll-behavior: smooth` with Lenis: remove one.
- Entrance animations that hide content (`from autoAlpha:0`) without a trigger: lower
  sections stay invisible on direct entry. Use `once: true` triggers and test reload mid-page.
- Mobile: pinned scrubs feel heavy on touch; shorten `end`, use `scrub: true`, or
  swap the pin for a sticky/static composition (R5 mobile form).
- Reduced motion: return early from `matchMedia`; CSS must already show the
  resolved composition (clip-path none, transforms none).
- Cleanup: everything inside `mm.add`/`useGSAP` reverts automatically; ticker
  callbacks and DOM listeners need explicit removal.
