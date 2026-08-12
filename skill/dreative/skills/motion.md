# Motion

Use motion to explain hierarchy, causality, continuity, or state.

## Two budgets, funded separately

**The interaction baseline is required and should be boring.** Hover, focus,
press, and disabled states on everything a user can touch; a small entrance on
every major region. One grammar, one duration band (120–200ms), one easing,
applied uniformly. Cheap CSS transitions on colour, background, shadow,
underline, border, and a few pixels of translate. Do not install a runtime for
this and do not try to make it distinctive — its whole job is to make the page
feel responsive, and blind review consistently reads a route without it as
unfinished no matter how good its set-pieces are.

**Signature moments are few and expensive.** This is where the taste rules
below apply. Budget them; never fund them by cutting the baseline.

The failure this split exists to prevent: two beautiful mechanisms on a page
where nothing else responds to anything, described by the reviewer as having
almost no animation.

## Choosing a runtime

Choose one motion language and one runtime owner. Prefer CSS for local states
and for the entire baseline layer; use GSAP only for coordinated choreography.
Do not install a motion system for fade/translate entrances.

Define resting, active, resolved, reverse/rapid-input where relevant, and a
purpose-designed reduced-motion form. Avoid continuous work offscreen.

## Scroll

For scroll stories, verify slow, normal, and rapid wheel input, reverse input,
at least 400ms of stable dwell after each key state settles, and a clean release
before the next section enters. Independent triggers that update text and imagery
must share one authored progress model or demonstrate that they remain
synchronized.

**Reveals must resolve on screen.** Trigger against the region's position
relative to the top of the viewport, not its first pixel crossing the bottom,
and check a section taller than one screen separately. A reveal that completes
after the reader has scrolled past it fires behind them; final smoke blocks a
region whose state is identical entering and centred and different once passed.

## Reject

Reject sticky scenes with weak release, and motion that makes the product slower
to reach. Reject a decorative set-piece whose removal costs the user nothing —
but do not apply that test to the baseline layer, whose value is precisely that
it is everywhere and unremarkable. Universal fade-ups and hover scaling are slop
only when they are standing in for a signature moment; as the ambient layer
underneath one, they are the floor.

Read `../references/CREATIVE_EXECUTION.md` before adding a runtime and one
matching recipe only after selecting the mechanism.
