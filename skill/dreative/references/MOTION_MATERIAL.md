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

Ranked by what the material gives you, not by difficulty. This ranks the **material**;
the *form* it takes is a separate decision made against the subject, and the
forms are worked out at equal depth further down:

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

### One authored value drives all of it

Whatever form the section takes, it runs off **one** value. That value can select a
frame, a video `currentTime`, a model rotation, a crop offset, a mask position, a
displacement amount, a particle's progress home, or a blend between two real states —
see *Forms, at equal weight* below for each of those written out. What changes between
them is the material and the form; the single source of progress does not.

Drive everything in a section from that one value. Independent triggers drift,
and drifted triggers are the commonest way a good sequence reads as broken.

Preload before the section is reachable, decode off the critical path, and give
reduced motion **one authored still that was chosen** — not the sequence with
the animation switched off.

## You cannot frame what you have not looked at

Every form that moves *within* an image — a zoom onto a part, a pan that travels
to a detail, a crop that opens on one component, a mask that reveals a region, a
callout pinned to a feature — is a claim that a particular thing sits at
particular coordinates in a particular file. Nothing verifies that claim for
you. Guessing it is how a section says *the barrel, then the stop-work* while
the frame travels to an empty corner of the plate, and it is how a crosshair
ends up marking nothing. Annotation is drawing at its best — `MEDIA_SOURCES.md`,
*what drawing is actually for* — but only when the coordinates beneath it are
real. A pointer to an invented location is worse than no pointer, because it is
a confident one.

So open the file and look at it, at the size the page will use, and locate the
region before you write the transform. That is the same inspection *A real
photograph is not automatically a good one* already asks for. This is the half
of it that decides whether the motion is possible at all.

The same check runs on the words. A caption claiming life size beside a
magnified crop, a stat panel whose figure is not the thing in the frame, a label
naming a component the picture does not contain — each is the mismatch above
with the motion removed. The frame and the sentence have to be making one claim.

**When the region is not there, or not there well enough** — the detail is
twelve pixels, the crop leaves the frame, the thing the copy names is simply not
in the picture — the answer is not a timid version of the same move, and it is
not a standing retreat to animating the type. There is no default here. What you
have is a real photograph and a claim to make, and those stay compatible in many
forms:

- **Go and get the frame that does contain it.** A missing detail is a sourcing
  failure before it is a motion one, and a macro or a second view is usually one
  more search away.
- **Render the view nobody photographed.** Rung 2 hands you the exact framing,
  and the travel stops being a scale on a rectangle: it becomes a camera moving
  through real geometry, which is the version that could not have been faked.
- **Move through the photograph instead of across it.** Displaced by a depth
  map, one still gives real parallax — the frame advances into the picture and
  the surfaces separate, and nothing had to be located to make that true.
- **Move the light, not the camera.** Hold the frame still and travel a
  specular sweep, a relight, or a graded pass across the surface. Attention
  follows the light, and light needs no coordinates.
- **Trade two real states in the same frame.** Off and on, closed and open, raw
  and finished. The whole frame is the subject, so there is nothing to point at.
- **Let the frame be consumed.** Sampled into a field, dissolved into a word,
  torn along a real edge, resolved out of its own grain. Whole-frame operations
  are indifferent to where anything sits inside them.
- **Draw the notation honestly beside it.** If the claim genuinely needs a
  location and no available image supports one, a diagram — at coordinates you
  established by looking, next to the photograph rather than lying on top of it
  — is notation, and notation is unlimited. Inventing the location is not.

Several of those are stronger than the zoom that was originally intended, which
is the point: the constraint is a fork in the form, not a reduction of it.

## Forms, at equal weight

The ladder above ranks **material**. It does not rank **form**, and the two are
separate decisions — the same sixty frames can be scrubbed, dissolved, masked
into a word, sampled into a field of particles, or cut into a sequence that
plays itself. What follows are several forms worked to the same depth, because a
form with a code sample beside five forms named in a list is not a choice, it is
a default with decoration. None of these is recommended over the others. The
subject picks.

Each one assumes the material is already on disk and already treated.

### Scrub an index

The reader's position selects a frame. Best when the subject has a real
progression the reader benefits from controlling — an assembly, a rotation, a
state changing over a known interval.

```js
const frames = manifest.map((src) => Object.assign(new Image(), { src }))
await Promise.all(frames.map((f) => f.decode().catch(() => {})))
let current = -1
function onProgress(p) {                          // one authored value, 0..1
  const i = Math.min(frames.length - 1, Math.round(p * (frames.length - 1)))
  if (i !== current) { current = i; ctx.drawImage(frames[i], 0, 0, w, h) }
}
```

Its failure is specific and common: a sequence whose frames all look alike reads
as a still that flickers. If two adjacent stops in the reader's journey select
frames that show the same thing, the index is not carrying the argument and
another form is doing more with the same material.

### Displace one photograph by its depth

One still plus a depth map is a volume: the reader moves and the near pixels
travel further than the far ones. Depth maps come with the material from a
photogrammetry set or a render, and can be generated from a single photograph
offline. This is the form that makes a *single* good photograph carry a whole
section, which is why it matters when a set cannot be sourced.

