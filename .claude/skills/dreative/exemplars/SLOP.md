# The slop catalogue

Read this before committing to a visual system.

This file does not tell you what to make. It lists the shapes that generated
frontends fall into by default, so you can recognise when you are producing one.
Ruling out the average is what leaves room for something specific; prescribing a
replacement style would only move every Dreative build to a new average.

None of these are banned. Each is a **default that must be chosen against a
reason**, not drifted into. If you can state why this product needs it, use it.
If you reach for it because it is what a landing page looks like, that is slop.

---

## 1. The centred hero

Full-viewport section, centred headline in a large weight, one sentence of
supporting copy, two buttons side by side, a soft gradient or blurred blob
behind. Optionally a floating browser mockup at a slight angle.

**Why it happens:** it is the median of every landing page in the training data
and it is never actively wrong.

**Tell:** the hero would work verbatim for a company in a different industry.

**Instead:** ask what the first screen must *establish* — an object, a
capability, a mood, a number, a problem. Then let that requirement pick the
composition. Asymmetry, a full-bleed photograph, an interface shown in use, a
single enormous statistic, or plain type on paper are all specific answers.

## 2. The three-card row

An even grid of three or six cards, each with a small line icon at the top, a
two-word heading, and a sentence of body copy. Equal size, equal weight, equal
importance.

**Why it happens:** it is the lowest-effort way to make N items look designed.

**Tell:** the cards have identical visual weight even though the underlying
items are not equally important. Also: the icons are decorative and could be
shuffled without anyone noticing.

**Instead:** find the real relationship between the items. Are they a sequence?
A hierarchy? A comparison along one axis? Two big and four small? A table? A
list is often better than a grid and almost always more scannable.

## 3. The default palette

Indigo-to-violet gradient, near-black background, one saturated accent, white
text at 70% opacity for body copy. Or its light twin: white, grey-50 sections,
one blue.

**Tell:** the colour has no source. Nobody can say where it came from.

**Instead:** derive colour from something real — the product's materials, its
photography, its physical packaging, its data, the light in the place it comes
from, the ink of its printed form. A palette with a source can be defended and
tends not to look like anyone else's.

## 4. Uniform softness

Every corner rounded to the same radius. Every card with the same subtle
shadow. Every border the same one-pixel grey. Every section the same vertical
padding.

**Why it happens:** consistency is easy to generate and reads as competence.

**Tell:** squint at the page and it is an even texture with no structure.

**Instead:** consistency should be in the *system*, not in every value. Vary
weight deliberately: things that matter more should be bigger, closer, darker,
or given more room. Sharp and soft can coexist if the split means something.

**Not the inverse.** This entry has been over-read into a ban on rounding and
borders, producing a page of hard rectangles — *"the ban of borders is so strict
to the point it only uses rectangle"*. Uniform hardness is the same failure as
uniform softness: an even texture with no structure. Radius, borders, and
shadows are ordinary tools. The slop is applying one value to everything, in
either direction.

## 5. Motion as garnish

Fade-and-rise on every section as it scrolls into view, staggered by 100ms.
Numbers that count up. A marquee of client logos. A parallax layer that moves
because parallax exists.

**Tell:** removing the animation costs the user nothing. Nothing was explained,
revealed, connected, or made easier.

**Instead:** a *signature* motion should do one of four jobs — show causality,
maintain continuity across a change, direct attention to something that just
became relevant, or communicate the physical nature of the subject. If it does
none of those, it is decoration on a page that is already asking a lot of the
user.

**Read this entry narrowly.** It is about garnish standing in for a signature
moment. It is not about the interaction baseline — hover, focus, press, and
small regional entrances — which is required on every route and is supposed to
be cheap and unoriginal. Blind review is explicit that the ambient layer is what
reads as smooth, generic or not, and that a page with two strong mechanisms and
nothing else responding reads as having no animation at all. Fading every
section in is slop when it is the *only* motion on the page; it is the floor when
something specific happens on top of it.

The tell that distinguishes them: remove the motion and ask whether the page
feels *unexplained* (a failed signature moment) or *unresponsive* (a missing
baseline). Only the first is decoration.

## 6. Copy that says nothing

"Empower your workflow." "Built for modern teams." "Seamlessly integrate."
"Where innovation meets simplicity."

**Tell:** the sentence survives being moved to a different company's site.

**Instead:** the specific, checkable claim is almost always more persuasive.
"340ms median query time on 2.1 billion rows" beats "blazing fast." Preserve
the client's real numbers and real language. When copy is a preservation
requirement, do not quietly upgrade it into marketing voice.

## 7. Dark mode as sophistication

Dark background chosen because it looks premium, applied to a product whose
users are anxious, in daylight, in a hurry, or on a cheap screen.

**Tell:** the product is a service people need rather than a product people
admire, and the design is dressed for admiration.

