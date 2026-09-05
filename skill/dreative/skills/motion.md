# Motion

Motion explains hierarchy, causality, continuity, and state. It is a way of
saying something about the subject, not a finish applied after the saying.

This is the deepest specialty in the skill and the one whose absence is named
most often in review. Open it when the arc moves — which is most builds — and
open it before the brief is written, not after the first transition.

## Motion is a material problem before it is a code problem

The animation code is the easy half and it is nearly always where a build spends
its effort. What separates a route that feels alive from one that is competently
eased is what is being moved: real frames, real footage, a real model, a real
surface, a real state. Decide that first —
`../references/MOTION_MATERIAL.md` — and have the files on disk before the
section that uses them exists.

The tell that this went wrong is a build whose motion is a `querySelectorAll`
list receiving staggered transforms. Every element moves; nothing happens.

### The order, and the two things that must exist before a section does

**Search, download, convert, crop, grade, and look at the frames before the
section that uses them exists.** A section written first gets written around what
is easy, and what is easy is a fade. This is the most reliably skipped step in
this skill's record and it is skipped in the same way every time: the page gets
built, it works, and then motion is applied to it as a finish.

Two things are on disk before you write a section that moves, and both are
checkable by looking at the directory:

1. **Treated derivatives, not downloads.** A file byte-identical to what you
   fetched has not been worked. Crops, grades, resizes, extracted frames,
   generated depth, a stripped and re-encoded clip — the shipped file should
   differ from the source because you decided something about it. A set assembled
   from untouched originals is nine different photographers' lighting sitting
   next to each other, and it reads as a stock grid however good each frame is.
2. **Whatever the mechanism consumes.** A scrub needs its frames; a depth
   displacement needs its map; a handoff needs both ends. If the mechanism's
   material is not there, you are about to build a different mechanism and call
   it the one you chose.

**Whether footage ships is a design decision. Whether you looked is not.** Video
must never be a required section — a page that does not want it is finished
without it — but "there was no footage" is only an honest answer after a search,
and the search is cheap: Wikimedia by media type, the Internet Archive, NASA and
its peers, Coverr, Pexels, a maker's own build log. The commonest route to a
pinned CSS sequence is that nobody ever looked for the clip. Say what you
searched and what you found, including when the answer is nothing.

`../references/MOTION_MATERIAL.md` has the sources, the `ffmpeg` and `sharp`
recipes, and several forms worked to equal depth. Open it while you still have
the budget to act on it.

## Build it real on the first pass

Do not write a placeholder transition where a real mechanism belongs, intending
to upgrade it. Once the placeholder renders correctly, replacing it becomes a
rewrite nobody performs, and review of a placeholder can only make it a smoother
placeholder. Start with the hardest, most material-dependent moment on the
route, at full intended fidelity, and fix the errors forward. Errors are the
normal cost. A retreat is legitimate only after a real attempt failed on the
rendered page, and it gets said out loud.

## Two budgets, funded separately

**The interaction baseline is required and should be boring.** Hover, focus,
press, and disabled states on everything a user can touch; a small entrance on
every major region. One grammar, one duration, one easing, applied uniformly and
fast enough to read as *response* rather than as animation. Cheap CSS
transitions on colour, background, shadow, underline, border, and a few pixels
of translate. Do not install a runtime for this and do not try to make it
distinctive — its whole job is to make the page feel answerable, and blind
review reads a route without it as unfinished no matter how good its set-pieces
are.

**Signature moments are few and expensive.** Budget them; never fund them by
cutting the baseline. The failure this split exists to prevent is two beautiful
mechanisms on a page where nothing else responds to anything, which a reviewer
describes as having almost no animation.

## Finding the signature moment

The good one is almost never a better transition. It is some behaviour the
subject already has, made visible in time — a process running, a state changing,
a quantity accumulating, a relationship being traced.

So the question is not *what effect goes here*. It is: **what does this subject
do, that a static picture of it cannot show?** Answer that in a sentence about
the product, then choose a mechanism that shows it. A mechanism chosen before
that sentence exists is decoration however well it is built, and reviewers name
it as decoration reliably.

