# Compose the whole experience

Use before choosing a motion-led route's decisive slice, and when a route feels
like a hero followed by a template. This is an authoring method, not an effect quota,
mandatory storyboard artifact, or another approval gate.

## Edit the information before animating it

Describe the change in the visitor's understanding or agency across the route.
For example: encounter an unfamiliar object, see how it works, explore the
relevant detail, choose, then leave with confidence. Another project may start
with the task and let exploration follow it. Choose the order for the subject.

Content constants describe facts, not page architecture. Required measurements
can be an annotated view with a complete comparison table; process facts can
be a sequence of material changes; a review can sit beside the feature it
describes. Keep every required fact and its accessible retrieval path. Never
invent evidence or bury critical information solely to make a story cleaner.

Compose the route with the actual material at its intended scale. Inspect an
overview of its resolved compositions and then its transitions. A page of
similarly sized rectangles will remain one after each rectangle receives an
entrance effect. Change crop, density, hierarchy, spatial relationship, or the
visitor's mode of exploration where the content calls for it.

A focal device is not continuity by itself. If the opening promises a subject,
carry that subject, state, or visual grammar into the first useful task region
or a deliberate ending. A beautiful local canvas followed by an unrelated grid
still leaves the route unresolved; the receiving composition is part of the
motion design.

Choose color from the material and the emotional direction: background, ink,
material colors, and a purposeful contrast accent. Test those relationships in
the opening, a dense task state, and the closing composition. A familiar neutral
palette plus an italic display face is not automatically appropriate restraint.

## Give a transition a relationship

Think of a join as `outgoing composition → carrier → incoming composition`.
The carrier might be a subject, edge, word, camera axis, color field, or rhythm.
Choose the relationship first; then choose the renderer. Examples below are
mechanical starting points to adapt, not sections to insert into every site.

| Relationship | How to construct it | What to inspect |
|---|---|---|
| Image becomes a working view | Measure its source and destination frames. Carry the same image through an overlay or FLIP transform; reveal controls as it settles; return ownership to the ordinary layout. | No duplicate subject, jump in crop, covered controls, or lost return position. |
| Typography makes room for evidence | A meaningful phrase separates or changes line spacing while an image aperture grows in the resulting space. Keep the image crop independent of the text displacement. | Readable phrase before and after; mobile line breaks; a held result rather than endless text travel. |
| Detail explains a claim | Match a wide shot to a close-up around a shared feature; attach live labels to the resolved feature. Use actual macro material, a model, or a clear diagram when a crop lacks detail. | The feature really supports the claim; labels track it; no fake detail from excessive enlargement. |
| One scene hands to another | Overlap their timelines around a shared edge, hue, silhouette, or direction. An incoming frame can occlude the outgoing frame without moving both entire sections. | Mid-transition layering, meaningful destination, reverse and fast traversal. |
| Choice reorganizes a collection | Retain item identity and animate measured layout changes; keep selection, focus, and reading order stable. A detail view can borrow the selected image and return it to its origin. | Rapid filter changes, removed items, empty state, Escape, touch, and keyboard. |
| Process becomes visible | Couple real steps to a changing subject, footage edit, or annotated state. Hold each useful result; let controls select steps without forcing a scroll tour. | The visual adds information beyond the caption; all facts remain reachable. |

For implementation, use the selected runtime in `CREATIVE_EXECUTION.md`,
the treatment in `../skills/motion.md`, and material in `MOTION_MATERIAL.md`.
Do not assemble several borrowed demos and hope a shared font unifies them.

## Author timing as deliberately as layout

Set the established and resolved compositions before interpolating. During the
transition decide what leads, what follows, what overlaps, and what rests.
A frame might open before its caption arrives; the subject might settle while
the next field is already entering. Tune these offsets in playback.

Use scroll for visitor-controlled development, time for a short reaction or
autonomous footage, and explicit controls for intentional choices. Combining
them is useful when ownership is clear: scroll frames a paused video, then a
button starts playback. Avoid an invisible fight between scroll and playback.

Distance is time demanded from the reader. If a pin lasts several screens,
watch what actually changes during each screen of input. Shorten inert spans
or author a meaningful development. A reading hold is useful only when there
is something worth reading and the user can still leave.

Carry a visual grammar, but let it develop. A motif can change from atmosphere
to an explanatory mark to interaction feedback. Repeating the hero's reveal
on every image is repetition of execution, not necessarily development.

## Design the task, not just the approach to it

Keep the familiar meanings of controls while choosing their presentation.
A useful diagram, image comparison, spatial index, or contextual detail view
can be easier to understand than dense repeated cards. Conversely, a direct
grid or table may be exactly right. Compare an expressive presentation with
the direct one using the actual amount of content and primary user action.

Motion should preserve orientation through those choices: the selected subject
stays identifiable; new details have a clear origin; returning restores context.
Keep controls live during transitions and handle interruption from the current
visual state rather than replaying an entrance queue. On touch, replace hover
discovery with a visible control. Never require precision scrubbing to buy,
read a measurement, or obtain an answer.

## Give the ending a composition

Resolve something introduced earlier: return to the object at a new scale,
let a typographic phrase complete, show the resulting state, or close with a
deliberate still image and useful next action. Service links and required facts
can share this composition. The last section does not need another spectacle,
but it needs a decision about scale, space, material, and what remains in memory.

## Diagnose the visible failure, then choose the operation

| Visible failure | Production correction |
|---|---|
| An opening consumes a screen before the subject arrives | Compose the subject, a meaningful preview, or a purposeful opening action into that time. A load screen should reflect actual readiness and release as soon as its critical assets are usable; never fabricate a waiting percentage. |
| A zoom promises detail the photograph does not contain | Acquire a close-up, footage, model, or explanatory drawing. Pixelation changes representation; sharpening the same wide shot cannot reveal unseen construction. |
| The image jumps at the canvas/DOM join | Share the source, crop, frame geometry, and transform. Follow `MEDIA_HANDOFF.md`; matching the outer rectangles alone is insufficient. |
| Everything below the hero is the same rectangle | Re-edit information around comparison, evidence, or exploration and compose with the actual quantity of material. A direct grid remains valid where it serves the task. |
| Lower-page entrances are invisible in playback | Trigger viewport entrances when encountered, rather than running every mount animation at page load. Direct entry and reduced motion must still show the content. |
| The scene ends and unrelated layout starts | Give it a real destination in the next layout, or author a deliberate cut with a shared visual relationship. Continuity need not mean endless morphing. |
| An overlay looks closed but its controls receive focus | Use semantic dialog behavior and inactive-state handling. Test open, interaction, Escape, return focus, and the actual final action. Clipping and opacity do not disable controls. |

Use these diagnoses only when observed. They are not a list of effects to add.

## Review the weakest passage

Watch from the first meaningful transformation through the task and ending.
Then enter directly in the middle. Can the visitor understand and use it there?
Compare the least-resolved passage to the chosen ambition: missing material,
repeated composition, an unexplained join, dead distance, or an information
dump requires a different correction. Adding a reveal cannot fix all five.

Use a brief before/after observation tied to the visible change. Stop revising
when the requested experience holds together and defects are resolved; no
number of transformations, references, or libraries certifies the result.
