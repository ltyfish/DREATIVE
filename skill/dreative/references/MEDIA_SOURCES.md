# Asset discovery and production

Use this when the composition needs material. Find or make the material before
committing the focal layout. Asset acquisition and art direction are separate
jobs: an available file is not automatically the right photograph.

## Identify the shot before searching

Describe subject identity, view, light, background, crop, motion range, and use.
Distinguish an exact product image from contextual editorial imagery. A different
garment, machine, or finish must not be presented as the one being sold.

Start with supplied assets and the product's own authorized media. Then select
the most suitable route: licensed photography/footage, an existing model rendered
to the required view, commissioned/generated illustration, or authored graphics.
There is no universal medium ranking. Type, SVG, and procedural graphics can be
the intended art direction; an unconvincing invented physical product is a defect.

## Search in useful batches

Search the exact subject, its process/material/environment, and the desired shot
language. Inspect a contact sheet or search-result grid with labels instead of
opening dozens of files. Shortlist by identity, framing, usable dimensions,
continuity, and rights. Search a second source family if the first is unsuitable.
Stop when the planned shot has viable material; no candidate-count quota applies.

Use a working asset list if it helps: source page, local path, rights/credit,
exact-product or contextual role, crop, and derivative. Keep required attribution
with shipped assets. This is production information, not proof of good design.

## Source routing

These are starting points, not guaranteed endpoints or blanket licenses.
Check the current provider documentation and individual asset terms at use time.

| Need | Starting points | Verify |
|---|---|---|
| Actual product | Supplied files, brand press kit, approved product API | Exact variant and usage authorization |
| Photography and footage | Pexels, Unsplash, Pixabay, Coverr, Mixkit | API/access requirements, asset-specific terms, allowed use |
| Archival/object/scientific | Wikimedia Commons, Internet Archive, Met, Art Institute of Chicago, Cleveland, NASA | Item rights, attribution, third-party exclusions; scientific fit |
| Model / lighting / texture | Poly Haven, ambientCG, Sketchfab, supplied CAD/glTF | Search access versus download access, model license, materials included |
| Type and icons | Existing brand kit, Google Fonts, Fontshare, licensed foundries; Lucide/Phosphor/Tabler | Current license, required weights/scripts, project fit |
| Software material | Real product screenshots or recordings with authorized data | No invented features or exposed private information |

A search API being public does not establish that its downloads are public.
HTTP 200 can contain an error page: check body, content type, dimensions or media
probe output. Do not claim “no assets exist” from one failed endpoint.

## Browser research and scraping

Prefer official APIs and explicit download links for acquisition. Use a browser
for rendered galleries and motion references; HTML scraping cannot show pacing.
For a permitted public page, inspect actual img/currentSrc, srcset, video sources,
poster, and network media requests to locate assets. Use the original asset page
to establish rights; network visibility alone is not permission to reuse.

Bound concurrency, respect rate limits and access restrictions, cache successful
results locally, and stop repeating an endpoint returning access errors. Do not
bypass login/paywalls or assume a studio's visible imagery is reusable. Studying
an interaction and downloading its proprietary assets are separate actions.

## Making assets

Generation is a first-class production route, including generation-first when
the required world, shot, or coherent set is unlikely to exist. It does not need
to wait for sourcing to fail. Compare expected visual fit and total cost:
search/access, generation retries, editing, integration, and delivery weight.

Distinguish real inventory from a fictional concept. For a fictional brand or
prototype, create coherent concept product images and identify their conceptual
status where relevant; do not replace useful product views with abstract swatches
merely because the products do not exist. For real inventory, preserve verified
identity, construction, and variant details. A contextual image is not a product
photograph, and a disclosure does not make an unrelated hero suitable for a buy view.

Use a generation tool when available and appropriate; probe actual capabilities
before proposing a service. Ask only for missing authorization or required input.
For product fidelity, use the supplied image as an edit/reference rather than
generating a lookalike and claiming it is the product.

A useful generation brief specifies:
subject/reference identity; camera and lens/view; composition with copy space;
lighting/material; background; output aspect/size/alpha; permitted changes.
Generate a contact sheet or one decisive shot first if that can resolve the choice.
For a set, hold camera, light, background, and subject identity constant; inspect
consistency before paying for more. Independently generated stills are not a
reliable frame sequence. For continuous motion use video generation with verified
identity, supplied footage, or a deterministic render.

Choose the smallest production experiment that resolves the uncertainty. A
strong still may support masking, depth, pixelation, collage, and responsive
framing. For a generated clip, resolve its subject and endpoint composition
before extending the shot; inspect intermediate frames for morphing, lighting
jumps, and a usable ending. For exact camera paths or repeatable object motion,
a render can be more controllable than repeated video generation. Keep text and
interactive controls live in the interface. Consult `CREATIVE_RESOURCES.md` only
when a specific authoring or reference capability is missing.

For a licensed model, inspect silhouette, UVs, materials, scale, and animation
before planning a turntable. Light intentionally with an environment or studio
rig; neither is inherently superior. Produce the real required shot first.
For graphics and diagrams, author them directly where that is the desired style.

If generation is unavailable, name the capability gap and a concrete sourced or
authored alternative. Never describe a prompt as a generated asset.

## Work the set only where it improves the image

Decide crop and focal point together with the layout. Match a visibly inconsistent
set through selective grading, background treatment, crop, or composition.
Preserve originals. An already coherent approved photograph needs no compulsory
filter or byte change. Keep accurate product colors when color is a buying decision.

Separate production optimization (resize/encode) from artistic treatment
(masking, framing, grading, compositing, pixelation, depth, motion). Neither
proves the other happened. Inspect the treated set at its actual desktop/mobile
size, including the focal subject and the background behind text.

Probe tools: ffmpeg/ffprobe for footage, Blender for model renders, Sharp or
ImageMagick for derivatives. On Windows use `magick`, not the filesystem
utility `convert`. Do not assume an example render script exists: author it
against the actual model and inspect its first output.

Keep large originals out of the client bundle; emit responsive derivatives,
explicit sequence manifests, posters, and meaningful failure/reduced-motion
forms. Read `MOTION_MATERIAL.md` for video/sequence/depth production.
