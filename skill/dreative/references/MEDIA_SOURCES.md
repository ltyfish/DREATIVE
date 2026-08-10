# Media sources

Where to get a real image, texture, model, or typeface when the product needs
one. This is a router, not a library: it holds no bundled assets, because
shipped media goes stale, carries rights that change, and makes every project
using it converge on the same look — the failure `exemplars/README.md` exists to
avoid.

Read this **before** fabricating a realistic subject out of CSS, SVG, or gradient
geometry. Blind review has named invented product imagery as the worst thing on
an otherwise strong page more often than any other single defect. Procedural
fabrication is a legitimate choice when it is genuinely the better image; it is
not a legitimate default because sourcing felt like more work.

## Before you take anything

Confirm three things and record them in the asset commitment:

1. **The licence covers your use.** Commercial use, modification, and
   redistribution are separate permissions. Aggregators mix licences per item —
   the site's terms are not the item's terms.
2. **The subject is truthful.** A stock photo of someone else's product on your
   product page is a fabricated claim, not a placeholder. Prefer material that
   is genuinely about this product, or imagery that is clearly atmospheric
   rather than evidential.
3. **You can attribute it if required.** Share-alike and attribution terms
   survive into the shipped page. If you cannot place the credit, pick a
   different source.

Record the real URL or file path, the licence, and the rights status. Final
smoke resolves local files and requests remote URLs, so an invented source fails
rather than passing quietly.

## Photography, blanket-licensed

Free for commercial use under the platform's own licence, no per-item check, no
attribution required. Common restriction: you may not sell the unaltered file or
rebuild a competing stock service.

- **Unsplash** — the widest general set. Strong on landscape, interiors,
  atmosphere, workspaces, food. Weak on specific manufactured products, which is
  exactly where fabrication tempts you.
- **Pexels** — overlapping catalogue, better on people and short video clips.
  Identifiable people carry the usual model-release limits: fine as atmosphere,
  risky implying endorsement.

Both skew toward a recognisable contemporary stock aesthetic. That aesthetic is
itself a convergence risk — crop hard, grade deliberately, and avoid the frames
that were popular enough to feel familiar.

## Archives and museums, public domain

Slower to search and far more distinctive. This is where a page stops looking
like everyone else's page. Best for editorial, heritage, scientific, material,
and process subjects.

- **Smithsonian Open Access** — millions of CC0 items across science, history,
  and design. Objects, specimens, and technical material.
- **The Metropolitan Museum Open Access** — CC0 for its public-domain works.
  Excellent for texture, textile, ceramic, and printed material.
- **Rijksmuseum** — very high-resolution public-domain scans, unusually good
  reproduction quality.
- **NYPL Digital Collections** and **Library of Congress** — maps, ephemera,
  photographs, printed matter. Rights vary per item and are stated per item.
- **Public Domain Review** — curated rather than comprehensive; useful when you
  want something with character and do not yet know what.

Licences here range from CC0 to "no known restrictions" to genuinely restricted.
Check the individual record, not the collection.

## Aggregators, mixed licences

- **Openverse** — searches CC-licensed and public-domain work across Flickr,
  Wikimedia, and museum collections in one place. Filter by licence, then verify
  on the source record.
- **Wikimedia Commons** — enormous and uneven. Many files are CC BY-SA, which is
  share-alike and requires attribution; that obligation travels into your page.
- **Internet Archive** — everything and anything, with rights ranging from public
  domain to fully reserved. Never assume.

## Government and scientific

Generally public domain in the US, and often the only truthful source for
technical or environmental subjects.

- **NASA** — imagery is generally free to use but must not imply endorsement,
  and some third-party material inside NASA pages is separately restricted.
- **NOAA**, **USGS**, **USDA** — climate, terrain, agriculture, materials.
- **ESA** and other national agencies use their own terms; check rather than
  assuming they match NASA.

## Texture, HDRI, and 3D

- **Poly Haven** — CC0 HDRIs, PBR textures, and models. The default answer for
  lighting a real 3D subject.
- **ambientCG** — CC0 materials and textures, strong on surfaces.
- **Sketchfab** — mixed; filter to downloadable CC licences and verify per model.
  Licensed models often beat procedural geometry for realistic physical subjects,
  which is the case the contract asks you to evaluate.

Route production work — optimisation, baking, fallback sequences — through
`ASSET_PIPELINES.md`.

## Type

Typeface choice carries more identity than almost anything else on the page, so
this is worth real time.

- **Google Fonts** — reliable, free, and *heavily* used. A default pairing here
  is a recognisable generated-frontend signal; see `exemplars/SLOP.md`.
- **Fontshare** — free for commercial use, more distinctive than the Google
  default set.
- **Velvetyne**, **Collletttttivo**, **Open Foundry** — libre type with genuine
  character. The right place to look when typographic voice is carrying the
  identity, which `exemplars/PRINCIPLES.md` notes is common when there is little
  imagery to work with.

Licensed commercial type is often the correct answer and is a legitimate
capability gap to raise with the user rather than route around.

## Icons

**Read this as a warning before a list.** A route built from one icon set looks
like every other route built from that set, and blind review has called out
icon-and-card pages as the generated-looking arm. Icons are a solved,
homogeneous category — which makes them the easy path and the convergent one.

When a set is genuinely right: **Lucide** (ISC), **Heroicons**, **Phosphor**, and
**Tabler** (MIT) are all permissively licensed and well-drawn. Prefer drawing the
two or three marks that are actually about your product and using a set for the
generic remainder, rather than the reverse.

## When nothing fits

Say so. Name the exact capability gap, recommend one concrete route to it — a
specific source, a tool, a supplied asset, a commissioned frame — and let the
user decide. Do not silently substitute geometry for a subject that needed a
photograph, and do not describe fabricated imagery as sourced. Stating what was
actually available is always better than a confident invention.
