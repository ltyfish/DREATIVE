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

## Look at forty, not four

A person doing this by hand rejects thirty images in about two minutes. They
glance, they discard, and the page they end up with is made almost entirely out
of the ones they threw away. Their ratio of looked-at to shipped is something
like fifty to one, and that ratio *is* the taste — not the rules they follow.

For you, opening a file is the expensive operation, so the honest default drifts
the other way: take the first licence-clean result that plausibly matches, and
move on. That is how a route ships fifty images from two domains and ten
credits, how the same picture ends up holding four sections, and how a clip of
the wrong mechanism lands in the focal seat — not because anything was
misjudged, but because nothing was ever laid beside an alternative.

So batch the looking. Search wide first — several queries across several
sources, because a sheet drawn from one domain teaches you nothing — download
the candidates flat and numbered, tile them into one image, and read that.
Thirty rejections for the cost of one look.

```bash
# 36 candidates -> one contact sheet, tiles in row-major order, so tile n is file n
ffmpeg -y -i .scratch/cand/%03d.jpg   -filter_complex "scale=320:180:force_original_aspect_ratio=increase,crop=320:180,tile=6x6"   -frames:v 1 .scratch/sheet-01.png

# a clip becomes a candidate by giving up one frame first
ffmpeg -y -ss 2 -i .scratch/clips/007.webm -frames:v 1 .scratch/cand/007.jpg
```

What you are reading off the sheet is not "which is licensed" — it is which
three or four are *keepers*: the subject is actually the thing the copy
describes, the light is doing something, the crop you need survives, and enough
of them share a world to be gradeable into one set. Discarding thirty-two of
thirty-six is the expected outcome, not waste. If nothing on the sheet is a
keeper, that is a real answer too, and it arrives before a section was built
around a picture that could not carry it.

**The keepers leave the sheet already treated, in one pass.** A wide search
hands you a wider set of *strangers*: twenty-four credits from four archives,
each frame correct on its own and none of them lit, graded or cropped like any
of the others. That page reads exactly as a reader describes it — *"the images
look off, I am not sure what I am looking at"* — and it is not a sourcing
failure, it is the missing pass afterwards. So grade the keepers toward one
temperature and one contrast, settle on one crop family, and produce the web
derivatives in the same command, before a single section references any of them.
*Sourced material arrives mismatched* has the recipes. Treatment is not a polish
step at the end of the build; it is what turns a set of finds into a shoot, and
skipping it wastes the search that just paid for it.

The sheet is also where a wrong subject dies. A movement of the wrong
construction, a different model of the product, someone else's machine — each is
plainly wrong beside five right ones and completely invisible on its own. Judge
the material against the copy here, in a batch, rather than one file at a time
after the section already exists.

## Prebuilt motion, and where it belongs

A great deal has already been animated, rigged, or modelled by someone else, and
some of it is free and good. Checked 2026-08-30 with plain `curl`:

- **glTF Sample Assets** —
  `raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/model-index.json`.
  A machine-readable index of well-made, properly licensed models. Real
  geometry, real materials, and the fastest route to something spatial on disk.
- **Sketchfab, downloadable only** —
  `api.sketchfab.com/v3/search?type=models&downloadable=true&q=…`. Keyless
  search. Filter to CC licences and check each model's own terms; downloadable
  is not the same as freely licensed.
- **Poly Pizza** — `poly.pizza`. CC0 and CC BY low-poly models, keyless.
  Stylised by nature, which is a look, not a substitute for a real object.
- **three.js examples** — `threejs.org/examples/`. Not assets: working
  implementations of mechanisms, MIT licensed, and the fastest way to see
  whether an effect is worth building. `REFERENCE_ADOPTION.md` governs taking
  from them.
- **Open repositories generally.** Shader collections, effect implementations,
  demo source. Read the licence in the repository, not on the demo page.
- **LottieFiles** refuses plain `curl` (403). Their free animations are usable
  but need a browser or an authenticated fetch; ask the user rather than
  scraping around it.