**Instead:** ask who is reading this and in what state. A free clinic, a
government form, a checkout, an error page, and a docs site are usually served
by clarity, contrast, and speed. Choosing dark for a music tool, a code editor,
or a cinema-adjacent product is a real decision; choosing it everywhere is a
tic.

## 8. Spectacle in the wrong genre

Scroll-jacking on a documentation page. A WebGL hero on a clinic site. A
cinematic pinned sequence in front of a pricing table.

**Tell:** the effect delays or obstructs the single task the user came to do.

**Instead:** ambition in a utility product shows up as speed, density done
gracefully, excellent typography, states that are all designed, and errors that
are genuinely helpful. That is harder than a set-piece and much rarer.

## 9. Polished hero, abandoned body

The first screen is considered. Everything after it is default stacked sections
with decreasing care, and the footer is an afterthought.

**Why it happens:** attention and budget run out, and the hero is what gets
screenshotted.

**Tell:** scroll to 60% of the page and the design has stopped happening.

**Instead:** the body is where the user actually spends their time. Judge the
route by its weakest section, not its best one.

## 10. The fabricated prop

A realistic physical object — a product, a machine, a piece of fruit, a bean —
assembled out of CSS gradients, SVG ellipses, and box-shadows to look
three-dimensional. Usually floating, usually rotating, usually the wrong colour.

**Why it happens:** it is fully under the model's control. No sourcing, no
rights, no licence check, no file. It feels like craft because it is a lot of
markup, and the code looks impressive in the diff.

**Tell:** the object does not read as the thing it is named. Ask someone what it
is without telling them; if they hesitate, it failed. The colours are also
usually a give-away — invented rather than sampled from the real material.

**Instead:** source a photograph, a licensed model, a pre-rendered view, or at
least a real texture — `../references/MEDIA_SOURCES.md` ranks them and every rung
above drawing is keyless. Drawing is for notation: a chart, an icon, a mark, a
diagram or annotation **over** real material. Calling the output a schematic does
not settle the question, because the build that sourced four real photographs,
deleted them, and shipped a drawn plate labelled "a technical schematic" was using
exactly that sentence. If the thing could have been photographed and you drew it
instead, that is this entry, whatever the drawing is called.

This is the most expensive entry in this list. Blind reviewers describe an
otherwise strong page as ruined by it — *"the lighthouse image is soo bad omg"*,
*"the coffeebeans dont look like it"* — while the rest of the page's typography
and layout were scoring as the better of the two designs.

## 11. Mobile as a consequence

The desktop layout with columns stacked. Type still at desktop scale or shrunk
uniformly. A hero that now takes three screens. Tap targets under 44px. A
horizontal scrollbar nobody noticed.

**Tell:** no decision in the mobile view was made *for* mobile.

**Instead:** treat 390px as its own composition with its own order of
importance. Some things should be removed there, not stacked. Check 320px when
density is high.

## 12. The instrument about the product

A chart, roast curve, log stream, terminal readout, telemetry panel, or metrics
dashboard, on a page whose job is to sell an object, book an appointment, or be
read. It is bespoke, it is undeniably specific to the product, and it satisfies
every requirement to build something a competitor could not lift.

**Why it happens:** it is the shape a model reaches for when told to make
something that could only belong to this product. Data *about* a thing is
infinitely easier to invent than a good picture *of* the thing, and it looks
like engineering.

**Tell:** the component is the most elaborate thing on a page whose primary task
is something else entirely. Ask what the visitor came to do; if the instrument
neither performs that task nor makes it easier, it is decoration with a schema.
Blind review: *"a graph log which makes things confusing and not really a
ecommerce website"*, *"the graph is hella ugly ngl"*.

**Instead:** point the specificity at the subject. The signature component on a
shop should operate on the merchandise; on a clinic, on the appointment; on a
publication, on the text. A readout is the right answer when the product *is*
data or developer tooling — then it is not an instrument about the product, it
is the product.

## 13. Ambition as density

Every section carries a headline, a deck, three stats, a caption, a badge, and a
diagram. Nothing is empty. Every band is doing something.

**Why it happens:** given a requirement to be ambitious, adding is measurable and
subtracting is not. A packed page also looks like more work was done.

**Tell:** you cannot say what any single section is *for* in four words. Blind
review: *"cramping too much ambitions and words and design"*, *"theres so much
stats everywhere"*, *"messy, cramped, not tidy"* — losing to a control with a
third of the content.

**Instead:** ambition is resolution, not element count. One idea per band,
rendered precisely, with real space around it. Delete an element from a section
and check whether the section actually got worse; usually it did not.

---

## Using this file

At the point where the visual system is decided, and again after the first full
render, walk this list and note honestly which defaults are present and why.
Presence is not failure — unexamined presence is.

The single most useful question in this file: **would this design still work if
it were a different company?** If yes, it is not finished.
