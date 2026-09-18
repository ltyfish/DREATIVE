# Rendered visual refinement

Use this loop on the real route after the first complete implementation. Browser
automation, screenshots, console/network inspection, and performance tools are
adapters; use the capable tools already available in the host. Prefer an
isolated browser profile. Never require access to a user's authenticated
personal browser when a clean profile can test the product.

For a motion-led slice, start this loop before the rest of the route exists.
When implementing a selected design image, use the comparison procedure in
`VISUAL_DESIGN.md` from the first representative slice. Keep the reference in
view, match viewport/state, and correct lost composition before surface polish.

`dreative motion-capture --url <preview-url> --out <directory>` records normal
desktop wheel/keyboard input, emulated mobile touch, and separate reduced-motion
playback. It writes videos, sectional screenshots, and observed input/scroll data.
Open the recordings or watch the live page: file existence is not inspection.
Capture traversal is bounded and reports when it did not reach the page end.
For a longer route use `--max-steps 64` (maximum 120), or inspect the remaining
passage directly. Compare the recording to sectional screenshots: missing
canvas/media, stale frames, or different rendering invalidate that recording
for judging the affected effect even when there are no console errors.
These are reproducible input samples, not a complete task test, a performance
benchmark, real-phone GPU evidence, or a taste verdict. Exercise the product's
primary task separately. Reduced-motion stills must not be scored as normal motion.

Treat package presence and browser-executable detection as unverified. Before
claiming this loop is available, verify a real launch and navigation to the
served preview. With the Dreative CLI, run
`dreative preflight --probe-browser <preview-url>`. A failed probe blocks this
loop until repaired or replaced by another confirmed browser adapter.

`dreative look --url <preview-url>` does the mechanical half of this loop for you:
it renders the route at 1440 and 390, writes screenshot tiles you can open, and
prints two lists. **BROKEN** is output that is invalid however you feel about it
— a viewport-sized hole, text below 12px, a page that scrolls sideways, an image
that never loaded, a reveal that never fired. **OBSERVED** is neutral fact you
cannot get from the source: what changes across each section on scroll, what
does not, what responds to a pointer. It sets no exit code and blocks nothing,
because none of it is a design judgement. An observation that a section only
fades in is not an instruction to add motion — a fade is right in plenty of
places; it is information you did not have while writing the code.

It does not replace looking. The report cannot see composition, whether a set of
images belong to one another, whether a section earns its height, or whether the
thing being sold is actually shown. Open the tiles.

## Loop

1. Run the production-equivalent route and exercise the primary journey.
2. Capture full-page screenshots at a representative desktop width and 390px.
   Add 320px only when density or fixed controls create risk.
3. Inspect the pixels, not only the DOM or accessibility tree. Record concrete
   findings tied to a route, viewport, section, and visible symptom:
   hierarchy, rhythm, type, crop, composition, contrast, repetition, overflow,
   controls, loading, and section handoffs.
   Compare the focal material to the actual subject the visitor needs to see.
   A loaded, licensed photograph may still have the wrong subject, scale or crop;
   a drawing may be excellent when its form and detail serve the direction.
   Judge the rendered view rather than ranking media by file type.
   Review the route as a sequence, including its useful middle and ending.
   Inspect optical typography explicitly:
   headline wrapping, cap-height and baseline relationships, tiny or
   low-contrast supporting copy, visual-anchor alignment, negative-space
   balance, and section-to-section rhythm.
4. Compare the weakest passage with the selected direction or relevant reference.
   Is the problem absent material, an uninteresting composition, interrupted
   continuity, flat timing, or awkward interaction? Fix that cause. A sequence
   can be mechanically correct and still feel dull. Reconsider its staging or
   premise when polishing the effect no longer improves the experience.
5. Exercise motion at entry, midpoint, reversal, and release. Inspect reduced
   motion separately. Use console, network, and performance traces to explain
   defects, not to substitute for visual judgment.
6. Fix the highest-impact findings in the real source.
7. Recapture the affected viewport and the full page. Continue until blocking
   findings are cleared and the correction does not damage another viewport.

When inspection finds a defect or mismatch with the brief, correct it and compare
the affected states before and after. Name the visible correction in delivery.
Do not manufacture a change merely to obtain a before/after pair.
For a promised transition, watch the passage between the matched endpoints.
Separate screenshots of an outgoing effect and an incoming grid cannot establish
that one becomes the other. Inspect normal motion on mobile too; a narrow screen
or coarse pointer is not a reduced-motion preference. Adapt framing, distance or
rendering cost before discarding the concept's defining behavior.

When a mechanical check flags a collision, verify the actual viewport and state.
Repair geometry, layering, focus or overflow while preserving the chosen function
and design. Removing the requested interaction to make a check green is a scope
change, not proof that the original experience was repaired. A false positive
needs concrete evidence and a reported limitation, not blind obedience or dismissal.
When sticky or pinned scenes create blank, repeated, clipped, or misleading
full-page captures, add sectional or stitched captures that truthfully show the
composition and handoffs; do not accept the broken capture as visual evidence.
If the first inspection finds nothing, deliberately test a different route,
viewport, content state, or interaction before accepting that result. A
structured snapshot cannot establish that typography, cropping, spacing, or
composition looks good.

Do not create a critic score, approval artifact, or screenshot ledger. Findings
are working notes. Persist only unresolved visual issues and the routes/viewports
actually checked in `.dreative/context.json`.
