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

For media, separate permission from commitment. A selected asset commitment
records its product role, use/reject decision, medium, target selector, and
rationale. Final verification checks that every `use` commitment renders the
declared medium at the declared selector.

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
