# Materials

`SLOP.md` says what not to reach for. `PRINCIPLES.md` says what holds and under
what condition. Neither hands you anything to build with, and eleven blind pairs
say the gap is on that side: the Dreative arm is reliably called clean and not
generated, and reliably loses on nothing being memorable.

This file is stock, not a style. Every entry is a real, specific, usable
material with the condition it belongs to and what it costs.

**How to use it:** pick one row from Type, one construction from Colour, one
from Composition, and the ambient grammar. Pick them from *different* entries.
Taking a whole column — the same font pairing, palette construction, and layout
that another Dreative build used — reproduces the exact failure this file exists
to fix, one level up: a new average instead of the old one. If a choice here
does not fit the product, the product wins. This is a shelf, not a spec.

None of this replaces the concept. Read `references/CREATIVE_DIRECTION.md`
first; materials serve a premise you already have.

---

## 1. Type

Inter, Roboto, Open Sans, Lato, Montserrat, and Poppins are the distributional
default. They are not forbidden — Inter set at a deliberate scale with real
measure discipline beats a distinctive face used carelessly — but reaching for
one without a reason is the tell.

All of the below are open-licensed and self-hostable.

| Pairing | Voice | Condition | Cost |
|---|---|---|---|
| **Instrument Serif** display / **Söhne** or **IBM Plex Sans** body | editorial, confident, human | publications, studios, food, anything with a point of view | display face needs generous size and tight tracking or it looks accidental |
| **Bricolage Grotesque** everything, one family, wide weight range | contemporary, slightly odd, engineered | product and tooling that wants personality without decoration | its width axis is the point; a single weight wastes it |
| **GT Alpina** / **Newsreader** body at 19–21px, **no** display face | quiet, literary, slow | long-form, documentation, research, anything read rather than scanned | needs real editorial structure or it becomes the wall of prose that keeps losing |
| **JetBrains Mono** or **Berkeley Mono** for headings, humanist sans body | technical, precise, built | developer tools, data, infrastructure, hardware | mono headings above ~40px get loose; tighten tracking hard |
| **Playfair Display** / **Libre Caslon** display, **Work Sans** body | classical, luxury, heritage | jewellery, hospitality, law, legacy brands | the single most over-reached-for "premium" pairing; earn it with real imagery |
| **Space Grotesk** display, **Space Mono** for numerals only | systems-y, cool, slightly retro | analytics, fintech, marketplaces | the numeral trick is the whole idea; using mono for prose too dilutes it |
| **Archivo Expanded** / **Anton** at extreme scale, minimal body | loud, physical, poster | sport, music, events, streetwear, launches | fails completely at 390px unless the mobile scale is authored separately |
| One face, **two optical sizes** (e.g. **Fraunces** 144pt display + 9pt text) | crafted, coherent, considered | anywhere you want restraint that still reads as designed | requires understanding optical sizing; wrong axis values look like a bug |

Beyond the face itself, these move more than the choice does:

- **Scale by ratio, not by round numbers.** Pick 1.2 (dense, UI), 1.25, 1.333
  (editorial), or 1.5 (poster) and derive every step. Six steps maximum.
- **Measure is 60–75 characters.** The most common real typographic defect on
  generated pages is a 1400px-wide paragraph, and no font choice survives it.
- **One deliberate scale break per route.** A single element 3–4× larger than
  anything near it does more for hierarchy than five carefully graded steps.
- **Numerals are a decision.** Tabular for anything compared or aligned, oldstyle
  in editorial body. Default lining proportional figures in a data table are a
  visible defect.
- **Set tracking against size.** Display sizes want negative tracking (−0.02 to
  −0.04em); small caps and 12px labels want positive (+0.04 to +0.08em).

## 2. Colour

Do not start from a hue. Start from a construction, then let the product pick
the hue.

- **Ink on paper.** One near-black (never `#000`; try `#12100E`, `#131A17`,
  `#1A1614`), one warm off-white (`#F4F1EA`, `#FBF7F0`), one accent used under
  5% of surface area. Condition: editorial, documentation, anything text-led.
  Cost: needs typography and imagery to carry everything; nowhere to hide.
- **Single-hue depth.** One hue, five to seven values from near-white to
  near-black, all sharing a temperature. Colour comes from *value* separation,
  not from a second hue. Condition: product surfaces, dashboards, tools. Cost:
  can read as monotonous; break it with one saturated accent or real imagery.
- **Sampled from the subject.** Pull the palette out of the actual product
  photograph, material, or environment. Condition: anything with real focal
  media — and it makes the page feel photographed rather than themed. Cost:
  requires the imagery to exist first, which is the correct order anyway.
- **Two temperatures.** A cool neutral field with one warm material tone (or
  the reverse). Condition: anything physical, made, or manufactured. Cost: the
  ratio has to be lopsided — 90/10, never 50/50.
- **Saturated ground.** Full-bleed saturated colour as the field, with type
  and imagery on top, rather than colour as accent on white. Condition: brands
  with real confidence; launches, events, campaigns. Cost: contrast and
  reduced-motion/accessibility work get harder, not easier — check every state.
- **Duotone media.** Photography mapped to two brand values so mixed-quality
  sourced imagery becomes one system. Condition: you have several images from
  different sources. Cost: destroys product colour fidelity — never on
  merchandise a customer is buying.

Practical:

- Build with **OKLCH**, not HSL. Equal lightness steps actually look equal.
- **Contrast the accent against its own use**, not against white in the
  abstract. An accent that only ever appears as 14px text needs different values
  than one used as a 400px field.
- **Dark mode is a separate design**, not an inversion. If you cannot afford to
  design it, ship one theme deliberately rather than a broken second one.

## 3. Composition

