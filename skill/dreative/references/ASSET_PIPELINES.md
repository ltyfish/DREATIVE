# Asset production pipelines

Use offline work when it produces better fidelity, smaller runtime cost, or a
more reliable mobile fallback than live simulation. Never invent an available
tool. Confirm the executable, source assets, output rights, and target browser
support first.

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

The failure this replaces is building the subject in SVG because no single
photograph of it existed.

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

What to expect rather than rely on: on the 2026-08-19 reference machine none of
`blender`, `ffmpeg`, `cwebp` or ImageMagick were installed, and `sharp`
installed cleanly from npm. So plan for a set of real still photographs as the
likely route, and treat a render as the branch you take only after the probe
comes back positive.

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

If neither tool is present and no photographic set exists, that is a capability
gap to name — not a reason to construct the subject.

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
