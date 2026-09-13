# Native creative foundations

These twelve implementation-neutral foundations replace the former effect
catalogue. They are bounded production primitives, not finished art direction
or package-specific showcase builds, and they are not preferred substitutes
for mature specialist runtimes. Choose one only when it fully satisfies the
selected mechanism. Do not select a Native Foundation merely because it is
already available or easier to implement. For advanced choreography,
rendering, state orchestration, or smooth-scroll coordination, choose the
appropriate established runtime instead. Every mount owns one bounded root and
one cleanup path. `demo.html` is a functional visual fixture, not a house style.

**The code is real and it is next to this file: `systems/runtime.js`.** Every
export named below is implemented there, exercised by `systems/browser.spec.ts`
against `demo.html`, and free of dependencies. Read the mount you are considering
before you write your own — the cleanup, the reduced-motion form, and the
teardown path are the parts that are tedious to get right and are already done.
Copy it into the project and adapt it; it is a starting point you own, not a
package to import from here. `dreative catalogue --query <mechanism>` prints the
same set with the reject conditions attached.

## section-observer

- Export: `mountSectionObserver`
- Use: small reversible section states with visible-by-default content.
- Reject: repeated generic fade-ups.
- Mobile/reduced: shorten travel; resolve immediately under reduced motion.
- Budget/cleanup: one observer per route; disconnect it.
- Browser: enter, leave, reverse, 390px, reduced motion.

## scroll-progress

- Export: `mountScrollProgress`
- Range: default `"passage"` runs from top/bottom to bottom/top.
  `range: "pin"` runs from top/top to bottom/bottom for a top-zero,
  full-viewport sticky stage. Other geometries need measured start/end points
  in a specialist runtime. The returned cleanup function also has `.refresh()`
  for upstream layout changes; subject resize, fonts and motion preference refresh automatically.
- Use: one native signal shared by a meaningful progress/velocity treatment.
- Reject: decorative smoothness or competing scroll clocks.
- Mobile/reduced: clamp velocity; publish zero velocity under reduced motion.
- Budget/cleanup: one RAF only after scroll/resize; cancel and remove listeners.
- Browser: start/mid/end, reverse direction, resize, destroy.

## pinned-chapter

- Export: `mountPinnedChapter`
- Uses the pin range by default; pass `range: "passage"` only for an unpinned
  traversal. It switches discrete states; it does not interpolate a scene.
- Use: a real comparison or sequence with authored states and a safe release.
- Reject: pinning ordinary copy or trapping mobile scroll.
- Mobile/reduced: shorter sticky travel or normal vertical state sequence.
- Budget/cleanup: bounded state count; destroy the owned progress controller.
- Browser: entry, every state, reverse, release, 390px, reduced motion.

## shared-element-handoff

- Export: `runSharedElementHandoff`
- Use: the same semantic subject changes layout ownership.
- Reject: unrelated source/destination elements or a gratuitous page transition.
- Mobile/reduced: shorten or switch instantly; always preserve focus.
- Budget/cleanup: one transition at a time; no persistent runtime.
- Browser: focus, forward/back state, unsupported API fallback.

## frame-sequence

- Export: `mountFrameSequence`
- Framing: optional `framing: { fit: "cover" | "contain", position: [x, y] }`
  with normalized alignment, or a function receiving CSS `{width, height, frame}`.
  Defaults to centered cover. `mediaPlacement` exposes the same geometry for
  other renderers; see `../references/MEDIA_HANDOFF.md` for canvas/DOM continuity.
- Use: pre-rendered motion is more faithful or efficient than runtime simulation.
- Reject: a short compressed video or two stills communicate the same result.
- Mobile/reduced: pass a smaller manifest when mounting; choose a resolved
  informative frame with `reducedFrame`.
- Budget/cleanup: capped DPR, LRU image-reference cache (12 frames by default,
  configurable with `maxCachedFrames`), clear cached image refs. This bounds
  retained cache entries, not browser-managed memory or concurrent in-flight
  decodes; production scrubbing may need a coalescing decode queue.
- Browser: missing callback, resize, start/mid/end and reduced-motion frame.

## persistent-stage

- Export: `mountPersistentStage`
- Use: one meaningful subject develops through named section berths.
- Reject: floating decoration, control coverage, or unclear occlusion ownership.
- Mobile/reduced: the runtime disables the floating stage and marks each berth
  `data-stage-fallback="visible"`; author meaningful in-flow content there.
- Budget/cleanup: one stage; observe only berths; disconnect and remove resize.
- Browser: every berth, overlaps, resize, 390px, fallback content.

## drag-rail

- Export: `mountDragRail`
- Use: direct manipulation improves browsing a finite set.
- Reject: a standard list is clearer or drag is the only navigation.
- Mobile/reduced: native horizontal snap; no inertia under reduced motion.
- Budget/cleanup: pointer events only during interaction; release every handler.
- Browser: pointer, touch-equivalent scroll, arrow keys, bounds, focus.

## kinetic-type

