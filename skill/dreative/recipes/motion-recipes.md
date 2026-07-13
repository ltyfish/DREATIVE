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
