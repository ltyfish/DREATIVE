# Creative execution resolver

## Compact selection loop

1. Search with `dreative catalogue --query "<visual phrase>" --json`.
2. Shortlist mechanisms by visual outcome, section role, continuity role and
   ambition/treatment compatibility. Select the smallest coherent set.
3. Assign one continuity owner, one motion language, one material language and
   one spatial logic. Each major section gets one or two dominant treatments;
   supporting treatments must reinforce them. Include peaks, rests, transitions
   and a resolution.
4. Run `dreative preflight --mechanisms <ids>`. Installation is transactional,
   mechanism-led and permission-aware. A failed install activates an approved
   fallback, is recorded, and is followed by validation; never import a missing
   API.
5. Read `recipes/primitives.md`, then the selected family recipe and a relevant
   pattern in `recipes/positive-exemplars.md`. These are technical scaffolds,
   never visual templates.
6. Prototype only unresolved high-risk mechanics. Then build and verify the real
   section transition with project content.

## Engine decisions

- Native scroll and CSS/SVG/Canvas are the default for simple sites and local
  state. Do not install a motion stack to fade and translate content.
- Choose GSAP for multi-stage or reversible timelines, pinned chapters,
  synchronized DOM/SVG/Canvas/WebGL, Flip/shared elements, kinetic type,
  morphing, motion paths, drag/inertia or precise responsive choreography.
- Choose Lenis only for an approved need such as interpolated smooth scrolling,
  velocity, horizontal/infinite rails, nested controlled areas, or synchronized
  DOM/WebGL. When paired with GSAP, Lenis runs from `gsap.ticker`; register one
  stable callback, call `ScrollTrigger.update`, and remove that exact callback
  before `lenis.destroy()`. Do not also run `autoRaf`.
- In React, prefer `@gsap/react` with one scope ref and `contextSafe` event
  handlers. Refresh measured triggers after fonts/media settle and revert the
  scope on teardown.
- Three.js/OGL are scene runtimes, not model-authoring tools. Cap DPR, resize,
  suspend offscreen, handle context/texture failure and dispose renderers,
  textures, materials and geometries.
- Sharp, FFmpeg and Remotion are build-time tools unless a specific player is
  selected. A package, permission or fetch wrapper is not renderer/model-server
  capability. Verify the binary/server, endpoint/model, output format, hardware,
  time and license. Otherwise use supplied footage or deterministic
  CSS/SVG/Canvas/WebGL/frame-sequence substitutes and disclose the fallback.

## External scouting and adaptation

For Award/Experimental, inspect a focused shortlist of primary documentation,
repositories or user references. Record `source`, `sourceType`, `mechanism`,
`principleExtracted`, `projectSpecificUse`, `brandSpecificTransformation`,
`plannedDifferences`, `packages`, `license`, `attributionRequired`, performance,
accessibility and originality risks.

React Bits may be inspected and a selected component may be installed or copied
into the user application only when its current license permits. Preserve
notices, record source, and transform at least three of content, assets,
composition, section role, motion, timing, material, camera, interaction,
responsive behavior, continuity or meaning. Never place React Bits source in
the Dreative package. Reject default demo styling/copy/palette/layout/timing,
isolated widgets, decorative-only use and stacked catalogue effects without a
hierarchy.

## Verification and budgets

Major mechanisms need proportional initial, early, midpoint, peak, end, mobile
and reduced-motion evidence; add reverse and post-resize states when promised.
Verify visible geometry/material change, linkage, pin entry/exit, loading,
fallback, navigation, runtime errors and production assets. Mechanism budgets
may control frame/particle/object counts, derivatives, lazy activation, texture
compression, DPR, canvas resolution, shader complexity, instancing, low-power
mode, posters and bitrate. Mobile may be simpler but cannot silently lose the
defining concept.
