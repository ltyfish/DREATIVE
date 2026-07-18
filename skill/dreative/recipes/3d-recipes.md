# 3D implementation recipes

Load only after three original spatial concepts are recorded. Record access in
`recipeAccess`.

## Recognizable product/subject

- R3F Canvas loaded dynamically with SSR off.
- `useGLTF` + preload, Environment/IBL, one key light, contact shadows, bounded
  camera framing, restrained damped parallax/orbit.
- Poster occupies the final layout while loading and on mobile/low power.
- Compress GLB with Draco/Meshopt; measure bytes and triangles.

## Photoreal cutout billboard

- Real transparent image on a plane (`alphaTest` where appropriate).
- Depth comes from parallax against other layers, restrained perspective
  rotation, contact shadow, rim/fresnel treatment, and optional angle swaps.
- Verify alpha, matching light temperature, and no sticker-like overlap.

## Shader surface

- Plane/fullscreen material with `uTime`, damped input, resolution, and palette
  uniforms from the page system.
- Slow domain-warp/noise, material response, or media-texture transformation;
  never use rainbow cycling or promote a generic blob as the signature.

## Points/data structure

- BufferGeometry points or instancing; shader-driven position/size/color.
- Use when data/spatial subject earns it, not as ambient filler.
- Desktop count measured; mobile halves or posters; pause off-screen.

## DOM-synced media

- One shared scene, real DOM images/videos retained, planes follow measured
  bounding rects, exact source assets become textures.
- Context loss/reduced motion reveals DOM media immediately.

## Runtime checklist

Live context and nonblank draw; asset loaded; texture/material identity; input
response; reduced-motion still; mobile fallback; context-loss poster; no
occlusion; capped DPR; observed frame time and transferred weight.
