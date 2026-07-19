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

## Acceptance

Record only durable asset paths and roles in `.dreative/context.json`. Validate
dimensions, codec/format, missing-asset behavior, mobile selection, loading
order, and visual match to the intended section. Delete intermediate exports
from the shipped client bundle.