Sometimes the honest answer is that the subject does nothing worth watching. A
page whose job is to be read quickly is finished at the baseline layer, and
stopping there is a decision you made, not a budget you failed to spend. It is
also the answer this skill reaches for when it is avoiding work, so you should
be able to say what you searched for and what the subject genuinely does not do.

## Calibrate against work that shipped, before you write the brief

The standing failure in this skill's record is not bad taste. It is aiming low —
building the version that was easy to reach and calling it the design. The
cheapest available correction is to watch three motion-led sites run before the
brief exists, and it takes minutes.

Stills cannot tell you this. A composition gallery answers what a page looks
like; a motion build scouted only from stills reproduces a still. Open the work
and put your hand on the wheel:

- **Awwwards** (Sites of the Day, and the Animation filter), **FWA**, and
  **Godly** filtered to motion-led work — whole shipped experiences you can
  scroll.
- **Studio sites that ship their own work** — Unseen, Active Theory, Resn,
  Locomotive, Basement, Hello Monday and their peers. This is the clearest
  evidence of what a ceiling looks like in production, and the ceiling is hard
  to imagine from a description.
- **Codrops** and Awwwards case studies for how a specific mechanism was built,
  *after* you know which mechanism you want.

Study one for a minute, then write down what actually happened: what the
material was, what drove it, how many distinct events there were on the route,
and what the page did at the seams between sections. That note is worth more
than the screenshot.

Two rules survive contact with all of it. Extract the **mechanic and the
pacing** — what is driven, by what input, over what distance, how many beats —
never the combined look. And never name a studio as the concept: "make it feel
like X" is imitation with an extra step, and the independence test in
`../references/CREATIVE_DIRECTION.md` rejects it. `../references/REFERENCE_ADOPTION.md`
governs what recording an adoption requires when you take something.

## The seams carry more than the set-pieces

Between two sections is where most routes go flat. Independent reveals joined by
scroll position produce a page that a reader describes as having no transitions,
however much is animating inside each band. Give the joins something: a subject
that persists and changes state, a value that continues across the boundary, a
frame that resolves as the next one opens, a colour or scale relationship that
hands over. One authored handoff between two sections buys more than a second
set-piece inside one of them.

## Runtime

Choose one motion language and one runtime owner. CSS handles local state and
the entire baseline layer. Reach for a coordination runtime — GSAP and its
scroll plugin, or an equivalent — when several elements must share one authored
timeline, and expect to reach for it when the signature moment is real. Do not
install a motion system to fade and translate things into view.

Define resting, active, and resolved states, whatever reverse or rapid input
does, and a reduced-motion form that was designed rather than switched off.
Avoid continuous work offscreen.

## Scroll, specifically

Scroll is an input the reader controls and you do not, and everything hard about
scroll work follows from that.

Drive the sequence from one authored progress value, so independent triggers
cannot drift apart — text saying one thing while the image behind it says
another is the commonest way a good scroll story reads as broken. Then use it
the way a reader will: slowly, at speed, backwards, and with the section taller
than a screen. The states you never saw while building are the ones that ship
wrong.

Trigger reveals against where the region sits relative to the top of the
viewport, not the moment its first pixel crosses the bottom. A reveal that
resolves after the reader has passed it fired behind their back, and reads as a
page that flickers.

## How this fails

Not a list to avoid — a description of what the reader reports, so you can
recognise it in your own build before they do.

A sticky scene that will not let go, so the page feels stuck. A mechanism that
puts distance between the reader and the thing they came for. A set-piece whose
removal costs the reader nothing, which reads as someone showing off. And the
inverse, more common in this skill's own record: a page of correct, uniform
fade-ups that avoids every failure above and says nothing, because avoiding
failures was the whole plan.

Read `../references/CREATIVE_EXECUTION.md` before adding a runtime, and one
matching recipe only after the mechanism is chosen. Read
`../references/MOTION_MATERIAL.md` before writing the section, because what you
can build is decided by what you managed to download.