```glsl
// fragment: colour sampled at an offset proportional to depth and to input
uniform sampler2D uImage, uDepth;
uniform vec2 uShift;                 // from pointer, scroll, or gyro
void main() {
  float d = texture2D(uDepth, vUv).r;
  vec2 uv = vUv + uShift * (d - 0.5) * 0.06;
  gl_FragColor = texture2D(uImage, uv);
}
```

Without a depth map, a hand-cut two- or three-plane separation (subject, mid,
ground) as PNGs with alpha does most of the same work and costs an hour in an
image editor. That is a real technique, not a downgrade.

### Put the material inside the type

The word is the window. Real footage or a real photograph shows only where the
letterforms are, so the type stops being a label on the material and becomes the
way you see it.

```css
.headline {
  background: url(/media/movement.webm) center / cover;   /* or an image */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* video needs an element: position it behind and mask instead */
.masked { mask-image: url(/media/word.svg); mask-size: contain; }
```

Scale is the whole craft here — the type has to be large enough that the
material inside it is legible as material, which usually means far larger than
the layout wanted. The reverse also works: the type as a hole cut in an opaque
plate, showing the material through it.

### Stage the material physically

Instead of the image filling a rectangle, give it a body: a frame, a plate, a
strip of film, a card held at an angle, a stack that shuffles, a slide carousel
that advances with a mechanical step, a page that turns. The material stays
still and the *thing holding it* moves, which is often more convincing than
moving the image, and it works with as few as three photographs.

```css
/* one frame of a stack, offset and lit like a physical object */
.plate { transform: rotate(var(--tilt)) translateZ(var(--z));
         box-shadow: 0 var(--lift) calc(var(--lift) * 2) rgb(0 0 0 / .45);
         transition: transform .5s cubic-bezier(.2,.7,.2,1); }
.stack { perspective: 1400px; transform-style: preserve-3d; }
```

Weight and shadow do the work. A frame that moves without its shadow moving
reads as a sticker; a plate that lifts and darkens the one beneath it reads as
an object.

### Sample the material into a field

Read the pixels of a real photograph and use them to seed something that moves —
particles that carry the image's own colours, a flow field weighted by its
luminance, a dissolve that scatters and reassembles the actual subject. The
image is not illustrated by the effect; the effect is *made of* the image, which
is what separates this from a generic particle background.

```js
const { data } = ctx.getImageData(0, 0, w, h)
const parts = []
for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) {
  const i = (y * w + x) * 4
  if (data[i + 3] < 40) continue
  parts.push({ hx: x, hy: y, x: Math.random() * w, y: Math.random() * h,
               c: `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})` })
}
// then ease x,y toward hx,hy on one authored value; scatter on the way out
```

Bound the particle count against the real device, and give the resting state the
photograph itself rather than an approximation of it.

### Cut it, and let the cut be the design

Editing is a design act, not a preprocessing step. A clip trimmed to the exact
half-second where the thing happens, slowed at the moment of contact, reversed
so it assembles instead of falling, or cut hard against the type is doing work
that no runtime parameter can add afterwards.

```bash
ffmpeg -ss 00:00:07.2 -t 1.6 -i src.mov -an beat.mov       # the exact moment
ffmpeg -i beat.mov -filter:v "setpts=3.2*PTS" -an slow.mov  # hold on contact
ffmpeg -i beat.mov -vf reverse -an assemble.mov             # falling -> building
ffmpeg -i slow.mov -vf "crop=ih*0.75:ih,scale=900:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -an public/media/beat.webm
```

Then the runtime can be almost nothing: play once on entry, hold the last frame,
tie `currentTime` to the reader. A well-cut two-second clip beats a badly chosen
sixty-frame scrub, and it is a tenth of the payload.

### Trade two real states

Two photographs of the same subject in two genuine conditions — lit and unlit,
open and closed, before and after, dry and wet — and a transition that makes the
difference legible: a wipe along the axis the change happens on, a hard cut on a
click, a circular reveal under the cursor, a slider the reader drags. Cheap,
sourceable when nothing else is, and it carries information rather than
atmosphere.

```js
el.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`   // p is the same authored value
```

---

Nothing above is a list to work through, and a page does not become better by
containing more of them. One form, chosen because it is what this subject does
and executed to the end, is the target. The reason to know all of them is that
the first form you think of is usually the one you used last time.

## When the material is not there

It happens, and saying so is a real answer. Name the rung you reached, what you
searched, and what came back. Then change the *form* rather than the subject:
drive one photograph instead of scrubbing thirty, hold a frame while type moves
through it, cut between two real states.

The other half of that answer is the driver. A rig built to index into a
sequence will happily index into anything — six unrelated stills, one per stage,
swapped on scroll. It runs, it passes smoke, and it reads as a slideshow,
because the material underneath it has no continuity for the index to expose.
So when the set is not one subject, retire the index along with the sequence.
Something that stays put and is worked on — one photograph driven, a frame held
while type moves through it, two real states traded — beats an indexing driver
with nothing to index, which is the most convincing-looking way to ship nothing.
Check this on the files, before the section exists: same subject, compatible
light, a state that progresses. `MEDIA_SOURCES.md`, *One subject, or a different
form*, is the same check from the sourcing side, along with the grading and
compositing that make separately sourced material read as one shoot.

What is not an answer is constructing the subject out of gradients and animating
that. A fabricated prop in motion is the same defect as a fabricated prop at
rest, moving.
