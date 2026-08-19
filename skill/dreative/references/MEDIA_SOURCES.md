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

## Reachable without a key

Ranked by quality this file puts photography first, but a headless build can
only take what it can fetch, so the ladder gets traversed by reachability
instead — and on 2026-08-19 that silently cost a page its hero. Checked that
day, no key, plain `curl`:

| Source | Keyless | Note |
|---|---|---|
| Openverse | yes | searches Flickr, Wikimedia, and museum sets at once |
| Wikimedia Commons | yes | `w/api.php`, uneven, check the per-file licence |
| The Met | yes | `collectionapi.metmuseum.org`, follow the redirect |
| Poly Haven | yes | `api.polyhaven.com` — HDRIs, textures, **models** |
| ambientCG | yes | `ambientcg.com/api/v2` |
| **Unsplash** | **no** | `401`, key required |
| **Pexels** | **no** | key required — and it answers **HTTP 200 with a 401 body**, so a status-code check calls it reachable and the empty result reads as "nothing exists" |
| Smithsonian, Library of Congress, Rijksmuseum | no | `403`/`403`/`410`; the Rijksmuseum endpoint is retired |

Do not conclude that a subject has no imagery because the first two entries
under *Photography* returned nothing — they are the two that need a key. Search
the keyless set before concluding anything, and note that Poly Haven and the Met
are keyless, which makes a licensed model or a museum object often the *easiest*
material to get rather than the hardest.

If the best material genuinely sits behind a key, that is a capability gap to
name for the user, exactly as in *When nothing fits*. It is never a reason to
fabricate the subject.

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

This section used to open with a warning against icons. That warning was wrong,
and it was costing rounds. On 2026-08-16 blind review named the *absence* of
icons and visual marks as the worst thing about the build, for the second round
running, while both builds carried zero icons. The warning was being obeyed.

The slop is not the icon. The slop is the uniform grid of one-icon-per-rounded-
card, every icon the same size, weight, and colour, each one restating the
heading beside it — `exemplars/SLOP.md` #4. An icon that does a job a word does
worse is craft, and text-heavy routes need those jobs done: marking the type of
a thing in a list, distinguishing rows a reader is scanning, anchoring a step in
a sequence, standing in for a state.

**Lucide** (ISC), **Heroicons**, **Phosphor**, and **Tabler** (MIT) are all
permissively licensed and well-drawn; installing one is a package, not a hunt,
which makes it the most reliable visual material available to you. Take a set
for the generic remainder and draw the two or three marks that are actually
about your product. Vary size and weight by role rather than shipping one
uniform tray of them.

## When the subject itself cannot be photographed

The common case, and the one that produces the worst pages: the product is new,
unreleased, fictional, or yours alone, so no photograph of *it* exists anywhere.
Searching for it returns the surrounding world and not the thing. A build that
treats this as "sourcing failed" falls back to constructing the subject out of
SVG and gradients, which blind review has now named as the worst thing on the
page twice — *"it looks like it creates it self"*.

Sourcing did not fail. You searched for the wrong noun.

- **Source the real analogue, not the fiction.** No photograph exists of your
  calibre; thousands exist of real movements, benches, loupes, jewels, and
  swarf, and they are true material rather than a fabricated claim about your
  product. The same move works everywhere: the process, the material, the
  domain, the environment, the hands doing the work.
- **Source a licensed model rather than modelling the object.** For a physical
  subject this is usually right and rarely chosen — `../skills/3d.md` ranks it
  first for that reason.
- **Take a set, not a picture.** Twelve frames of one subject are motion
  material; one frame is an illustration. Decide this while searching, because
  it changes what you search for — see `ASSET_PIPELINES.md`.

Construction is still correct for anything not pretending to be a photograph:
schematics, diagrams, data objects, abstract form. The defect is never that
geometry was drawn. It is geometry drawn to read as a real object, that fails to.

## When nothing fits

Say so. Name the exact capability gap, recommend one concrete route to it — a
specific source, a tool, a supplied asset, a commissioned frame — and let the
user decide. Do not silently substitute geometry for a subject that needed a
photograph, and do not describe fabricated imagery as sourced. Stating what was
actually available is always better than a confident invention.
