# Dreative Specialist Skill — Motion & Scroll Choreography

Selected motion names its mounted owner, start/intermediate/end/fallback states and distinct browser-grounded observations bound to the current build.

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

Classify motion before selecting a library:

- **Decorative:** reveals, hover response, ambient loops, and slight parallax.
- **Structural:** motion controls hierarchy, pacing, pinning, section state, or
  the handoff between compositions.
- **Transformational:** imagery, type, or objects fragment, combine,
  reconstruct, change form, or become the next scene.

At expressive/award, actively test key moments for structural or
transformational value. Do not call opacity/translate/scale choreography
structural merely because it is scroll-driven.

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

At expressive/award, satisfy `motion.expressive.architecture` through one plan
path without mechanism quotas:

- **Diversity:** use the concept-related mechanisms and drivers needed to shape
  the journey, joined by one motion language.
- **Development:** evolve one coherent signature mechanism through materially
  different roles/states, with quieter supporting motion.

Development is not the same reveal with different distances. A line becoming
navigation, data plot, and scene boundary qualifies; fade-up repeated across
three sections does not.

## 4. Choreography principles

- Build a timeline for the whole journey: setup, anticipation, peak, rest,
  transformation, resolution.
- Concentrate technical and visual complexity in a small number of hero moments;
  keep reading sections calm so those moments land.
- Prefer composition handoffs: let a mask, object, layer, grid, or typographic
  structure from one scene become material for the next.
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

Before implementation, complete the section treatment and one typed
`motionMoments[]` contract per important moment. It names the owner and driver;
static/start/intermediate/end/handoff states; purpose; implementation file and
component; measurable properties; desktop, authored mobile, and reduced-motion
states; primary/fallback implementation; observable criteria; and evidence IDs.
The section maps those IDs. Choose the simplest capable mechanism; CSS/SVG,
Motion, GSAP, canvas, WebGL, sequences, and hybrids are peers judged by outcome.

Run the anti-default review before approval: identify whether imagery only
fades/scales/slides, sections reveal independently, the page lacks a composition
handoff, motion merely introduces rather than changes state, the system could fit
an unrelated brand, or nothing is memorable. Revise expressive/award plans that
remain generic.

Weak treatment: “hero scales in, heading fades up, cards stagger, sections
reveal.” Strong treatment: “the isolated subject stays pinned while its depth
layers separate; the headline compresses into a mask; that mask tiles the scene
into the next section; mobile uses a short clip-path handoff.” Copy neither
literally—match that level of state change and continuity to the brief.

Prototype only an uncertain mechanism when `prototype=auto` selects its risk or
when `prototype=required`. `prototype=skip` implements directly in the real
component without lowering ambition.

Runtime proof uses a recording/trace with timestamps or controlled progress with
expected/observed DOM, layout, canvas, shader, scene, or application state. A URL,
clean console, prose claim, or unproven screenshots cannot prove motion. Inspect
states selected by interaction type; add pinned entry/midpoint/exit/release when
relevant. Check
readability, continuity, collisions, empty frames, timing, concept expression,
and usability. Refine when inspection finds a meaningful weakness; a clean pass
does not require an arbitrary change. A static screenshot cannot prove choreography.

Recipe reference: `../recipes/motion-recipes.md`, after concept exploration only.
Canonical v8 requires structural start, active and resolved states. Prototype
selection is by materially different unresolved risk family, capped at three;
a successful hero probe does not prove downstream frame sequences or spatial
selectors.