One line about all of this, and it matters more than the list: **prebuilt motion
is notation and interface material, not the focal subject.** A vector loop is
excellent for a mark, a loader, an icon, a diagram that explains a process. It
is the same defect as a drawn prop the moment it stands in for the physical
thing the page is selling — see the ladder below, and `../exemplars/SLOP.md` #10.
A downloaded model of *your product* is rung 2 and is exactly right; a downloaded
animation of a generic version of your product is rung 4 wearing motion.

## The ladder, and what drawing is actually for

Anything the user already has outranks the whole ladder. Their photographs,
their footage, their renders, their press kit — supplied material is truthful by
definition, costs nothing to obtain, and is the one source that cannot be wrong
about the subject. Ask for it before searching for a substitute, and ask again
when the search is going badly.

Otherwise rank the material before choosing a form, and take the highest rung the
subject and the licence allow:

1. **A photograph of the thing, or of its real analogue** — including a set of
   views, or footage of it, which is motion material rather than an
   illustration. A clip is the same rung as a still and often the easier one to
   obtain for anything that moves, runs, pours, folds, or is used by a person.
2. **A licensed model, or frames rendered from one.** Keyless and verified
   sources for both are listed above; for a physical product this rung is
   usually right and is rarely the one chosen. It is also the rung that fixes a
   bad archive: your framing, your light, a guaranteed-continuous set, any
   resolution — see *A real photograph is not automatically a good one*.
3. **Real surface material** — a photographed or scanned texture, a PBR set, an
   HDRI. Poly Haven and ambientCG are CC0 and need no key.
4. **Drawn construction** — CSS, SVG, canvas geometry standing in for a physical
   thing. This is the fallback. Reaching it means rungs 1–3 were searched and
   came back empty, and that is a sentence you should be able to write.

The rungs are not interchangeable, and the reason is physical. Real material
carries texture, grain, depth of field, the way light falls across a surface and
changes as it moves. Drawn geometry carries none of that: flat fills, invented
colour, edges that are too clean, gradients standing in for light. That is what
"cheap" and "unreal" mean when a reviewer says them — not that the drawing was
badly made, but that nothing in it was ever lit or photographed. Adding more
paths does not fix it, and a build made mostly of authored vector reads that way
however good each piece is.

It also costs the page its motion. Material is what there is to animate: a
sequence to scrub, a surface to relight, a crop to travel through, depth to
displace, a real state to trade for another. A flat vector gives you position,
scale and opacity — which is why routes built out of it come back described as
having no transitions and nothing happening between sections, however many
elements move.

**Drawing is for notation, and it is good at that job.** Diagrams, callouts,
annotation and measurement over a photograph, charts, icons, marks, typographic
and graphic devices — none of these are pretending to be material, and there is
no limit on them. Icons in particular are the most reliable visual material
available to you (see *Icons*). The line is not vector versus raster, it is
whether the drawn thing is standing in for something physical that exists in the
world and could have been sourced.

**When you do land on rung 4**, say so rather than shipping it as if it were a
choice, and make the fallback carry real material where it can: a photographed
texture as the fill, real colour sampled from the subject rather than invented,
one honest flat treatment instead of a fake-dimensional one. A drawn thing that
admits it is drawn is far better than one that fails at looking real. And it
does not take the focal moment on its own — see *Where it lands is the same
decision*.

## Decide what the material does, while you are still searching

Sourced, resized, credited — and then sitting in an `<img>` doing nothing, while
the page's motion is a fade applied to a `querySelectorAll` list. Six
photographs treated that way are six decorations. One photograph that carries
the explanation is the page.

Decide this here rather than after the search, because it changes what you look
for. Twelve views of one subject are motion material; one view is an
illustration. A set you cannot assemble is a form you cannot choose, and finding
that out after the section is written is how a route ends up fading rectangles.

