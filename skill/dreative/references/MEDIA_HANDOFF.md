# Make media survive the transition

Use when an image changes frame, switches between canvas and DOM, or becomes a
detail view. Begin with the actual destination layout and source asset. This is
a construction recipe, not a prescribed visual treatment.

## Solve the crop as well as the box

For source dimensions `Sw × Sh` and frame `Fw × Fh`, cover uses
`s = max(Fw / Sw, Fh / Sh)`; contain uses `min`. Render the image at
`Sw*s × Sh*s`. For normalized object position `px, py`, its offset in the frame
is `(Fw - Sw*s)*px, (Fh - Sh*s)*py`. The position is the alignment of the excess
space, not the coordinates of the subject's eye. Choose it by inspecting the
actual subject at the start, intermediate aspect ratios, and destination.

`mediaPlacement` in `../systems/runtime.js` implements this geometry. It returns
`{x, y, width, height}` in the frame's units. It supports cover/contain and
normalized positions clamped to 0..1, not the full CSS object-position grammar.
Keep that distinction if adapting arbitrary CSS.

```js
const framing = { fit: "cover", position: [0.58, 0.42] }; // example, author per shot
const placement = mediaPlacement(image.width, image.height, width, height, framing);
ctx.drawImage(image, placement.x, placement.y, placement.width, placement.height);
// Matching DOM: object-fit: cover; object-position: 58% 42%.
// Or render an absolute image using placement in CSS pixels inside a clipped frame.
```

The sequence renderer accepts the same definition:

```js
const sequence = mountFrameSequence(canvas, {
  frames: actualFrameUrls,
  framing: ({ width, height, frame }) => framingForShot(width, height, frame),
});
// framingForShot is project-authored; a static framing object is also accepted.
// Defaults preserve centered cover. destroy() releases the renderer's listeners/cache.
```

Canvas dimensions are backing pixels; DOM dimensions are CSS pixels. Apply DPR
once. Share crop, scaling, clipping, and transform-origin between renderers.
If a pixelated layer resolves into a sharp one, sample the same visible source
region and change sampling resolution. Two independently cropped versions will
appear to slide or double during the crossfade. A zoom applied only to the sharp
layer causes the same defect. Inspect distinctive landmarks, not just frame edges.

Contain, a wider authored frame, a different view, or a deliberate detail crop
can each solve clipping. Do not automatically center every image or stretch it.
An intermediate crop may differ intentionally; maintain subject identity and
avoid accidental amputations at awkward boundaries. Mobile often needs another
composition rather than the desktop frame squeezed narrower.

## Give the carried media one owner

1. Lay out the real source and destination, including loaded fonts, media aspect
   ratios, and controls. Measure their current viewport rectangles. Choose a
   measured-layout runtime such as Flip or an appropriate view transition when
   it fits; inspect its current API rather than guessing an install snippet.
2. If using a fixed overlay, render only a visual copy there, with no interactive
   descendants, `aria-hidden`, and `pointer-events: none`. Retain the original
   layout space and accessible content. Avoid two visible subjects at takeover.
3. Interpolate the outer frame and authored inner-image placement. A scrubbed join
   derives its state from current progress, including reverse and direct entry.
   A timed interaction starts again from its current visual state on interruption.
4. Resolve exactly onto the destination image; transfer visible ownership back
   to the real layout. Activate controls when the destination is usable. During
   reverse traversal, take ownership again at the same geometry. Selection and
   focus belong to product state, not a disposable visual clone.
5. Invalidate measurements after resize, font changes, and relevant layout
   changes. Clean up the overlay and animation on navigation/unmount. A failed
   load or reduced-motion preference must retain a useful real destination.

Check takeover, a narrow intermediate frame, release, reverse, a fast traversal,
and a resize near release. Then use the destination with touch and keyboard.
For route changes, test Back and direct entry too. This recipe cannot establish
good pacing; watch the join within the surrounding compositions.
