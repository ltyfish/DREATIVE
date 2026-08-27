# Reference and library adoption

Use this only after product DNA and the concept fingerprint exist. Adoption
means extracting a bounded principle or filling a named capability gap. It does
not mean installing every source, merging house styles, or treating popularity
as evidence of fit.

For every selected source record:

- source and research role;
- at most two extracted principles;
- the project-specific adaptation;
- the exact section or state where it appears;
- at least two combined-style or signature traits deliberately not copied;
- license and attribution status when code or assets are used.

The executable Showcase record is intentionally shorter:

```text
source → extracted principle → target selector → visible implementation
```

Permission to study a reference is not adoption. If the user asked to follow a
reference, either record a visible adoption at a real selector or ask the user
to approve its rejection. Do not silently list a reference as considered.

For media, separate permission from commitment. Showcase records focal
commitments for the hero, Peak, and major post-Peak subject. Each names the
subject kind; supplied, sourced, generated, licensed-3D, pre-rendered, or
procedural origin; real source/file; rights; treatment; crop; animation;
mobile fallback; external options evaluated; and capability gap when relevant.
Final verification checks that every `use` commitment renders the declared
medium at the declared selector. Realistic physical focal subjects may use a
procedural treatment only with a concrete artistic-superiority reason.
It also checks source kind: local/generated records exist, remote URLs load,
inline selectors resolve, `none` fields agree, and licensed 3D uses a 3D medium.

## Research sources worth routing

- **Godly**: full-site composition, pacing, and interaction research. Study a
  complete arc; never copy one site's combined typography, palette, layout, and
  signature motion.
- **Refero / Refero Styles**: real product screens, stable flows, commerce and
  interface patterns. Prefer this for route purpose, task continuity, and
  non-hero product states.
- **Appshots and Mockuply**: media-presentation research only when the product
  actually needs app-store imagery, device framing, or screenshot storytelling.
  They are irrelevant to most editorial or physical-product storefronts.
- **Bklit**: specialist data-visualization input only for products whose real
  data and decisions require charts. It is not a general visual-style source.

## Motion research, specifically

Composition galleries answer what a page looks like. They cannot answer what it
*does*, and a motion build scouted only from stills will reproduce a still.
Watch the work run.

- **Awwwards** (Sites of the Day, and the Animation filter), **FWA**, and
  **Godly** filtered to motion-led work: whole shipped experiences you can open
  and scroll. Study one for a minute with your hand on the wheel, then write
  down what actually happened — what the material was, what drove it, how many
  distinct events there were on the route, and what the page did at the seams
  between sections.
- **Studio sites that ship their own work** — Unseen, Active Theory, Resn,
  Locomotive, Basement, Hello Monday and their peers. These are the clearest
  available evidence of what a motion ceiling looks like in production, and they
  are worth opening precisely because the ceiling is hard to imagine from
  descriptions.
- **Codrops** and **Awwwards case studies** for how a specific mechanism was
  built, after you know which mechanism you want.

Two rules survive contact with all of these. Extract the *mechanic and the
pacing* — what is driven, by what input, over what distance, how many beats —
never the combined look. And never name a studio as the concept: "make it feel
like X" is the imitation failure with an extra step, and this file's
independence test in `CREATIVE_DIRECTION.md` rejects it.

What these references are genuinely for is calibration. The standing failure in
this skill's record is not bad taste, it is aiming low — building the version
that was easy to reach and calling it the design. Looking at three shipped
motion sites before you write the brief is the cheapest correction available.

## Conditional component and mechanism sources

Uilora, Origin UI/Kit, Lukacho UI, Sprrrint, Skiper UI, Watermelon UI,
GrayBlocks, Aceternity UI, Uiverse, Kokonut UI, Variant, and similar collections
overlap heavily. Use zero or one source initially for one named primitive or
mechanism. Record accessibility, dependencies, bundle cost, customization, and
concept fit. Copy-paste availability is not a reason to adopt it.

Animmaster and similar rebuilt-effect libraries may be studied for timing,
layering, or input-response mechanics. Reconstruct the product-native behavior;
do not transplant a recognizable signature effect.

## Runtime boundaries

GSAP, Motion, and Anime.js are alternative animation owners, not a stack.
Select the smallest runtime that owns the required mechanism. One element
property must not be authored by more than one of CSS timelines, GSAP, Motion,
Anime.js, or state-driven inline styles. Add a second runtime only for a
separate named capability with a non-overlapping selector/property boundary.

## Not Dreative dependencies

Manus and 10x.app are builders rather than missing frontend primitives. Do not
adopt them as runtime or component dependencies. They may be compared only as
workflow products when that is the actual research subject.
