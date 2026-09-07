# Motion material and production

Choose material from the event and camera behavior the user should see.
A frame sequence is useful for exact reversible views; video for continuous
playback; live geometry for user-controlled viewpoints; layered stills for
framing/parallax; DOM/SVG/type for graphic and interface motion.
No one of these is intrinsically the strongest.

## Prove the expensive property first

Before building its section, test the actual intended asset at the intended crop.
For a sequence this means adjacent frames and scrubbing, for video a real seek,
for 3D its camera/light/material, for a shader its visible distortion and edge
handling. A file count or a canvas node does not establish a working treatment.
Source and rights procedures are in `MEDIA_SOURCES.md`.

## Video versus image sequences

Use a trimmed encoded clip for time playback, short loops, and cinematic cuts.
Set a poster, muted autoplay where appropriate, playsinline, readiness handling,
and a usable state when playback is blocked. Autoplay failure must not hide content.

For scrubbed video, first test seek latency and visual accuracy using the actual
encode. Keyframe spacing and decode capability matter. Avoid launching a seek
for every animation frame while another seek is pending; coalesce to the latest
target and handle seeking/seeked. A prerecorded movie is not automatically a
good reverse scrubber.

Frames give deterministic index selection but can be expensive. Estimate decoded
memory as width × height × 4 × cached frames (plus renderer overhead), not the
compressed download size. At 1440 × 900, 60 decoded RGBA frames are about 311 MB.
Use bounded caching/prefetch around the current frame, release distant images,
and retain the last good frame until the requested one decodes. Bound extraction
duration and dimensions. Inspect the number of frames needed for the actual
movement and screen travel; do not adopt a universal 24/48/60-frame quota.

Example commands; choose dimensions/quality by inspection:

```sh
ffprobe -v error -show_streams -show_format -of json source.mp4
ffmpeg -ss 4 -t 5 -i source.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 23 -movflags +faststart clip.mp4
ffmpeg -ss 4 -i source.mp4 -frames:v 1 -vf "scale=1280:-2" poster.jpg
ffmpeg -ss 4 -t 5 -i source.mp4 -vf "fps=24,scale=1280:-2" frames/f-%04d.webp
```

Create output directories first. These commands produce derivatives, not a
finished edit. Emit a smaller mobile set only when measurements justify it and
write an ordered manifest; do not rely on lexical glob order at runtime.
Inspect first/middle/last AND adjacent frames around any visual discontinuity.

## Still-image motion

Framing often needs just a large image with a deliberate focal point.
Compute the cover scale from source and viewport aspect ratios; add overscan
for maximum travel. Keep the aperture transform separate from image movement.
Recalculate on resize; do not animate layout measurements each frame.

For layer parallax, separate foreground/background when the asset permits it and
fill uncovered background honestly. A depth map can drive displacement, but it
cannot invent correct hidden geometry. Keep amplitude modest around silhouettes
and inspect edge smearing. An estimated depth map is not a reconstructed model.

For pixelation, draw into a low-resolution surface and upscale with image
smoothing disabled, or quantize shader UVs to a changing cell grid. Ensure the
final state uses the original sharp source. Dither instead changes quantization
patterns; blur changes frequency detail. Pick the operation the brief asks for.
Keep a DOM image/poster fallback and preserve text readability separately.

## Rendered and live 3D

Use an actual model when object identity matters. Check its license, geometry,
materials, pivot, scale, and animation. Choose camera and light before polishing
interaction. HDRIs and authored studio lights are both valid tools.

For predetermined views, author a Blender render script for that model; test one
frame, then a short span, then the bounded sequence. Fix scene units, random seed,
camera path, exposure, output dimensions, and alpha handling to preserve continuity.
A command referencing a nonexistent turntable.py is not a production pipeline.

For live user-controlled views, optimize textures and geometry, cap DPR based on
measurement, pause offscreen, handle context loss, and dispose resources.
Provide a poster or render from the same camera. A textured plane may be the
right choice, but describe it as a plane rather than a model.

## One progress, clear ownership

A timeline or shared progress value can drive a frame index, image crop, mask,
model pose, and surrounding text together. Each property has one writer.
DOM state should not independently override the same transform as GSAP.

Separate loading from authored progress: load a visible first state, then enable
the mechanism when its required material is ready. Progress jumps must not produce
blank frames. Recheck late image/font layout changes and restored scroll position.

## Production acceptance

Inspect normal playback, pause, reverse where intended, fast traversal, entry,
exit, resize, touch, and reduced motion. Test a missing asset and slow decode.
Record download bytes and observed decoded memory or frame-time behavior when
heavy material matters. Desktop emulation cannot establish real-phone GPU smoothness.
