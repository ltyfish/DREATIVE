# Media implementation recipes

Load only after `conceptExploration` records three original concepts. Record the
load in `recipeAccess`. These constructions solve technical problems; they do
not choose the concept.

## DOM-tier constructions

- **Curtain/window:** overflow-hidden frame; animate an inner clip/mask while
  coordinating nearby type. Keep the image semantic and dimensions explicit.
- **Strip/slice:** duplicate the same asset into clipped strips with staggered
  offsets; cap strip count on mobile and provide an unsliced fallback.
- **Print/pixel develop:** reveal a preprocessed dither/mosaic state into the
  final image; avoid per-pixel DOM nodes.
- **Directional hover:** map entry direction or pointer position to a mask;
  expose the same content by tap/focus.
- **Drag/inertia gallery:** pointer capture + velocity decay + bounds; keyboard
  controls and conventional links remain available.
- **Frame scrub:** preload a bounded image sequence, draw into one canvas, map
  scroll/time to frame index, and use a poster on reduced motion.

## WebGL media plane

1. Keep `<img>`/`<video>` in normal DOM flow with semantics and dimensions.
2. Use its exact asset as the texture and copy its bounding rect to one shared
   scene plane.
3. Apply brand-native displacement/refraction/decomposition uniforms driven by
   scroll, pointer, drag, or time.
4. Compare effect and source rects during verification.
5. On context loss, low power, or reduced motion, reveal the DOM media.

Useful families: noise-mask dissolve, UV flow/refraction, velocity smear/RGB
split, depth-map parallax, point/particle decomposition, slice/shatter,
feedback/trails, and material-light response. Use the family that develops the
concept; do not collect one of each.

## Participatory constructions

- **Depth dive:** separate foreground/background or depth map; camera/UV scale
  crosses the image plane into layered space; reverse cleanly on scroll-back.
- **Decompose/reassemble:** image samples become particles/tiles and later
  reorganize into a new semantic state.
- **Temporal scrub:** visitor controls a meaningful change in time, not a
  decorative autoplay loop.
- **Physical media:** drag, throw, stack, sort, or peel assets with inertia and
  accessible equivalents.
- **Refractive exploration:** pointer/scroll changes how the visitor sees the
  same asset rather than layering unrelated noise above it.
- **Scene-responsive media:** media palette, material, crop, or topology reacts
  to a persistent scene instrument.

## Performance and fallbacks

- Compress responsive images (AVIF/WebP plus safe fallback), define `sizes`, and
  preload only true LCP media.
- Keep initial heavy media inside the selected tier budget; lazy-load later
  chapters and pause hidden/off-screen work.
- Cap canvas DPR, reuse buffers/materials, avoid allocations in render loops.
- Mobile halves complexity or uses a purpose-designed poster/DOM treatment.
- Fallback preserves the concept's hierarchy even when the mechanism simplifies.

## Video and sequence production pipeline

1. Record source/rights and choose generated, sourced, supplied, procedural or
   pre-rendered input honestly.
2. Clip and grade, then transcode web-ready MP4/WebM through system FFmpeg,
   verified `ffmpeg-static`, or a confirmed processing provider.
3. Produce a mobile crop, poster and reduced-motion still. Measure bytes.
4. Preload metadata/poster early and defer full media until chapter approach.
5. For scrubbing, smooth target `currentTime`; use
   `requestVideoFrameCallback` when it improves frame-to-canvas synchronization.
6. If seeking is unreliable, extract a bounded frame sequence and stage decode.
7. Canvas/WebGL may displace, mask, refract, smear or particle-treat the actual
   video texture; unrelated overlays do not qualify.
8. Verify readiness, seek error, frame index/time at controlled progress,
   dropped frames, FPS/worst frame time, mobile fallback and hidden/offscreen
   pause. Audio is explicit opt-in with a muted equivalent.