What you have decides what is reachable, and nothing here is a default. A
coherent set of views of one object can be scrubbed. A single photograph can be
crossed, cropped along a path, displaced by depth, held while the frame moves
through it, masked into type, split and reassembled, or lit differently as a
section progresses. A clip can be sampled, slowed, or windowed. Two real states
can trade places. The right answer is usually specific to the subject — what
this thing does when it runs, what a buyer is trying to see, what is worth
holding still while everything else moves.

Those are the obvious ones, which means the good answer is often not among them.
The list is evidence the space is wide, not a menu. What separates craft from
effect is that the material is real and the form was chosen for this subject.

**Material availability fails more often than tooling.** A scrubbed sequence
needs a coherent set of views *of the same object*, and for a one-off subject
that set often cannot be sourced — what exists is a few real photographs of
related things. That is where the form changes, not where the subject gets
constructed: drive one photograph instead of scrubbing thirty.

### One subject, or a different form

A set only reads as one thing if it is one thing. Six photographs of six
different objects, indexed one per stage, do not become a sequence by being
placed in the same slot and swapped on scroll — they become a slideshow of
strangers, and the reader sees that immediately even when each individual
photograph is real, licensed and well shot. The same applies across variants: a
different object per finish, per colourway, per plan tier says the variants are
unrelated products.

This is the failure that survives every check, because sourcing succeeded.
Real material, correct credits, an authored progress value, a working index —
and a page a reviewer calls depressing, because nothing on it is ever the same
thing twice.

**Tell:** the stages differ in era, machine, lighting and finish rather than in
state; a caption has to say *reference photograph* or *similar to*; the subject
changes size and orientation between adjacent steps; the page never shows the
product twice.

So before the section is written, check the set for continuity, not just for
count: same subject, same or compatible lighting, a state that actually
progresses from one item to the next. Sourcing twelve views of one movement is
worth far more than one view each of twelve movements.

**When continuity cannot be sourced, the form changes — the slots do not get
filled anyway.** Drive one photograph through the whole passage and let type,
annotation and crop carry the stages over it. Hold one real image and move the
frame through it. Trade two real states of one subject. Or drop the indexed
form entirely and present the pieces as what they are — a plate of references,
sized and captioned as reference, with the section's argument carried by
notation drawn over them. All four are honest. An index into unrelated material
is the one option that is not.

### Where it lands is the same decision

A photograph in a secondary slot, under a section whose focal element you drew,
is a page made of drawings with photographs attached. That is what "it's all
SVG" means when a reviewer says it about a build that sourced five real images:
not that the sourcing failed, but that the sourced material never got the
position that the eye actually goes to.

So place it before you fill around it. The real material takes the focal moment
of the section it belongs to, at a size and crop where its subject can be read —
and if what you are drawing would outrank it, the two are the wrong way round.
Check it on the rendered page, not in the markup: at the first screenshot, name
what the eye lands on in each section and whether that thing is real. A crop
that reads at 1440 and loses the subject at 390 is decoration on a phone.

The failure has a reliable tell: an authored figure sitting where the section's
argument is, with the sourced set relegated to a strip, a card grid, or a
below-fold gallery. Drawn material is a companion to real material — the
diagram, the callout, the annotation over the photograph — and it is very good
at that job. It just does not get the seat.

### The mechanism is one engine

Preload, one authored value, one index into material, redraw only on change —
the same whether the index picks a frame, a crop, a depth offset, a mask
position, or a blend between two real states.

```js
const imgs = manifest.map(src => Object.assign(new Image(), { src }));
await Promise.all(imgs.map(i => i.decode().catch(() => {})));

function onProgress(p) {                    // p is 0..1 for the section
  const i = Math.min(imgs.length - 1, Math.round(p * (imgs.length - 1)));
  if (i !== current) { current = i; ctx.drawImage(imgs[i], 0, 0, w, h); }
}
```

