# Rendered visual refinement

Use this loop on the real route after the first complete implementation. Browser
automation, screenshots, console/network inspection, and performance tools are
adapters; use the capable tools already available in the host. Prefer an
isolated browser profile. Never require access to a user's authenticated
personal browser when a clean profile can test the product.

Treat package presence and browser-executable detection as unverified. Before
claiming this loop is available, verify a real launch and navigation to the
served preview. With the Dreative CLI, run
`dreative preflight --probe-browser <preview-url>`. A failed probe blocks this
loop until repaired or replaced by another confirmed browser adapter.

## Loop

1. Run the production-equivalent route and exercise the primary journey.
2. Capture full-page screenshots at a representative desktop width and 390px.
   Add 320px only when density or fixed controls create risk.
3. Inspect the pixels, not only the DOM or accessibility tree. Record concrete
   findings tied to a route, viewport, section, and visible symptom:
   hierarchy, rhythm, type, crop, composition, contrast, repetition, overflow,
   controls, loading, and section handoffs.
   For every prominent decorative line, grid, overlay, shape, persistent
   element, or motif, name its concrete role in product meaning, hierarchy,
   interaction, or continuity; remove or redesign it when the rendered
   experience does not make that role perceptible. Compare hero-grade media
   reused across major sections and require visible evolution in crop, state,
   material, meaning, or interaction unless a distinct composition is used.
   In each section, name what the eye lands on first and whether that thing is
   real material or something you drew. Sourced photographs relegated to a strip,
   a card grid, or a below-fold gallery beneath a drawn focal figure is the
   inversion blind review reads as "it is all SVG" — correct it by swapping what
   holds the section, not by drawing more. Check the crop at 390px too: a frame
   whose subject is unreadable there is decoration on a phone.
   Review the route as a sequence: compare the primary peak with at
   least one development or consequence away from it and inspect their handoff.
   Flag when one section owns nearly all salient motion, media change, or
   compositional transformation. Inspect optical typography explicitly:
   headline wrapping, cap-height and baseline relationships, tiny or
   low-contrast supporting copy, visual-anchor alignment, negative-space
   balance, and section-to-section rhythm.
4. Inventory the whole route by section, in one pass: for each one, write what
   physically holds it — a photograph, a sequence, a clip, a real surface, a real
   state, notation drawn over one of those, or type alone. Then read the list.
   One section fully realised above a run of tables, card rows and drawn figures
   is the commonest shape of an unfinished page, and it is invisible while you
   are looking at the peak, which is why this is a separate pass. Type alone is
   a real answer where it was chosen; the finding is a section nobody decided.
   Fix it by funding those sections, not by adding motion to them.
5. Exercise motion at entry, midpoint, reversal, and release. Inspect reduced
   motion separately. Use console, network, and performance traces to explain
   defects, not to substitute for visual judgment.
6. Fix the highest-impact findings in the real source.
7. Recapture the affected viewport and the full page. Continue until blocking
   findings are cleared and the correction does not damage another viewport.

At least one before/after correction cycle is required for Lean and Full Audit.
The pair must show a perceptible rendered change and the final response must
name the correction. Byte-identical or visibly duplicate captures do not count.
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
