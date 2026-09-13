# Motion direction and implementation

Translate the brief into visible events, then implement the event that carries
the idea. Motion can explain a process, create atmosphere, direct attention, or
make a transition feel continuous. It need not always change a business decision.

## Author a sequence, not an effect label

For the decisive moment write a short score:

`input → establish → transform → hold/read → handoff → release`

Name the actual subject, moving properties, material, and destination. Define
the start and resolved compositions first. Then decide how the transition earns
the distance between them. A scroll timeline should remain comprehensible if
the user pauses, reverses, or skips to the end. A one-shot entrance may remain
resolved on return; reversibility is a design choice, not a universal requirement.

Separate the timeline into intervals with different jobs. For example, progress
0–0.2 establishes the subject, 0.2–0.7 changes framing, 0.7–1 hands it to the next
region. These are sketch values to tune while watching, not standard timings.
Use overlap and held compositions to create rhythm. Constant motion everywhere
erases emphasis.

## Choose the mechanism by what must be visible

| Treatment | What to implement | Frequent failure and correction |
|---|---|---|
| Parallax | Foreground/background layers with different travel; overscan each crop by its maximum displacement | Exposed edges and sliding wallpaper: reduce travel, preserve a focal anchor, author depth order |
| Pixelation / dither | Sample an actual image/video into a lower-resolution surface with nearest-neighbor scaling; animate sample resolution or a threshold mask | CSS blur is not pixelation; random blocks lose the subject. Resolve to the exact sharp source and keep text outside the degraded surface |
| Framing / aperture | Animate a mask or frame while independently controlling the image's cover scale and focal point | Zooming the whole DOM rectangle loses the composition. Tune image and frame separately at each aspect ratio |
| Scroll choreography | One clamped progress value drives a coordinated scene and its handoff | Independent observers drift. Use one timeline, refresh measured geometry after fonts/assets/resize, and verify release |
| Shared-element transition | Carry the same subject between measured source and destination rectangles using FLIP or View Transitions | Crossfading unrelated items breaks identity. Keep focus, history, and interrupted-navigation behavior working |
| Image displacement | A source texture and intentional field/depth map perturb sampling coordinates; amplitude resolves to zero | Large deformation looks like rubber. Protect the subject silhouette and bound edges |
| Frame sequence | Decode real related frames, map progress to an index, retain the last good frame while loading | Sparse unrelated stills cannot depict continuous subject motion; inspect adjacent frames and decoded memory |
| Video edit | Authored cuts, masks, freezes, loops, or transitions tied to media readiness | Scrubbing interframe video may seek poorly; test before choosing frames or a different encode |
| Kinetic type | Animate words/lines as readable groups with deliberate timing and line breaks | Character noise delays reading; retain semantic text, accessible names, selection, and responsive wrapping |
| Spatial scene | Camera, real geometry/materials, light, and a deliberate composition | More geometry does not fix bad light or camera framing; test the actual model early |

Read `../references/MOTION_MATERIAL.md` for production of media-driven forms.
For pixelation, parallax, masks, and type, a single high-quality still can be
enough. Video and 3D are options, not mandatory signs of ambition.

When the brief asks for variety or rejects a previous motion idea, change the
underlying event and composition. Another blur-to-sharp zoom does not answer
that feedback. Begin with a legible subject unless concealment has a specific
payoff. Source the required clip, model, views, or typography treatment before
declaring the more expressive approach infeasible; a failed stock search does
not establish the limits of the host's generation or code-sourcing tools.

## Expand the expression without collecting effects

For the transition from a successful moment to a complete experience, use
`../references/CHOREOGRAPHY.md`. It covers composition in time, joins,
information as interaction, and an ending that belongs to the opening.

When comparing directions, vary the experience itself: a typographic relay that
becomes navigation, imagery blending into the surrounding material, a framed
subject opening into an immersive detail view, or an editorial sequence of cuts
and held compositions. These are possibilities, not an approved menu. Reuse a
coherent visual grammar while varying emphasis; neither repeating the same reveal
everywhere nor adding a different effect to every section creates an authored arc.

Carry craft into the primary task: image exploration, category changes, selected
states, detail views, and returning to the prior position. A loader can establish
the visual language while real assets prepare; connect its exit to readiness and
avoid artificial delays or unbounded progress. Entrance motion should let the
visitor start using the page immediately. Microinteractions need hover, focus,
press, completion, and interruption behavior where those states exist.

Tune scroll distance by watching when something meaningful happens or needs time
to be read. Long dead travel is not cinematic pacing. Inspect the shopping or
working surface and the closing sections with the same care as the opening;
quiet composition can resolve the experience without becoming filler.

## Runtime and timing

CSS handles local hover/focus/press states. Native scroll timelines can handle
supported simple mappings with a tested fallback. GSAP/ScrollTrigger is useful
for coordinated scrubbed DOM/SVG/canvas work; Motion for component-state and
layout transitions; WebGL/Pixi/OGL for texture and field work. Choose one owner
per property. A single progress value may feed multiple renderers.

For scroll-linked motion, map scene progress with
`p = clamp((scrollY - start) / (end - start), 0, 1)`.
Handle zero-length ranges. Use linear mapping for direct scrub; place expressive
easing inside deliberate subsegments rather than easing every input twice.
For smoothing use time-based damping
`a = 1 - exp(-dt / tau); current += (target - current) * a`.
Snap to a small tolerance and stop scheduling once settled; cap a resumed tab's
dt. Never run both a scroll smoother and a second uncontrolled smoothing loop.

The native `mountScrollProgress` defaults to viewport passage (entry to exit).
Use its `range: "pin"` for a top-zero, full-viewport sticky scene; the two ranges
are not interchangeable. Use measured ScrollTrigger start/end for other pin
geometries. `motionTrack` in `../systems/runtime.js` compiles timed values for
overlap and holds without adding a clock. See the construction example in
`../systems/NATIVE_FOUNDATIONS.md`; use GSAP timelines for richer orchestration.

Animate transform/opacity where suitable; masks, filters, sampling resolution,
and canvas have different paint/GPU costs. Measure the actual chosen effect.
Do not impose a transforms-only aesthetic in the name of performance.

## Build and observe

Compose the route first, then build the hardest slice with its real crop,
material and receiving state. Watch normal playback at desktop and mobile. Compare against the
reference at matched start, midpoint, and handoff states, then watch the timing.
Static screenshots cannot establish rhythm or smoothness.

Exercise slow wheel, fast wheel, stop, reverse, keyboard paging, touch, resize,
late-loaded assets, and direct entry. Verify controls remain usable during the
effect. Make reduced motion an informative static or short-transition form.
Suspend offscreen work and dispose listeners, timelines, textures, and observers.

Interaction feedback, route continuity, and focal motion each need attention;
one impressive hero cannot make the rest of the route responsive.
No minimum number of animated regions, libraries, videos, or effects proves craft.