`p` is any authored value, and its source is a design decision too: scroll
position, a click-advanced step, a drag, a timer, playback time. A section the
reader controls reads differently from one that runs at them. Drive it from the
same value as everything else in the section — `../skills/motion.md` on why
independent triggers drift. Reduced motion gets one authored still, not a
switched-off section; mobile gets the shorter set or the still, deliberately.

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

## A real photograph is not automatically a good one

The ladder ranks material by kind. It says nothing about quality, and the
keyless sources skew hard toward one kind of picture: the **record shot** — an
object photographed to document that it exists, flat-lit or on-camera-flashed,
centred, everything equally sharp, shot by a curator or a hobbyist against
whatever was behind it. That is the right photograph for a catalogue and the
wrong one for a page, and a build that only checks the licence ships a page of
them. It reads exactly as it is: real, truthful, and nobody's best work.

What separates a photograph you can build on:

- **The light is doing something.** A direction, a falloff, a highlight that
  travels along an edge. Flat frontal light kills every surface it touches, and
  no amount of grading puts it back.
- **The subject separates from its ground.** Depth of field, tonal contrast, or
  a considered background — not the object lost in a field of similar clutter.
- **The sharpness is where the meaning is**, not spread evenly across the frame.
- **It survives your crop.** Find the crop you actually need first, then check
  resolution and framing *there*. A 3000px file whose subject occupies 400px is
  a 400px photograph.
- **It is not the frame everyone else found.** The top result for the obvious
  query is on a hundred other pages.

Judge these by opening the file and looking at it, at the size the page will use.
A thumbnail in a search result and a licence line are not an inspection, and this
is the step most often skipped between finding an image and shipping it.

**When the archive only has record shots — and for most specific products, that
is what it has — make the photograph instead of settling for one.** This is
rung 2 and it is still the least chosen rung, which is odd, because it is the
one that hands you everything the archives cannot: your own framing, your own
light, a set that is guaranteed continuous, any resolution you want, and no
attribution obligation travelling into the page.

```bash
# a licensed CC model, lit by a real HDRI, rendered to exactly the views you need
# (api.sketchfab.com/v3/search for the model; polyhaven.com for the HDRI)
blender -b subject.blend -P shoot.py -- --hdri studio.hdr --views 48 --out frames/
```

A model you found, lit properly and rendered to your own frames, outranks a
sharper photograph of a different object every time — it is the same subject in
every frame, in the light you chose. Three-point lights and a grey background
give it away instantly; a real HDRI is the whole difference, and Poly Haven's are
CC0. The same logic covers a product's own press kit, a maker's build log, a
museum's high-resolution download of the actual object, and photographing or
screen-recording the thing yourself where that is possible. Generated frames of
the real thing beat sourced frames of a different thing, and made frames of the
real thing beat record shots of it.

## Video, keyless and verified

Checked 2026-08-30 with plain `curl`. Footage follows exactly the order the
ladder already sets: **supplied by the user first**, then sourced, then
generated, then fabricated — and sourcing is where most of the value is, because
a real five-second clip of the actual subject beats anything constructed to
imply one. The web's best-looking pages lean on video heavily, and the usual
reason a build reaches for a pinned CSS sequence instead is that it never
searched for the clip.

- **NASA image and video library** — `images-api.nasa.gov/search?q=…&media_type=video`.
  Public domain, no key, genuinely cinematic material: launches, orbital
  footage, wind tunnels, labs, hardware being built. Returns real asset URLs.
- **Internet Archive** — `archive.org/advancedsearch.php`, and collections like
  Prelinger for public-domain film. Enormous, uneven, rights from public domain
  to fully reserved. Never assume; check the item.
- **Wikimedia Commons** — search namespace 6 with `filemime:video/webm`
  (`action=query&list=search&srsearch=filemime:video/webm <subject>&srnamespace=6`).
  CC and public-domain clips, often the only free footage of a specific machine,
  process, or place. Share-alike obligations travel into your page. Send a real
  `User-Agent`.
