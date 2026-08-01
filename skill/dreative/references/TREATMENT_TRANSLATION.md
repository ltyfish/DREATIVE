# Treatment translation

Read this after the user selects a treatment board and before coding its
production-like prototype. A treatment is a visual operating system, not a
palette sample. The goal is to preserve the reason the user chose it while
adapting its ideas to real product content and behavior.

## Find the selection reason

Inspect the chosen board beside the rejected alternatives. Identify the two or
three differences most likely responsible for the selection. Prefer observable
relationships over adjectives:

- composition: panel cuts, overlap, crop, scale contrast, negative space;
- subject hierarchy: which physical object or content owns each frame;
- material and light: paper, metal, glass, grain, shadow, reflection, depth;
- typography: scale, density, alignment, interruption, label-to-display ratio;
- handoff grammar: what crosses, folds, pours, opens, transfers, or resolves;
- time and agency: what the visitor controls, what scroll authors, what rests;
- mobile transformation: how the same idea changes framing and sequence.

Do not reduce these observations to mood words such as premium, cinematic,
modern, tactile, bold, or clean. Those words are too weak to guide execution.

## Make a translation lock

Before implementation, privately bind all six categories below to the real
prototype. Each binding names the section, visible selector, production medium,
start state, end state, and the insufficient version that must be rejected.

1. Composition system — the page-level framing and section-to-section rhythm.
2. Focal subjects — the real product, process, object, person, or data that
   carries each major stage.
3. Material and lighting — the surface/depth behavior that gives the board its
   physical credibility.
4. Type and information scale — the proportions that create its editorial
   authority and reading rhythm.
5. Handoff mechanism — the visible relationship connecting at least two stages.
6. Mobile translation — a structural recomposition, not a desktop stack.

Also record explicit prohibited substitutions. Examples:

- realistic machinery or products replaced by CSS/SVG approximation;
- photographic landscapes replaced by gradients or generic blobs;
- panelized or object-led editing replaced by ordinary stacked sections;
- a continuous physical handoff replaced by floating decorative particles;
- hero-grade fidelity followed by placeholder cards below the fold;
- expressive large-scale type reduced to safe landing-page proportions.

If the chosen treatment relies on a capability or asset that is unavailable,
escalate the gap before lowering the ceiling. Convenience, package familiarity,
token cost, and time are not artistic reasons for substitution.

## Resource and fidelity budget

Allocate media before styling components. For every hero, peak, and post-peak
stage, choose the strongest truthful medium: supplied/sourced/generated image,
video, pre-rendered sequence, authored SVG, or spatial runtime. A single strong
hero image does not cover later focal stages. Generated or sourced media should
be art-directed as a set: consistent world, distinct subjects, deliberate crops.

Match runtime to the handoff. Use GSAP or another specialist system when the
selected choreography needs coordinated pinning, scrubbing, masks, or
shared-object motion. Do not downgrade the handoff to independent fade-ups just
because CSS is available.

## Prototype self-review

Capture the selected treatment board and prototype at comparable desktop and
mobile frames. Review them side by side before showing the user.

Ask:

- If palette and copy were removed, is the same composition logic still clear?
- Are the board's focal subjects equally real, prominent, and varied?
- Did its material depth survive, or become flat UI decoration?
- Is the defining handoff visible in a still and legible in motion?
- Does the post-hero region retain the treatment, or fall back to components?
- Does mobile reinterpret the treatment rather than merely stack it?

If two or more answers are no, the prototype is not production-like. Revise it
before asking for acceptance. Never use functional state propagation, build
success, artifact existence, or animation count as a substitute for this visual
comparison.

## User review presentation

Show, together:

- the selected board;
- matched desktop and mobile prototype captures;
- a short desktop and mobile recording of the defining handoff;
- one concise statement of what was preserved;
- honest limitations that remain visible.

Do not describe the prototype as faithful, successful, or production-like when
the side-by-side evidence contradicts that label. The user supplies the taste
verdict.
