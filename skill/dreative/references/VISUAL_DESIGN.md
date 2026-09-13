# Design with images; build the design

Use for open-ended visual design, generated website mockups, or implementing a
supplied design image. A generated composition can reveal structure, image scale,
type relationships and unexpected joins that a prose plan leaves undecided.
The image is a working design, not proof that the responsive interface exists.

For open design briefs, generate multiple distinct visual directions with plans
and stop for selection as described in `PLAN.md`. Use a callable image generator
when available and allowed. Skip concept generation for scoped repairs,
an established direction or a supplied design that already answers the question.
Use the host's image-generation/editing tool and its applicable instructions;
discover capability through `MEDIA_SOURCES.md`. Respect cost and source limits.
If generation is unavailable, use supplied images or a material-backed visual
composition in a capable design tool/browser, and name the substitution.

## Explore the actual page

Start with the real task, content density, brand constraints and usable subject
material. Supply relevant assets and user references to the generator where
supported. Separate what must remain exact from what can be invented. Product
identity and factual claims do not become flexible because they appear in a mockup.

Ask for a front-on page composition at an explicit viewport, not a photograph
of a device or an angled presentation board. Describe the visitor's task, visual
intent, content, asset roles and desired relationships. Leave room to invent
structure rather than feeding it the usual hero/cards/features/footer skeleton.
Include the working middle and ending. If a long page becomes too small to judge,
use an overview with related sectional studies that share the chosen design.

A useful prompt shape, adapted to the brief:

> Design the actual [page/task] for [audience], front-on at [viewport]. Use
> [supplied subject/brand material] and preserve [facts/identity]. Explore
> [specific visual idea or unresolved relationship]. Include [actual content
> and working state] through the ending. Show intentional image scale, typography,
> negative space and transitions between content groups. This is a page design;
> keep it free of presentation-device framing.

Inspect the generated image. Judge whether its structure helps the task and
whether the real content fits, not just whether its atmosphere is appealing.
When it misses, edit the actual image with a specific correction, retaining what
works. A new unrelated generation can discard the strongest decisions. Produce
alternatives while the direction choice remains; stop producing alternatives once
the user has selected. Show the images and plans together and wait for selection.
Only choose without that reply when the user explicitly delegated the decision.

## Translate before the design evaporates

Keep the selected image accessible to the builder. Record its actual file or
tool reference in the existing implementation note; a prose summary alone loses
spatial information. Treat the user's edits and selected revision as authoritative.

Read the design into a small set of build decisions:

- Composition: dominant subject, relative scale, alignments, asymmetry, overlaps,
  negative space and section boundaries. Estimate these from the image, then
  correct against the browser; do not invent exact measurements as evidence.
- Type: available font and weight, size relationships, line breaks, line-height,
  measure and alignment. Preserve the hierarchy when the generated font is unknown.
- Material: identify which pixels need separate production assets and which
  belong to CSS, live text, SVG, canvas or a scene. Map needed assets to local files.
- Behavior: determine the real control/state behind each pictured UI element,
  plus mobile reflow and any motion states the still leaves unresolved.

Keep only decisions that make this design identifiable. This is an implementation
aid, not a new schema, approval document or screenshot scoring system.

Obtain the assets before locking the layout. A flattened mockup does not contain
recoverable layers. Prefer original supplied imagery; otherwise generate/edit
separate assets with the selected design as a reference where supported. Specify
the required subject, crop, background/alpha, lighting and copy space. Inspect
one at its intended placement size before expanding the set. Do not promise an
identical extraction when new generation may change identity or composition.
For real inventory, retain verified product imagery; invented text/features in
the mockup must be replaced with actual content.

Build live semantic text and usable controls. Do not ship the page mockup as a
full-page background with transparent click targets. Authored raster artwork can
remain raster; the interface around it must respond to content, input and width.
Use grid/flex and intentional layering to preserve the composition. Whole-page
absolute positioning against one screenshot usually loses that behavior.

Implement a representative composition with its real adjacent region first.
Preserve the image's large relationships before polishing small effects. Avoid
silently replacing unusual structure with familiar centered blocks or card grids.
When an infeasible detail must change, preserve its visual purpose and show the
concrete deviation instead of calling a vaguely similar result faithful.

## Compare the render to the selected image

Capture the implementation at the design's viewport and corresponding state.
Inspect the reference and render together, using aligned side-by-side views or
an overlay when available. First fix changes to subject scale/crop, section
proportions, hierarchy, spacing and silhouette; then type metrics and finer detail.
Check the real copy rather than reproducing generated spelling or fake controls.
Do this while the representative slice is small, then across the completed route.
Regenerating the reference to resemble a weak implementation is not a correction.

At mobile width, preserve emphasis and sequence through deliberate reflow, rather
than shrinking the desktop canvas. Generate a related mobile study if the reflow
itself remains a design problem. Inspect the real mobile page regardless.

For motion, the design image supplies compositions, not timing or mechanics.
Use selected frames as entry/development/resolution targets where helpful;
independently generated frames are not an animation sequence. Prototype the real
join using `CHOREOGRAPHY.md` and `MEDIA_HANDOFF.md`. Compare matching live states,
then test playback, reversal, controls and reduced motion through
`VISUAL_REFINEMENT.md`. A faithful still and a good moving experience are separate
things to verify.

Report what was preserved, material deviations and observed remaining issues.
Deterministic checks cannot certify fidelity or design quality; no automated
similarity threshold or builder-awarded taste verdict is introduced here.