- **Coverr** and **Mixkit** — keyless HTML search, free for commercial use
  without attribution; redistributing the clips as stock is not permitted.
  Well-shot and well-graded, and the fastest route to atmosphere. They are also
  the most seen footage on the web, so treat them the way you treat stock
  photography: crop, grade, slow, window, or cut them into something that is
  not the frame everyone else used.
- **The subject's own footage.** A manufacturer's press kit, a maker's build
  log, a lab's process reel, a factory tour — licence permitting, this is the
  clip that is actually about your product, and it is the one nobody looks for.
  Do not lift from platforms whose terms forbid it; ask the user instead.
- **Record it yourself.** For software, a screen capture of the real product is
  the truest footage there is and needs no licence at all. The same applies to
  anything on the user's desk.

**Pexels and Pixabay video need an API key** you do not have, exactly as their
photography does. Their HTML search pages load, but treat a keyless scrape as
unreliable rather than as a source, and raise the missing key as a capability
gap — never as a reason to invent the subject.

**Generated footage is the rung below sourcing, and it is not free.** It is
worth it when the shot cannot exist otherwise; it is not worth it as a shortcut
past a search you did not run. Generated frames of the real thing still beat
sourced frames of a different thing.

Cutting, retiming, and producing web derivatives is the same work as the rest of
this file, and `MOTION_MATERIAL.md`'s pipelines cover it — including the choice
that matters most: a clip you intend to *scrub* is usually better shipped as a
frame sequence than as a video the browser has to seek. Ship muted, `playsinline`,
with a real poster, a mobile encode, and an authored still for reduced motion.
A video that autoplays with sound, arrives at 12MB, or loops behind text it makes
unreadable is a defect however good the footage is.

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

Optimisation, baking and fallback sequences are *Producing the files*, below.

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
  it changes what you search for — see *Decide what the material does*, above.

This holds hardest where it is most tempting: the small tile, the swatch, the
thumbnail in a card. Small does not mean it can be drawn. Where no material
exists and none can be sourced, say so and choose a form that does not need it —
a named description, a detail crop of the shared subject, a typographic
treatment. Naming the gap is a real answer; drawing over it is not.

A drawn schematic is a companion to real material, never a substitute for it.
Calling the output a diagram does not settle the question — the build that
sourced four real movement photographs, looked at them, deleted them, and
shipped a drawn plate labelled "a technical schematic, not a photograph" made
exactly the decision this section exists to prevent, and had a defensible
argument for it. If the analogue is photographable and you drew instead, that is
the failure, whatever the drawing is called. Draw the diagram as well, once the
real material is on the page.

## Sourced material arrives mismatched

Material found in the world was lit by different people on different days. Put
four such images on one page untouched and they read as stock even though every
one of them is real: warm brass next to cold steel, a black studio sweep next to
a grey museum table, one subject filling the frame and the next lost in it. The
page then has a palette and the images have their own, and the eye reads the
difference as cheapness.

Processing them into one image system is part of the material work, not a
finishing pass. What that usually means:

- **One light and one grade.** Match black point and white point across the set,
  then push them toward a common temperature — or commit to a duotone or a
  single-channel treatment keyed to the page's palette, which reconciles
  anything and is often the stronger answer for mixed archival sources.
- **One subject scale and one crop discipline.** Decide how much of the frame
  the subject occupies and hold it across the set. Crop to the same aspect
  family. A tighter crop of the same photograph is usually more use than the
  whole of it.
- **Grain, halation, a paper or screen substrate, a consistent vignette** —
  applied to the set rather than to one image, these make separately sourced
  material read as one shoot.
- **Composite rather than place.** Two sources cut together, a subject lifted
  onto the page's own ground, one image masked into type, a channel of one
  driving the displacement of another. Canvas and WebGL are for this as much as
  for motion; a shader that grades and displaces a still is a page's whole look.

Do it as a build step over the files on disk, so the treated set is what ships
and the pipeline is repeatable:

