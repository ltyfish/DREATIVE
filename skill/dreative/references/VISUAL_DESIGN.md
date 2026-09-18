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

## Before generating: decide what the image must resolve

Develop the concepts before writing image prompts. Use the real brief to identify
the visitor's task, required content and density, subject identity, and constraints.
For each idea decide the central relationship, opening, working middle, ending,
and material that can actually be produced. Reject alternatives whose only
difference is a palette or treatment. A brief public summary of the exploration
is enough; do not ask the user to approve an internal planning document.

For motion-led ideas, plan the event now, before a still locks the composition:
input, entry composition, transformation, readable hold, destination and release.
Identify what persists and who owns its movement. Plan touch and reduced-motion
forms alongside it. Ask the generator for corresponding composition studies;
independent generated frames establish endpoints, not interpolatable animation.

For a subject-led brief, make a material decision before locking the event:
identify the exact subject view the task needs, verify that it can be produced,
and name the honest fallback if it cannot. A texture study, drawn flat, or
contextual photograph can shape an editorial concept, but it cannot silently
stand in for a product view that the visitor must inspect or buy. Recompose the
presentation while preserving the task; keep missing required material explicit.
Changing the task itself needs the user's scope change.

Let production experiments inform the image. When the idea depends on movement,
try its uncertain moment with the intended material before polishing all its
static states. A lightweight moving sketch can reject a weak premise early;
it is neither a finished alternative site nor another approval gate. Bring the
successful spatial relationship back into the composition studies.

Choose the generation unit deliberately: a route overview for structure, a dense
section for content fit, related states for a handoff, or a separate asset for
production. Keep one task and content set across alternatives so differences
reflect the ideas. Separate immutable identity/facts from invented visual material.
Name the uncertainty each call resolves and reserve effort for asset production,
the live prototype and browser correction. Do not spend that budget polishing
mockup text that will become live text anyway.

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

## Worked studies: generation intent to a moving interface

These are authored teaching examples, not reports of generated images or accepted
client work. `systems/production-lab.html` contains runnable slices for the three
relationships below, using live typography and original graphic artwork. In the
Dreative repository run `node scripts/serve-foundations-demo.mjs` and open
`http://127.0.0.1:4177/production-lab.html`. In another project serve the copied
systems directory over HTTP. Adapt the relationship to the brief; do not insert
all three into a page. The lab proves bounded mechanics, not a complete production.

### Type becomes a programme — fictional print exhibition

**Plan:** the visitor discovers printmaking sessions and chooses one. Type is the
subject, so a large PRINT / IN MOTION composition opens to reveal the live programme.
The same paper field carries the opening into three readable session rows and a
closing visit action. Motion separates the title groups, opens the programme
aperture, then holds; touch can scroll or use the visible progress control.
Reduced motion shows the programme immediately without a pin.

**Generate:** “Design a fictional print exhibition page at 1440px, front-on. Keep
the exact title PRINT IN MOTION and sessions Type in public / Ink and pressure /
After the impression. Explore monumental typography becoming the frame around a
compact programme, followed by a practical visit section. Show opening, resolved
programme and ending as related sectional views. Use live-text-compatible flat
letterforms and a warm paper field with red ink accents; invent spatial
relationships, not extra programme items. No device framing.”

**Implement/inspect:** use two visual title groups around semantic text, a single
scroll signal and separately timed title/aperture tracks. Keep a readable result
before release into the next composition. Test reversal, fast input, content
growth, narrow line breaks and reduced motion. A title sliding past an unrelated
programme is a failed relationship even if both animate correctly.

### An edition moves into its reading room — fictional graphic archive

**Plan:** choose a graphic edition, read its description, return to the same
collection position. Compare an index of oversized covers with a compact reading
surface; carry the chosen cover into that surface. Keep controls available while
motion runs. The lab uses authored typographic covers, not generated inventory.

**Generate:** “Explore a graphic archive page with three fictional editions:
Signal / Field / Interval. Show the collection and the open Signal reading state
as related front-on compositions. Preserve edition identity and cover artwork
between states. Give the selected cover a distinct origin and destination beside
live description and Back to editions control. Include a mobile reading state.
Compare a generous visual index with a compact editorial reading room; avoid
inventing account or checkout features.”

**Implement/inspect:** move the actual cover between measured layout parents and
animate the layout delta. Keep a stable accessible name, history/state ownership,
Escape and return focus. Resize or an interrupt must resolve to the current
layout, not an obsolete coordinate. If generation changes the cover between
states, edit for identity or reuse the original artwork; a crossfade hides the
problem rather than preserving the chosen item.

### A process can be inspected — two-color print registration

**Plan:** explain how two inks overlap; users select the individual plates or the
registered result. Graphic plates are appropriate because this is a diagram,
not a simulation of a printing press. A resolved overlap supplies information
that two generic photographs would not. The lab uses SVG plate geometry with
explicit controls and readable explanations in ordinary flow.

**Generate:** “Design an educational page explaining a two-color print. Use three
related states: red plate, blue plate, registered overlap. Preserve the same
geometry across all states and keep explanatory text outside the artwork.
Show a selectable process diagram at real reading size plus its introductory
and concluding content. Explore a technical workbook arrangement and a public
exhibition arrangement with the same information. Treat the image as composition
guidance; the final diagram will be live vector artwork.”

**Implement/inspect:** keep the geometry in SVG and animate plate offsets from the
current state; explicit selection drives it. The text and active control update
together. Test rapid selections, keyboard, touch and preference changes. Generated
diagrams may contain incorrect overlap or labels: verify the explanatory model,
then author the actual diagram rather than shipping its mistakes as facts.

For a new subject, a contrasting fourth study might use actual footage or a model;
first prove the required material can show the event. More examples are useful
when they introduce a different relationship or solve an observed uncertainty.
Repainting an existing example adds volume without expanding execution ability.
