# Asset production pipelines

Use offline work when it produces better fidelity, smaller runtime cost, or a
more reliable mobile fallback than live simulation. Never invent an available
tool. Confirm the executable, source assets, output rights, and target browser
support first.

## The subject is sourced, never manufactured

Everything below is production — resizing, encoding, packing, exporting. None of
it decides what is in the frame, and that decision is the one that fails. When a
page shows a physical thing, that thing arrives as real material: a photograph,
a frame, a scan, a render of an actual model. A gradient, a dot pattern, or a
stack of CSS layers standing in for a surface is not a cheaper version of the
material — it is a different, worse thing, and it reads that way at full size
next to a price.

This holds hardest exactly where it is most tempting: the small tile, the
swatch, the thumbnail in a card. Small does not mean it can be drawn. If a
sourced view of a variant exists, or can be sourced, the tile shows it. Whenever
no material for a surface exists and none can be sourced, say so and choose a
form that does not require it — a named description, a detail crop of the shared
subject, a typographic treatment — rather than inventing the surface. Naming the
gap is a real answer here; drawing over it is not.

## Responsive image set with Sharp

```js
import sharp from "sharp";

for (const width of [640, 1280, 1920]) {
  await sharp("source/product.png")
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 58 })
    .toFile(`public/media/product-${width}.avif`);
}
```

Keep the original outside the client bundle, preserve a licensed source record,
and verify crops at desktop and 390px. Generate a WebP/JPEG fallback when the
target browser matrix requires it.

## Poster, web video, and frame sequence with FFmpeg

```bash
ffmpeg -i source/film.mov -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/media/film.webm
ffmpeg -i source/film.mov -vf "thumbnail,scale=1600:-2" -frames:v 1 public/media/film-poster.jpg
ffmpeg -i source/turntable.mov -vf "fps=24,scale=1280:-2" public/media/turntable/frame-%04d.webp
```

Do not run an unbounded frame sequence. Generate an explicit manifest, verify
the first/middle/last frame, simulate a missing frame, and create smaller mobile
derivatives. For transparent video, provide a normal poster or opaque fallback
before relying on codec/alpha support.

## Sprite atlas and displacement material

Use Sharp to normalize frame dimensions and pack only when atlas lookup reduces
requests without creating an oversized first load. Generate displacement,
normal, or depth maps from licensed project material, keep them linear where the
shader expects data rather than color, and inspect banding at the real crop.

## Blender or supplied model to glTF

Before runtime integration:

1. Remove hidden geometry and unused materials.
2. Apply transforms and choose an intentional origin and real-world scale.
3. Bake lighting/detail that does not need to remain dynamic.
4. Export glTF/GLB with only required animations.
5. Run a current glTF validator and an approved optimizer such as gltf-transform
   or gltfpack when available.
6. Measure decoded texture memory and draw calls on the target mobile device.
7. Produce a poster, turntable, or frame-sequence fallback from the same camera.

The 3D fallback must preserve the product view or explanation, not merely show a
generic gradient.

## Sourced material as motion substrate — worked example

The rotating can, the assembling photograph, the process that runs as you
scroll. None of these are motion techniques applied to a page; each one is a
*set of real frames* plus a progress value. The material and the motion are the
same decision, which is why this file is routed at the moment you decide what
the focal thing is, not after you have decided to produce frames.

This is the moving case of the sourcing rule above: no single photograph of the
whole process exists, and the answer is still real frames rather than a
constructed subject.

**1 — Get the frames.** Probe for the tool; never assume one either way, in
either direction. This file cannot know what is installed where it runs, and a
list of what was present once goes stale exactly the way a source list does.

```bash
command -v blender ffmpeg cwebp magick
node -e "try{require.resolve('sharp');console.log('sharp ok')}catch{console.log('no sharp')}"
```

**On Windows, `convert` resolves to the filesystem utility, not ImageMagick.**
It answers `command -v`, so a presence check passes and the call then does
something unrelated. Probe `magick`, never `convert`.

What to expect rather than rely on: `sharp` installs cleanly from npm
everywhere it has been tried, and `ffmpeg` is common but far from universal —
the 2026-08-19 reference machine had neither it nor `blender`, `cwebp` or
ImageMagick. So a set of real still photographs is always a route you can take,
and a decode or a render is the branch you take after the probe comes back
positive, never before.

```bash
# reliable: a sourced set of real views, resized and re-encoded with sharp
npm i sharp
```

```js
import sharp from "sharp";
const frames = await fs.readdir("source/views");            // 24-36 real views
for (const [i, f] of frames.entries()) {
  await sharp(`source/views/${f}`)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(`public/seq/frame-${String(i).padStart(4, "0")}.webp`);
}
```

Only if you have confirmed the executable exists:

```bash
ffmpeg -i source/movement.mov -vf "fps=12,scale=1280:-2" frames/frame-%04d.webp
blender -b movement.blend -P turntable.py -- --frames 36 --out frames/
```

If the probe comes back negative, say so in one line and recommend the install
rather than working around it silently — `ffmpeg` is a single package, it is
the difference between a scrubbed sequence and a still, and the person running
the build is usually able to add it. Then carry on with the photographic route
in the same session; do not block on the answer. If neither tool is present and
no photographic set exists either, that is a capability gap to name — not a
reason to construct the subject.

**2 — Make it affordable.** 36 frames at 1280px is a hero-sized payload; treat
it as one. Emit a 640px derivative and a half-length set for mobile from the
same sharp pass. Write an explicit manifest. Verify first, middle, and last
frame by eye.

**3 — Scrub it from one progress value.** Preload before the section can be
reached, then drive frame index from the same authored progress that drives
every other element in the section — `../skills/motion.md` on why independent
triggers drift.

```js
const imgs = manifest.map(src => Object.assign(new Image(), { src }));
await Promise.all(imgs.map(i => i.decode().catch(() => {})));

function onProgress(p) {                    // p is 0..1 for the section
  const i = Math.min(imgs.length - 1, Math.round(p * (imgs.length - 1)));
  if (i !== current) { current = i; ctx.drawImage(imgs[i], 0, 0, w, h); }
}
```

Reduced motion gets one authored still, not a switched-off section. Mobile gets
the shorter set or the still, chosen deliberately.

**The same substrate, other forms.** A sourced set is not only a turntable:
photographs that assemble into a grid and scatter, a specimen crossfading
through states, a depth map from one real photo driving parallax or
displacement, a real macro clip masked into type. What makes any of these read
as craft rather than effect is that the material underneath is real — the
creativity is in what you do to it, not in manufacturing it.

## Acceptance

Record only durable asset paths and roles in `.dreative/context.json`. Validate
dimensions, codec/format, missing-asset behavior, mobile selection, loading
order, and visual match to the intended section. Delete intermediate exports
from the shipped client bundle.

Those checks are all mechanical, and a drawn stand-in passes every one of them.
So check the material too, and treat this one as a blocker: every surface a
buyer is choosing between shows sourced material. A CSS or SVG stand-in for a
physical finish, colourway, or texture ships only when the gap was named and no
material could be sourced — never as the default because the tile was small.
Before shipping any drawn surface, list what is already in the asset directory:
the run that failed this had the photograph on disk and painted a gradient
anyway.