```bash
# grade toward one temperature and one contrast, then duotone the set
magick source/*.jpg -auto-level -modulate 100,88,102 -set filename:f "%t" public/media/%[filename:f].webp
magick public/media/plate.webp \( +clone -colorspace gray \) -delete 0 \
  -level 4%,96% +level-colors "#0b0a08","#e8dccb" public/media/plate-duo.webp

# fixed subject scale and one aspect family across a set
magick source/stage-3.jpg -resize 2000x2000^ -gravity center -extent 1600x1000 public/media/stage-3.webp

# grain and a soft halation, applied to the whole set, not one image
magick public/media/stage-3.webp \( +clone -blur 0x18 -evaluate multiply 0.35 \) \
  -compose screen -composite -attenuate 0.5 +noise Gaussian public/media/stage-3-fin.webp
```

`sharp` covers the same ground when ImageMagick is absent (`.normalise()`,
`.tint()`, `.linear()`, `.composite()`); a canvas pass at build time or a
fragment shader at runtime covers what neither can. Keep the untreated
originals and the licence record, and check the treated set together at one
size before it goes anywhere near the page.

## Producing the files

Probe before assuming, in either direction. **On Windows `convert` is the
filesystem utility, not ImageMagick** — it answers `command -v` and then does
something unrelated. Probe `magick`.

```bash
command -v blender ffmpeg cwebp magick
node -e "try{require.resolve('sharp');console.log('sharp ok')}catch{console.log('no sharp')}"
```

`sharp` installs from npm everywhere it has been tried; `ffmpeg` is common but
not universal. A decode or a render is the branch you take *after* a positive
probe. On a negative probe, recommend the install in one line rather than
working around it silently, then carry on with the photographic route in the
same session — do not block on the answer.

```js
import sharp from "sharp";
for (const width of [640, 1280, 1920]) {
  await sharp("source/product.png")
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 58 })
    .toFile(`public/media/product-${width}.avif`);
}
```

```bash
ffmpeg -i source/film.mov -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/media/film.webm
ffmpeg -i source/film.mov -vf "thumbnail,scale=1600:-2" -frames:v 1 public/media/film-poster.jpg
ffmpeg -i source/turntable.mov -vf "fps=12,scale=1280:-2" public/media/seq/frame-%04d.webp
blender -b movement.blend -P turntable.py -- --frames 36 --out frames/
```

Keep originals outside the client bundle, preserve the licence record, verify
crops at desktop and 390px, and add a WebP/JPEG fallback where the browser
matrix needs one. A frame set is a hero-sized payload: emit a 640px derivative
and a half-length mobile set from the same pass, write an explicit manifest, and
check first, middle, and last frame by eye. Never run an unbounded sequence.
Transparent video needs an opaque poster before you rely on alpha support.

Depth, normal, and displacement maps come from licensed project material and
stay linear where the shader expects data rather than colour; check banding at
the real crop.

**Model to glTF:** strip hidden geometry and unused materials, apply transforms
with an intentional origin and real-world scale, bake what need not stay
dynamic, export only required animations, run a validator and an optimizer
(`gltf-transform`, `gltfpack`) when available, measure decoded texture memory
and draw calls on a real phone, and produce a poster or frame-sequence fallback
from the same camera. That fallback preserves the product view, not a gradient.

Record durable asset paths and roles in `.dreative/context.json`, and delete
intermediate exports from the shipped bundle. Validating dimensions, format,
missing-asset behaviour, mobile selection and loading order is mechanical, and
a drawn stand-in passes every one of those checks — so check the material too.
Before shipping any drawn surface, list what is already in the asset directory:
the usual version of this failure is a build that sourced the right photograph,
resized it, and then drew the tile by hand anyway.

## When nothing fits

Say so. Name the exact capability gap, recommend one concrete route to it — a
specific source, a tool, a supplied asset, a commissioned frame — and let the
user decide. Do not silently substitute geometry for a subject that needed a
photograph, and do not describe fabricated imagery as sourced. Stating what was
actually available is always better than a confident invention.
