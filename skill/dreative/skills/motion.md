# Dreative Specialist Skill — Motion & Scroll Choreography

## Contract

Follow `../references/SKILL_CONTRACT.md`. Dependencies: `ux`, `mobile`. Deliver a
named motion system, trigger/timing/easing inventory, cleanup strategy, mobile
translation, reduced-motion fallback, and sampled runtime evidence.

Load for animation, parallax, scroll stories, kinetic type, spatial transitions,
or a motion dial that requires more than state feedback.

## 0. Explore before recipes

Understand the content sequence, brand physics, inputs, and still layout first.
Record three original choreography concepts before reading
`../recipes/motion-recipes.md`. A recipe supplies wiring—not the story.

Name the motion signature in physical terms such as precise mechanical settle,
soft editorial drift, elastic play, or heavy cinematic inertia. One system owns
the page; independent default animations do not.

## 1. Hard gates

- Content is visible before enhancement and never depends on a JS callback to
  appear (`content.visible`).
- Reduced motion removes nonessential travel, pinning, auto-looping, and
  vestibular effects while preserving state and hierarchy
  (`motion.reducedMotion`).
- Navigation, forms, keyboard, pointer targets, and focus remain functional
  (`ux.functional`, `spatial.noOcclusion`).
- Timelines/listeners/observers/render loops clean up; hidden tabs and route
  transitions do not multiply work.
- Heavy choreography has measured runtime and a concrete low-power/mobile/static
  fallback (`effects.runtimeFallback`).

## 2. Motion architecture

Choose by job:

- CSS transitions/animations for local states and simple decorative loops.
- `motion/react` for component presence, layout, gestures, and springs.
- GSAP + ScrollTrigger for coordinated timelines and pinned scroll chapters.
- Lenis only when the concept needs a shared smooth-scroll clock.
- R3F/three.js render state for scene motion; synchronize with the page clock.

Use one provider/ticker/scroll owner. Define tokens for duration, spring, easing,
distance, stagger, and reduced-motion behavior. Interactive motion uses springs
or velocity-aware settling; narrative motion uses deliberate timelines.

## 3. Evidence-backed creative structure

At expressive/award, satisfy `motion.expressive.diversityOrDevelopment` through
one plan path:

- **Diversity:** at least four distinct mechanisms across three input drivers.
  Reusing one mechanism more than twice is a warning that the system is shallow.
- **Development:** one coherent signature mechanism develops through at least
  three materially different roles/states, supported by two quieter secondary
  mechanisms and at least two drivers.

Development is not the same reveal with different distances. A line becoming
navigation, data plot, and scene boundary qualifies; fade-up repeated across
three sections does not.

## 4. Choreography principles

- Build a timeline for the whole journey: setup, anticipation, peak, rest,
  transformation, resolution.
- Entrances orient; they are not the design. Key media and signatures respond to
  input or develop state.
- Scroll links progress to meaning. Clamp/damp velocity and avoid raw scroll
  listeners or layout work in every frame.
- Kinetic type remains readable DOM text; splits restore cleanly and preserve
  accessibility.
- Presence/exits preserve focus, scroll position, and input continuity.
- Mobile shortens travel, removes long pins, lowers parallax, and preserves the
  concept through a calmer translation rather than a cropped desktop effect.

## 5. Planning and verification

For each moment record element, trigger/driver, purpose, state range, duration or
spring, mobile translation, reduced-motion behavior, fallback, and evidence.

Runtime proof includes changing transforms/uniforms/state at two timestamps,
trigger positions, tested scroll-back, hidden-tab recovery, cleanup after route
changes, mobile viewport, reduced motion, console count, and frame-time sampling
for heavy work. A static screenshot cannot prove choreography.

Recipe reference: `../recipes/motion-recipes.md`, after concept exploration only.
