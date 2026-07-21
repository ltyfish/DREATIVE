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
4. Exercise motion at entry, midpoint, reversal, and release. Inspect reduced
   motion separately. Use console, network, and performance traces to explain
   defects, not to substitute for visual judgment.
5. Fix the highest-impact findings in the real source.
6. Recapture the affected viewport and the full page. Continue until blocking
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