- Export: `mountKineticType`
- Starts on viewport entry, once. Use `trigger: "mount"` only for an intended
  mount entrance; `rootMargin` adjusts entry. It groups words and changes state,
  but does not author scroll typography. Use tracks/timelines for that.
- Use: language itself carries hierarchy or transformation.
- Reject: decorative glyph noise, delayed reading, or broken copy/paste.
- Mobile/reduced: fewer groups; immediate readable resolution.
- Budget/cleanup: retain one accessible label; restore original text on destroy.
- Browser: accessibility name, wrap/resize, 390px, reduced motion, cleanup.

## adaptive-canvas

- Export: `mountAdaptiveCanvas`
- Use: dense interactive 2D work exceeds clean DOM/SVG handling; PixiJS is the
  enhanced path for sprites, 2D shaders, or filters.
- Reject: a few nodes suffice or the subject is genuinely 3D.
- Mobile/reduced: reduce count/DPR; draw one static frame or use DOM fallback.
- Budget/cleanup: DPR ≤ 1.5 by default; pause hidden; no per-frame allocations.
- Browser: resize, visibility pause, low-power form, fallback, destroy.

## video-handoff

- Export: `mountVideoHandoff`
- Use: information established in footage continues into editorial DOM.
- Reject: unrelated background loops.
- Mobile/reduced: poster/short derivative; immediate matched DOM.
- Budget/cleanup: compressed sources/poster; remove media handlers.
- Browser: readiness, end handoff, error, poster, reduced motion.

## spatial-gallery

- Export: `mountSpatialGallery`
- Use: bounded depth helps users understand or browse relationships; Three.js or
  R3F is the enhanced path when real camera/geometry is necessary.
- Reject: depth merely adds travel.
- Mobile/reduced: the runtime flattens depth; consumer CSS must turn the same
  items into a native snap rail when that is the chosen mobile form.
- Budget/cleanup: finite items, capped DPR in GPU enhancement, full disposal.
- Browser: click, arrows, focus, bounds, 390px, reduced motion.

## media-trail

- Export: `mountMediaTrail`
- Use: deliberate exploration reveals a short-lived trail of project imagery;
  PixiJS is the enhanced path for genuinely high counts.
- Reject: permanent cursor followers, control coverage, or stock imagery.
- Mobile/reduced: deliberate drag only; the runtime creates no trail under
  reduced motion, so preserve an authored still in the underlying content.
- Budget/cleanup: six items and 700ms life by default; remove nodes and handler.
- Browser: density bound, coarse pointer, controls, reduced motion, cleanup.

## Compose overlapping motion with tracks

`motionTrack(stops)` returns a pure sampler for one numeric property. Stops use
`{ at, value, ease? }`: progress in 0–1, a number, and optional incoming easing.
Repeated values make a hold. Sampling backwards gives the same composition;
several tracks share a clock but need not start, finish or rest together.
This helper is for authored DOM/SVG/canvas properties, not a thirteenth effect.

For example, in an existing composition where a readable phrase makes room for
an actual detail image, give the type and aperture different intervals:

```js
const typeTravel = motionTrack([
  { at: 0, value: 0 }, { at: .18, value: 0 },
  { at: .56, value: -28 }, { at: 1, value: -28 },
]);
const aperture = motionTrack([
  { at: 0, value: 0 }, { at: .3, value: 0 },
  { at: .72, value: 100 }, { at: 1, value: 100 },
]);
const cleanup = mountScrollProgress(scene, ({ progress }) => {
  const p = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : progress;
  scene.style.setProperty('--type-travel', `${typeTravel(p)}%`);
  scene.style.setProperty('--aperture', `${aperture(p)}%`);
}, { range: 'pin' });
```

Bind these to separate wrappers: translate the phrase's visual groups with
`--type-travel`; reveal the image using an inset or aperture derived from
`--aperture`, preserving its cover crop. Keep semantic text intact. Design the
resolved image and labels first. On narrow screens, recompose the words and
image before changing the travel. Under reduced motion, remove the pin and
show that resolved composition in normal flow. Tune the example intervals by
watching; they do not fit every subject or amount of text.

Continuity can instead be an edited cut, color field, selected item or camera
axis. Choose from the relationship the route needs; no route must include a
particular packaged foundation. A helper removes mechanical work, not the need
to compose the task and ending.

## Optional runtime routing

- Motion: React/component-state layout, enter/exit, hover, press, and drag.
- GSAP: coordinated, scrubbed, reversible DOM/SVG/WebGL choreography.
- Lenis: interpolated scroll for a route whose motion is scroll-linked. This is
  a route-level decision made at the top of the build, not a late refinement:
  raw scroll position steps and a smoothed one glides, and everything
  scroll-driven is authored against whichever you chose. It takes ownership of
  native scrolling, so anchor links, keyboard paging, focus management and
  reduced motion become yours to get right — decline it when you will not, and
  never bolt it on at the end.
- PixiJS: high-density 2D sprites, filters, shaders, and generative fields.
- Rive: supplied interactive state-machine assets; never invent capability
  without a `.riv` asset.
- Three.js/R3F/OGL: real spatial or shader behavior that earns its runtime.
