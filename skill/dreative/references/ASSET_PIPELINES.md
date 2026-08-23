# Asset production pipelines

Two decisions live here: what is in the frame, and what that material is made to
do. The recipes below serve those and are the least important part of the file.

## The subject is sourced, never manufactured

A physical thing arrives as real material — a photograph, a frame, a scan, a
render of an actual model. A gradient, a dot pattern, or a stack of CSS layers
standing in for a surface is not a cheaper version of it; it is a different,
worse thing, and it reads that way at full size next to a price.

This holds hardest where it is most tempting: the small tile, the swatch, the
thumbnail in a card. Small does not mean it can be drawn. Where no material
exists and none can be sourced, say so and choose a form that does not need it —
a named description, a detail crop of the shared subject, a typographic
treatment. Naming the gap is a real answer; drawing over it is not.

## Decide what the material is made to do

Sourced, resized, credited — and then sitting in an `<img>` doing nothing, while
the page's motion is a fade applied to a `querySelectorAll` list. Six
photographs treated that way are six decorations. One photograph that carries
the explanation is the page.

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

**The mechanism is one engine.** Preload, one authored value, one index into
material, redraw only on change — the same whether the index picks a frame, a
crop, a depth offset, a mask position, or a blend between two real states.

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

**Material availability fails more often than tooling.** A scrubbed sequence
needs a coherent set of views *of the same object*, and for a one-off subject
that set often cannot be sourced — what exists is a few real photographs of
related things. That is where the form changes, not where the subject gets
constructed: drive one photograph instead of scrubbing thirty.

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
the real crop. Atlas frames only when the lookup saves requests without bloating
first load.

**Model to glTF:** strip hidden geometry and unused materials, apply transforms
with an intentional origin and real-world scale, bake what need not stay
dynamic, export only required animations, run a validator and an optimizer
(`gltf-transform`, `gltfpack`) when available, measure decoded texture memory
and draw calls on a real phone, and produce a poster or frame-sequence fallback
from the same camera. That fallback preserves the product view, not a gradient.

## Acceptance

Record durable asset paths and roles in `.dreative/context.json`. Validate
dimensions, codec/format, missing-asset behaviour, mobile selection, loading
order, and visual match to the intended section. Delete intermediate exports
from the shipped bundle.

Those are mechanical, and a drawn stand-in passes every one. So check the
material too, and treat this as a blocker: every surface a buyer is choosing
between shows sourced material. A CSS or SVG stand-in for a physical finish,
colourway, or texture ships only when the gap was named and nothing could be
sourced. Before shipping any drawn surface, list what is already in the asset
directory: the usual version of this failure is a build that sourced the right
photograph, resized it, and then drew the tile by hand anyway.
