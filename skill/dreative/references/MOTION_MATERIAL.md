# Motion material

Motion is made of something. This file is about getting the something.

A build that decides "the hero scrubs a sequence" and then never downloads a
sequence ships a fade. That is the most common way this skill fails, and it does
not look like a failure from inside the build — every element moves, every
transition eases, nothing errors. It looks like a failure to a reader, who sees
a page where rectangles slide and nothing is *happening*.

`MEDIA_SOURCES.md` covers where a still image comes from and what its licence
permits. All of that applies. This file covers the part specific to motion: what
kinds of material can be driven, how to get them onto disk, and what to run over
them before they are usable.

## The question that comes first

Not *what should animate*. **What is the thing, and what does it do in time?**

A watch movement runs. A garment falls. A map is traversed. A liquid pours. A
machine cycles. A face turns. A city lights up at dusk. Every one of those is a
real event with real footage, real frames, or a real model behind it — and each
one gives you something to drive that position, opacity and scale cannot fake.

If you cannot name the event, you do not have a signature moment yet. Do not
proceed to picking an easing curve.

## What can actually be driven

Ranked by what the material gives you, not by difficulty:

1. **A frame sequence of one subject.** The strongest and the most reliably
   overlooked. 24-60 frames of the same object rotating, opening, running,
   assembling, or changing state. Scrub it against scroll, drag, time, or a
   click-advanced index. This is what makes a page feel like it has a thing in
   it rather than a picture of a thing.
2. **A video clip you own the rights to.** Sample it, slow it, window it, mask
   it into type, freeze and resume it, run it in both directions, tie
   `currentTime` to an authored progress value. A clip driven by the reader
   reads completely differently from a clip on `loop autoplay`.
3. **A model.** glTF plus a real HDRI: rotate, section, explode, relight,
   traverse. Or render it out to a frame sequence and fall back to rung 1 —
   often the better answer, and almost always the better mobile answer.
4. **A photograph with depth.** One still plus a depth or normal map is a
   parallax field, a relight, a travel-through. Two real states of the same
   subject are a dissolve that means something.
5. **A real dataset with a shape in time.** Only when the product's value
   genuinely is data — see the category-error note at the end of
   `CREATIVE_DIRECTION.md`.
6. **Type and drawn notation.** Unlimited, and genuinely good: kinetic type,
   annotation drawn over footage, a diagram that builds, a mark that traces.
   These are companions to real material. They are not the material.

Below that line is where the failure lives: a layout of DOM boxes with
transforms on them. That is not motion material, it is the transport for it.

## Get it on disk before you write the section

The order is the whole thing. Search, download, convert, and look at the frames
**before** the section that uses them exists. A section written first gets
written around what is easy, and what is easy is a fade.

```bash
command -v ffmpeg blender magick gltf-transform
node -e "try{require.resolve('sharp');console.log('sharp ok')}catch{console.log('no sharp')}"
```

`ffmpeg` is the one that matters most here. On a negative probe, say so in one
line and recommend the install — then keep going down the ladder in the same
session rather than blocking on the answer.

### Where motion material actually is

- **Wikimedia Commons** holds video and animated sequences, not only stills.
  Filter by media type. Rights are per file and often share-alike.
- **Internet Archive** — film, broadcast, and public-domain footage at scale.
  Rights range from public domain to fully reserved; check per item.
- **NASA, NOAA, USGS, ESA** — the strongest free footage available for
  environmental, atmospheric, orbital, and terrain subjects.
- **Pexels and Coverr** carry free stock video. Pexels needs a key, which is a
  gap to raise, not a reason to fabricate.
- **Sketchfab** (`api.sketchfab.com/v3/search`) — filter to downloadable CC
  models. A licensed model is a frame-sequence generator.
- **Poly Haven** — CC0 HDRIs, which is what makes a sourced model look real
  rather than plastic. Do not ship a model lit by three point lights.
- **A manufacturer's press kit, a maker's build log, a museum's own object
  page.** No API, better material. Fetch it.

Shoot the sequence yourself where the subject allows it: a turntable from a
model, a screen recording of the product's own interface, an assembly rendered
frame by frame. Generated frames of the real thing beat sourced frames of a
different thing.

### Producing the files

```bash
# clip -> web video, plus a poster
ffmpeg -i src.mov -vf "scale='min(1920,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/media/clip.webm
ffmpeg -i src.mov -vf "thumbnail,scale=1600:-2" -frames:v 1 public/media/clip-poster.jpg

# clip -> scrubbable frame sequence, desktop and mobile sets from one pass
ffmpeg -i src.mov -vf "fps=15,scale=1440:-2" public/media/seq/f-%04d.webp
ffmpeg -i src.mov -vf "fps=15,scale=720:-2"  public/media/seq-sm/f-%04d.webp

# trim, retime, reverse - editing is part of this work, not a separate discipline
ffmpeg -ss 00:00:04 -t 6 -i src.mov -an cut.mov
ffmpeg -i cut.mov -filter:v "setpts=2.0*PTS" slow.mov
ffmpeg -i cut.mov -vf reverse -an reverse.mov

# model -> turntable frames
blender -b subject.blend -P turntable.py -- --frames 48 --out frames/

# model -> shipped glTF
gltf-transform optimize subject.glb public/media/subject.glb --texture-size 1024
```

Then **look at the frames**. First, middle, last, by eye. A sequence with a
jump, a watermark, a colour shift at frame 30, or a subject that leaves frame is
worse than no sequence, and the file count will not tell you.

Write an explicit manifest rather than globbing at runtime. Emit the mobile set
from the same pass, never as an afterthought. Keep originals out of the client
bundle and keep the licence record with the derivative. Never run an unbounded
sequence extraction.

### One engine drives all of it

```js
const frames = manifest.map((src) => Object.assign(new Image(), { src }));
await Promise.all(frames.map((f) => f.decode().catch(() => {})));

let current = -1;
function onProgress(p) {                 // p is 0..1, authored, one source
  const i = Math.min(frames.length - 1, Math.round(p * (frames.length - 1)));
  if (i !== current) { current = i; ctx.drawImage(frames[i], 0, 0, w, h); }
}
```

The index can select a frame, a video `currentTime`, a model rotation, a crop
offset, a mask position, or a blend between two real states. Same engine. What
changes is the material — which is why the material is the decision and the code
is not.

Drive everything in a section from that one value. Independent triggers drift,
and drifted triggers are the commonest way a good sequence reads as broken.

Preload before the section is reachable, decode off the critical path, and give
reduced motion **one authored still that was chosen** — not the sequence with
the animation switched off.

## When the material is not there

It happens, and saying so is a real answer. Name the rung you reached, what you
searched, and what came back. Then change the *form* rather than the subject:
drive one photograph instead of scrubbing thirty, hold a frame while type moves
through it, cut between two real states.

What is not an answer is constructing the subject out of gradients and animating
that. A fabricated prop in motion is the same defect as a fabricated prop at
rest, moving.
