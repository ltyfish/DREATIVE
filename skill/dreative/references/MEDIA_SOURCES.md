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

## The open web is the source; this file is a shortlist

Nothing here is a whitelist. You can fetch any page and any file on the open
internet, and the right image is often on a manufacturer's press kit, a
university department page, a museum's own site, a maker's build log, or a
photographer's portfolio — none of which have an API. The list below exists
because these are *reliable* entry points with clear licences, not because they
are the only permitted ones.

The constraint on taking something is the licence and the truthfulness of the
subject, never whether it arrived through an API. What you may not do is fetch
something with unclear rights and ship it anyway, or invent the subject because
searching two endpoints came back empty.

## Photography, keyless and verified

Checked 2026-08-19 with plain `curl`, no key, real results returned.

- **Openverse** — `api.openverse.org`. The first stop for photography: searches
  CC-licensed and public-domain work across Flickr, Wikimedia, and museum
  collections at once. Filter by licence, then verify on the source record.
- **Flickr Creative Commons search** — no key needed for the HTML search; filter
  to the commercial-use licences. Deeper and far less generic than stock, and
  strong on exactly the amateur macro and process photography that stock is weak
  on.
- **Wikimedia Commons** — `commons.wikimedia.org/w/api.php`, and files fetch
  directly from `upload.wikimedia.org`. Enormous and uneven. Many files are
  CC BY-SA, which is share-alike and requires attribution; that obligation
  travels into your page. Send a real `User-Agent` or it will refuse you.
- **Internet Archive** — `archive.org/advancedsearch.php`. Everything and
  anything, rights from public domain to fully reserved. Never assume.

Stock-library aesthetics are a convergence risk wherever you find them — crop
hard, grade deliberately, and avoid the frames popular enough to feel familiar.

## Sources that need a key you do not have

**Unsplash** (`401`) and **Pexels** both require an API key. They hold the widest
general photography set, so their absence is a real gap and not a judgement
about their quality.

**Pexels answers HTTP 200 with a 401 body.** A status-code check calls it
reachable and its empty result then reads as *"this subject has no imagery"* —
which is how a page ends up with a fabricated hero. Read the body, not the code.

If photography is what the route needs and the keyless set cannot supply it, say
so and ask the user whether they have an Unsplash or Pexels key, exactly as in
*When nothing fits*. A missing key is a capability gap to raise, never a reason
to invent the subject.


## Archives and museums, keyless and verified

Slower to search and far more distinctive. This is where a page stops looking
like everyone else's page. Best for editorial, heritage, scientific, material,
process, and *object* subjects — and because these are keyless while stock
photography is not, a museum object is often the easiest real material to get
rather than the hardest.

All checked 2026-08-19, no key, real results returned.

- **The Met** — `collectionapi.metmuseum.org`, CC0 for its public-domain works.
  Excellent for texture, textile, ceramic, metalwork, instruments, and printed
  matter. Follow the redirect.
- **Art Institute of Chicago** — `api.artic.edu`, generous public-domain set with
  high-quality IIIF imagery.
- **Cleveland Museum of Art** — `openaccess-api.clevelandart.org`, CC0 open
  access, strong on objects and craft.
- **Wellcome Collection** — `api.wellcomecollection.org`, scientific, medical,
  and technical illustration and photography, mostly CC.
- **NASA image library** — `images-api.nasa.gov`. Generally free to use but must
  not imply endorsement, and third-party material inside NASA pages is
  separately restricted.

Licences here range from CC0 to "no known restrictions" to genuinely restricted.
Check the individual record, not the collection.

Removed 2026-08-19 because they no longer answer without a key: Smithsonian Open
Access (`403`), Library of Congress (`403`), Rijksmuseum (`410`, endpoint
retired). Their collections are still worth browsing by hand on the open web —
they are just not routes a build can rely on unattended.


## Government and scientific

Generally public domain in the US, and often the only truthful source for
technical or environmental subjects. Browsed on the open web rather than through
an API — see the note at the top of this file; none of these need one.

- **NOAA**, **USGS**, **USDA** — climate, terrain, agriculture, materials.
- **ESA** and other national agencies use their own terms; check rather than
  assuming they match NASA.


## Texture, HDRI, and 3D — keyless and verified

All checked 2026-08-19, no key, real results returned. **This whole tier is
keyless while stock photography is not**, which is worth knowing before you
conclude that a real object is out of reach.

- **Poly Haven** — `api.polyhaven.com`. CC0 HDRIs, PBR textures, and models. The
  default answer for lighting a real 3D subject.
- **ambientCG** — `ambientcg.com/api/v2`. CC0 materials and textures, strong on
  surfaces.
- **Sketchfab** — `api.sketchfab.com/v3/search`, searchable without a key; filter
  to downloadable CC licences and verify per model. Licensed models often beat
  procedural geometry for realistic physical subjects, which is the case the
  contract asks you to evaluate.

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

A drawn schematic is a companion to real material, never a substitute for it.
Calling the output a diagram does not settle the question — the build that
sourced four real movement photographs, looked at them, deleted them, and
shipped a drawn plate labelled "a technical schematic, not a photograph" made
exactly the decision this section exists to prevent, and had a defensible
argument for it. If the analogue is photographable and you drew instead, that is
the failure, whatever the drawing is called. Draw the diagram as well, once the
real material is on the page.

## When nothing fits

Say so. Name the exact capability gap, recommend one concrete route to it — a
specific source, a tool, a supplied asset, a commissioned frame — and let the
user decide. Do not silently substitute geometry for a subject that needed a
photograph, and do not describe fabricated imagery as sourced. Stating what was
actually available is always better than a confident invention.
