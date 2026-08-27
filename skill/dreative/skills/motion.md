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