Alternatives to the centred hero and the three-card row, each with the
condition that earns it.

- **Full-bleed subject, type overlaid or beneath.** One large photograph or
  render of the actual thing, type doing minimal work. Condition: the product is
  physical and you have a genuinely good image. This is the highest-return
  composition in the file and the one most often skipped because the image is
  hard to get.
- **Asymmetric split.** 62/38 or 70/30, subject on one side, type stack on the
  other, with a hard edge between them. Condition: one dominant subject plus a
  short claim. Cost: needs a real edge — a colour change, a material change — or
  it reads as a broken centred layout.
- **Type-only opening.** No image at all. One enormous statement, set well, with
  the page's structure visible below the fold. Condition: the claim is the
  product (publications, agencies, manifestos, pricing changes).
- **The index.** Open with a dense, structured list of everything the route
  contains — numbered, tabular, scannable. Condition: catalogues, documentation,
  archives, portfolios with real volume. Directly answers the scannability loss.
- **Specimen sheet.** The product shown as a technical drawing, exploded view,
  spec table, or annotated diagram. Condition: hardware, tools, anything with
  parts or measurements.
- **The stage.** One fixed frame the content moves through, rather than sections
  the reader moves past. Condition: a genuine process or sequence, and only when
  you can verify it at 390px.
- **Editorial column with figures.** Real body column, generous measure,
  interrupted by full-bleed figures with captions. Condition: long-form that
  still has to be scannable — captions do the scanning work.

Structural moves that cost almost nothing:

- **Break the container once.** A single full-bleed element on an otherwise
  contained page creates more rhythm than varying every section's width.
- **Vary section height deliberately.** Six sections at 100vh is a slideshow.
  Rest sections should be short.
- **Let one grid column stay empty.** Deliberate void reads as confidence;
  filling every column is what "cramped" means.
- **Real rules and edges are allowed.** A 1px line, a border, a radius are not
  slop. SLOP #4 was over-read into a ban on borders and radius, and the result
  was called out for using nothing but rectangles.

## 4. The ambient layer

This is the cheapest material here and the one the control keeps winning on.
It is meant to be unoriginal. Copy it, tune the values to the product, apply it
once to the whole route.

```css
:root {
  --ease-out: cubic-bezier(.2, .8, .3, 1);   /* entrances, hovers */
  --ease-in-out: cubic-bezier(.6, 0, .3, 1); /* state changes both ways */
  --t-fast: 120ms;   /* colour, background, border, opacity */
  --t-base: 180ms;   /* shadow, transform, small movement */
  --t-slow: 320ms;   /* regional entrance */
}

a, button, [role="button"], summary, input, select, .card {
  transition: color var(--t-fast) var(--ease-out),
              background-color var(--t-fast) var(--ease-out),
              border-color var(--t-fast) var(--ease-out),
              box-shadow var(--t-base) var(--ease-out),
              transform var(--t-base) var(--ease-out);
}

:where(a, button, [role="button"]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { transition-duration: 1ms !important; animation-duration: 1ms !important; }
}
```

Pick **one** grammar for what changes on hover and use it everywhere on the
route — background shift, or underline growth, or a 1–2px lift, or a border
darkening. Mixing four grammars is worse than picking the boring one.

For regional entrance, one shared rule: 12–20px of travel, opacity 0→1, 320ms,
triggered against the **top** of the viewport (`rootMargin: "0px 0px -15% 0px"`
or equivalent), `once: true`, and never on the first screen — content already
visible on load must not animate in.

Then stop. This layer is the floor, not the answer. It is explicitly not where
distinctiveness comes from, and a route where *every* region fades in uniformly
and nothing else happens has satisfied the floor and built nothing.

## 5. Depth without the blob

The blurred purple gradient orb is SLOP #3. Real alternatives:

- **Material texture** — paper grain, concrete, linen, brushed metal, at 3–8%
  opacity over a flat field. One tile, tiny file, enormous effect.
- **Print artefacts** — halftone, risograph misregistration, scan noise, ink
  bleed. Condition: editorial, music, events. Wrong on anything clinical.
- **Real shadow from a real light** — one consistent light direction across the
  whole route, shadows tinted with the background hue rather than black.
- **Layered opaque planes** — overlapping solid shapes with hard edges and no
  blur, offset a few percent.
- **Photographic ground** — a heavily darkened or blurred photograph of the
  actual subject as the field. The atmosphere comes from something real.
- **Type as texture** — oversized, low-contrast, cropped lettering behind
  content.

## 6. Signature component, by product kind

The requirement most often missed, and it has twice been satisfied by a chart
about a product that was not data. Point it at the thing the route is about.

| Product | Signature that works | Not this |
|---|---|---|
| Shop / physical goods | the item itself, manipulable — rotate, zoom to material, swap finish, see it at scale next to a known object | a sales graph |
| Service / booking | the actual availability, slot, or route being chosen, rendered as the real thing | a stats panel |
| Developer tool | real terminal output, a diff, a live-editable config that shows its effect | a marketing card of the terminal |
| Publication | the reading surface — a live-set specimen, an annotated excerpt, an index of real pieces | an author bio grid |
| Data product | here a chart **is** correct — but the real one, on real data | a decorative chart |
| Clinic / care | the thing that reduces anxiety: wait time, what happens next, who you'll see | a hero video |
| Hardware | exploded view, spec overlay, scale comparison, material macro | a rotating logo |

Two bounds, both from real failures:

- It must **serve** the primary task, not compete with it. If the page sells
  something, the path to buying must not be the second most prominent thing.
- **Bound the degenerate cases.** An emphasis that scales the matching item
  looked great until one filter matched a single product, which then blew up
  while everything else collapsed. Design for one match and for all matches
  before shipping it.
