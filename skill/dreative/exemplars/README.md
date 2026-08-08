# Exemplars

## What this folder is, and what it deliberately is not

The obvious way to teach an agent taste is to give it a library of good
websites: screenshots, saved markup, a database of templates and UI kits to
draw from. That approach fails in a specific and predictable way. A model given
examples will interpolate between them. The output converges on the average of
the library, and the library's average becomes the new house style — which is
what "AI slop" already is. A bigger reference collection produces a more
confident sameness, not more originality.

So this folder holds **no copied designs**. It holds two things that examples
cannot be reduced to:

- **`SLOP.md`** — the negative catalogue. The default shapes that mark a
  frontend as generated. Ruling out the average creates room for something
  specific without prescribing what fills it. This is the single highest-value
  document here, because it is concrete, checkable, and style-neutral.

- **`PRINCIPLES.md`** — principles indexed by the **condition** under which they
  apply, not by the site they came from. Each entry names what it costs and
  when it is wrong. A principle you must check a condition before applying
  cannot be applied reflexively, which is the whole defence against copying.

Where to actually *look* at real work is a separate question, answered in
`../references/REFERENCE_ADOPTION.md`, which routes Godly, Refero, and the
component collections to the research role each is genuinely good for. Study
sites there; extract principles here.

## The rule that keeps this from becoming a template library

> Adopt a **decision and its reason**, never a look.

Concretely: after studying anything, you should be able to complete the sentence
"this works *because* the product has property X." If you cannot name X, you
have found a style you liked, not a principle you can use, and transplanting it
will produce something that fits your product by coincidence at best.

Two further guards:

- **Cross-domain sourcing.** Take structure from one place and material from
  another, from different fields. A single-source adoption is imitation wearing
  a different logo.
- **State what you did not take.** For each source, name the traits you
  deliberately left behind. A source you took everything from was not a
  reference.

## Adding to this folder

Add a principle only when you have seen it hold up **on a real build**, and
write it in the same shape as the existing entries: principle, condition, cost,
failure mode. Do not add entries for things that merely sounded true in
planning.

Do not add screenshots, copied markup, component code, or a list of sites you
admire. Those belong to research, not to the skill, and shipping them here would
turn the folder into exactly the averaging machine it exists to avoid.
