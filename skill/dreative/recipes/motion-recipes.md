# Motion implementation recipes

Load only after three original choreography concepts are recorded. Record access
in `recipeAccess`.

## Component motion

- Presence: animate enter/exit around semantic state; exits are shorter and
  simpler; return focus deliberately.
- Layout: use transform-based layout animation and stable keys; avoid animating
  expensive dimensions in dense UI.
- Gestures: pointer capture, velocity, bounds, and spring settle; provide
  keyboard/touch equivalents.

## Scroll choreography

- IntersectionObserver for one-shot reveals; visible content is the default.
- Motion `useScroll`/transforms for bounded component-linked progress.
- GSAP context + ScrollTrigger for multi-element chapters; one Lenis instance
  and one ticker when smooth scrolling is justified.
- Sticky CSS for simple pinning; cap pin length and remove/shorten on mobile.
- Velocity treatments use damped/clamped derivatives, never raw scroll deltas.

## Optional transformation patterns

Choose only patterns that express the concept:

- **Image fragmentation:** split a source into aligned DOM/SVG/Canvas tiles or
  sampled pixels; disperse, filter, and reconstruct the actual image.
- **Composition handoff:** carry an object, mask, grid, or type structure from
  one section into the next instead of resetting the page.
- **Layered image dive:** separate depth planes or use a depth map and move the
  camera through the composition.
- **Mask migration:** evolve one mask window across images or sections.
- **Object persistence:** keep a key subject staged while its environment,
  scale, supporting content, and berth change.
- **Generated-keyframe morph:** blend related still states through masking,
  displacement, or a bounded frame sequence.
- **Pixel-to-object reconstruction:** assemble sampled text/image particles into
  a recognizable subject.
- **Typography-to-image:** use readable type as mask, grid, path, or fragment
  source that becomes imagery.
- **Environmental system:** drive texture, light, particles, type, and objects
  from the same scroll/interaction state.
- **Editorial sequence:** treat a long section as one pinned timeline with
  deliberate internal states rather than independent blocks.

## Type

- Split lines/words/characters only for selected display moments; keep accessible
  source text and restore wrappers on cleanup.
- Variable-font axes can become a coherent development mechanism when states
  change meaningfully rather than merely pulsing.

## Setup and cleanup

- Scope GSAP with context and call `revert()`.
- Cancel rAF, observers, media queries, and event listeners on unmount.
- Pause continuous work on `document.hidden` and outside the viewport.
- Test SSR/hydration so content never flashes then hides.

## Performance/fallback

- Animate transform/opacity or shader state; avoid layout reads after writes.
- Precompute measurements on resize, reuse objects, and cap continuous work.
- Reduced motion uses final readable states and retains necessary feedback.
- Fallback preserves timing hierarchy: setup, peak, rest, and resolution remain
  legible even when the mechanism becomes static.
