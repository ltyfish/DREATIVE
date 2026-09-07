# Creative execution

Read this when choosing or integrating a runtime for a concrete visual result.
Use `CREATIVE_RESOURCES.md` for a targeted external resource lookup.

For every advanced mechanism, identify its semantic purpose, section owner,
meaningful state change, mobile form, reduced-motion form, loading/failure
fallback, and cleanup cost. A library name is never a design rationale.

## Choose by outcome

Choose between a Native Foundation and a specialist runtime from the required
visual and technical result, never from implementation convenience. A
foundation is sufficient only when it fully delivers the selected mechanism;
availability is not a selection reason. Prefer the mature runtime when advanced
choreography, rendering, state orchestration, or scroll coordination requires
its capabilities.

- Native scroll + CSS/SVG: ordinary layout, hover/focus states, reveals, and
  simple transitions.
- Motion: component-state layout, enter/exit, hover, press, drag, and shared
  state changes in product interfaces.
- GSAP: coordinated timelines, reversible sequences, pinning, scrubbing,
  shared-element movement, and DOM/SVG/WebGL choreography.
- Lenis: intentional interpolated scrolling, velocity-driven behavior, or a
  controlled horizontal/infinite rail. It is not a default polish layer.
- Three.js/OGL/R3F: spatial behavior that materially explains, demonstrates,
  or embodies the subject.
- Canvas: dense procedural drawing or continuous simulation that DOM/SVG cannot
  deliver cleanly.
- PixiJS: high-density interactive 2D sprites, filters, shaders, text, or image
  fields that do not need a 3D scene.
- Rive: an authored `.riv` state machine for a branded diagram, mascot, icon, or
  input-responsive component. A runtime without the asset is not capability.
- Sharp/FFmpeg: build-time asset processing, not creative direction.

## Runtime ownership

Keep one scroll owner and one animation clock. With GSAP + Lenis, drive Lenis
from `gsap.ticker`, update ScrollTrigger once, and remove the exact callback on
teardown. In React, scope timelines and handlers, revert them on unmount, and
refresh measurements after fonts/media settle.

Cap DPR and work per frame. Suspend offscreen canvases, clean up listeners,
observers, RAF callbacks, textures, materials, geometry, and renderers. Lazy
load heavy systems and provide a calm static or DOM/SVG form for low-power,
reduced-motion, or failed contexts.

## Quality threshold

Prototype the uncertainty that could invalidate the direction: visual fit,
material, interaction, or technical feasibility. Define the decision the probe
will answer and use intended content. Carry successful implementation into the
application; discard only failed experiments and temporary scaffolding.

Reject:

- an unadapted demo whose composition or behavior does not fit the direction;
- rendering complexity that adds no visible value to the intended result;
- smooth scrolling with no concept-driven use;
- multiple libraries producing the same class of motion;
- effects that cover controls, reduce readability, or vanish on mobile;
- a prototype that consumes more effort than the final product.

Atmospheric shaders, particles, and image planes can be the right visual medium.
Judge their framing, identity, rhythm, and integration, rather than banning the
medium. A library component is a starting implementation: change its visual
grammar to fit this project and inspect its full interaction lifecycle.

After integration, run `VISUAL_REFINEMENT.md`: inspect screenshots at desktop,
390px, reduced motion, and the loading/failure state, fix visible findings, and
recapture. Judge the actual composition, not numeric telemetry.
