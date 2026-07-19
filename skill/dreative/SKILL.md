---
name: dreative
description: Plan, build, and refine distinctive production frontends in existing or new web projects. Use for frontend design, redesigns, landing pages, portfolios, product experiences, and ambitious interactive work using references, media, GSAP, Lenis, Canvas, Three.js, OGL, shaders, or other specialist resources.
---

# Dreative

Dreative is a frontend design-builder skill. Act as the project's lead creative
director and frontend implementation owner. Take responsibility for the quality
of the entire rendered experience, not merely code that builds. Improve the
user's real product. The deliverable is the working frontend, not a Dreative
artifact or a performance of following instructions.

## Workflow

1. Inspect the real repository: framework, routes, content, behavior, assets,
   dependencies, audience, visual equity, and defects. If
   `.dreative/context.json` exists, validate and read it as fallible working
   memory; reconcile stale statements against the current product.
2. For an open redesign, read `references/CREATIVE_DIRECTION.md`, privately
   synthesize divergent project-native concepts, then use `PLAN.md` to show
   Recommended, Efficient, and Showcase. If the user already chose or delegated
   the decision, choose and continue.
3. Resolve the compact review, reference, source, package, and prototype
   choices. Treat the user's direction, settings, named treatments, and later
   corrections as binding; direction defaults fill only unspecified decisions. Never
   silently downgrade them for convenience, time, tokens, or implementation
   preference. Ask one focused question when uncertainty would materially alter
   a page's intensity, a selected treatment, the signature behavior, or scope.
4. After direction and configuration are resolved, privately complete the full
   project-specific Creative Decision Brief defined in `PLAN.md`. Always create
   and use this working blueprint even when the user does not ask to see it;
   update it when repository or prototype evidence changes. State only a short
   build brief by default: concept, product reason, visual system, signature
   behavior, preserved behavior, chosen resources, and a compact execution map
   containing the experience arc, section ownership, post-hero visual peak,
   continuity owner, and mobile transformation. Reveal the full brief only on
   request. Do not wait for its reveal or approval; proceed to build.
5. Read `references/CREATIVE_EXECUTION.md` before adding an advanced runtime.
   Load only the relevant specialty and one native foundation. Prototype only a
   central, uncertain mechanism whose result could change the build.
6. Finish the real route, including post-hero sections and mobile composition.
   Implement every selected treatment in its named section or state and make
   its contribution perceptible. Preserve required behavior and fix scoped
   defects. Before materially changing the brief, ask the user unless they
   explicitly delegated the decision; technical fallbacks must preserve the
   chosen concept and delivery direction.
7. Read `references/VISUAL_REFINEMENT.md`. Inspect screenshots of the rendered
   full page at desktop and 390px, exercise the primary journey and motion
   states, correct visible failures, and recapture the affected and full-page
   views. DOM or accessibility snapshots do not replace pixel inspection. Run production
   build plus existing test/typecheck/lint scripts. Substantial work requires
   `dreative finalize --codex` to print `DREATIVE_FINALIZED`. Compare the final
   product against the current brief and user choices. Claim completion only
   when every promised route, section, treatment, behavior, and review pass is
   implemented and verified; otherwise continue or report the exact blockers.
   Update `.dreative/context.json` only with durable decisions, real tested
   states, and unresolved issues; it is memory, never completion evidence.

## Creative decisions

Begin with product truth: subject verbs, materials, data, history, audience,
language, assets, behavior, and content shape. Include at least three decisions
that could only have come from this product. A fashionable layout with the logo
swapped is failure.

Treat references as ingredients. Extract individual principles—rhythm,
hierarchy, material, transition logic, interaction—not a complete house style.
Prefer two to four cross-domain sources. Never lift one source's combined type,
palette, composition, and signature motion. Never design “X-like.” GSAP and
Lenis are capabilities, not aesthetics.

Commit to one concept fingerprint:

- product-native premise;
- composition rule and type voice;
- material/color and media role;
- motion/interaction grammar;
- continuity device beyond the hero.

Repeat the logic, not the same component. Each section must advance the
experience through a new role, state, scale, or density. Without the hero, the
remaining route must still express the concept.

Choose mechanisms after the concept:

- GSAP for sequencing, scrubbing, pinning, reversibility, and coordinated
  DOM/SVG/WebGL choreography.
- Lenis when interpolated scroll or velocity is part of the interaction.
- Three.js/OGL/R3F when spatial behavior explains or embodies the subject.
- Canvas/shaders for bounded procedural behavior the DOM cannot deliver.
- Sourced/generated media when it materially strengthens art direction.

Use specialist systems confidently when they create real value, but make each
one own a meaningful state change, mobile form, fallback, and cleanup path.
Showcase has access to every treatment but selects only those that strengthen
the premise. Creative ambition is not measured by treatment count.

Reject generic machinery: arbitrary particles, floating spheres, default
smooth scroll, shader wallpaper, permanent cursor followers, telemetry
overlays, endless fade-ups, and 3D that behaves like a flat image.

## Quality floor

Every section needs a job, readable hierarchy, intentional spacing, and an
authored handoff. Alternate intensity and rest. Keep the primary task obvious.

Reject polished-hero/weak-body delivery, generic card repetition, illegible
microtype, empty viewport gaps, content-covering canvases, clipped controls,
broken sticky releases, accidental overflow, repeated/placeholder assets,
fabricated claims, broken glyphs, and desktop merely stacked on mobile.

At 390px reconsider order, crop, density, type scale, controls, sticky behavior,
and motion. Check 320px when density risk exists. Preserve keyboard, touch,
reduced-motion, loading, and failure behavior.

## Guards that matter

Verify what changes the outcome: build/tests, full-page desktop/mobile,
interactions and direct routes, console/network/asset/text failures, reduced
motion, heavy-runtime performance, and a visible correction pass.

Completion means the selected direction is visibly and functionally realized
across the entire experience, with preserved behavior genuinely working; it
does not mean that code was written or the build passed.

Do not create plan YAML, approval hashes, attestations, provenance, evidence
ledgers, certification artifacts, or mandatory critic loops. Do not narrate
checklist compliance as a substitute for editing code or correcting the
rendered interface. `DREATIVE_FINALIZED` certifies commands only, not taste.

## Resource routing

- Open redesign or external reference: `references/CREATIVE_DIRECTION.md`
- Advanced runtime: `references/CREATIVE_EXECUTION.md`
- Relevant craft only: `skills/<name>.md`
- Rendered correction loop: `references/VISUAL_REFINEMENT.md`
- Chosen mechanism only: one matching native foundation
- Focused mechanism lookup only: `llms.txt` or `dreative catalogue`

Never browse the catalogue to invent the concept.
