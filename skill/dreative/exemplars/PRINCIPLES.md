# Principles, indexed by condition

Each entry names the condition under which it holds, what it costs, and when it
is wrong. Read the condition first. A principle applied without checking its
condition is a style, and styles transplant badly.

---

## Always — the things blind review keeps punishing

These are not style advice. They come from paired A/B rounds where the same
brief was built with and without this skill, scored without knowing which was
which. Each one is a reason a cleaner, more restrained build lost.

**Ship one component that could only belong to this product — and point it at
the product.**
Condition: always, in Recommended and Showcase. A command-line card on a
developer tool, a triage clock on a clinic page. Cost: it is genuinely harder
than composing a page out of known parts. Wrong when: never — but the *shape*
that is wrong is a chart, log, or metrics panel about a product that is not
itself data. That satisfies the requirement and loses anyway: "a graph log which
makes things confusing and not really a ecommerce website."
Reviewers describing what they liked about a losing build named a single
bespoke component almost every time. Reviewers describing a winning build's
weakness said "nothing stands out as what it is."

**The ambient layer is what reads as smooth, not the best moment.**
Condition: always, every profile. Hover, focus, press, and small regional
entrances on everything, in one grammar, cheap and unoriginal by design. Cost:
almost nothing — a handful of CSS transitions. Wrong when: never; this is the
floor. The control keeps winning smoothness with only this and nothing else,
described as "very overused and not unique" in the same breath as being
preferred. A route with two beautiful mechanisms and nothing else responding is
still described as having almost no animation.

**A route where nothing moves reads as unfinished, not as restrained.**
Condition: always, outside Efficient — which is exempt from signature motion,
never from the ambient layer. Cost: motion has to be built and tested on every
viewport. Wrong when: motion competes with an urgent task — and even then the
answer is one quiet authored motion, not none. For *signature* moments, few and
well-executed beats many and decorative; that trade does not apply to the
ambient layer, which should be everywhere.

**Ambition is resolution, not element count.**
Condition: whenever a requirement pushes you to add something. Cost: sections
you were proud of get emptied out. Wrong when: the content genuinely is dense
and the reader came for density, as in a reference table or a spec sheet.
Given a positive requirement, builds answer it by cramming — and lose to a
control carrying a third of the content: "cramping too much ambitions and words
and design", "theres so much stats everywhere". Delete an element from a section
and check whether the section got worse. Usually it did not.

**Being readable is not the same as being scannable.**
Condition: any section a visitor meets before they have decided to invest
attention. Cost: prose you were pleased with gets broken up. Wrong when: the
user has already committed to reading, as in long-form editorial.
A well-written wall of text and a table with no visual differentiation both lose
to structure a reader can land on. Reviewers reach for the words "hard to
understand" and "no clear separation" — and they reach for them about builds
whose typography was otherwise the better of the two.

**Execution beats ambition, and ambition beats neither when unverified.**
Condition: any bold treatment. Cost: you must be able to serve the route and
look at the mechanism before you commit to it. Wrong when: never. A bold,
expressive, wrongly-executed page loses to a plain correct one; a bold correctly
executed page beats everything. The difference is entirely whether you checked.

## When the product is a physical thing

**Show the object doing what makes it worth buying.**
Condition: the product has a material, a process, or a transformation that is
the actual reason for its price. Cost: real photography or rendering, which
must be sourced or produced rather than faked with gradients. Wrong when: the
object is generic and the value is in service, price, or convenience instead.

**Let the material set the palette and the surface.**
Condition: the product has a real material identity — roasted coffee, paper,
steel, glass, textile. Cost: constrains later colour decisions. Wrong when: the
material is visually uninteresting or irrelevant to the buying decision.

**Keep a comparison set comparable.**
Condition: the user is choosing between several similar items. Cost: limits how
expressive individual product cards can be. Wrong when: there is only one
product, or the items are not alternatives to each other. A grid that reflows,
reorders, or resizes items as the user scans makes people lose their place; the
prettier layout that costs them the comparison is the worse layout.

## When the product is dense with information

**Density is not the enemy of design; undifferentiated density is.**
Condition: the user's task requires seeing many values at once. Cost: demands
real typographic discipline rather than whitespace. Wrong when: the density is
incidental and could simply be reduced.

**Give the scanning path more design attention than the reading path.**
Condition: users arrive knowing roughly what they want to find. Cost: less room
for narrative. Wrong when: the user needs persuading before they know what to
look for.

**Alignment does more work than decoration in a table.**
Condition: numeric or categorical data in rows. Cost: none worth mentioning.
Wrong when: never, really — right-align numbers, align decimal points, keep row
height uniform, and let the borders do the least work possible.

## When the product is mostly text

**The measure and the leading are the design.**
Condition: the user's task is sustained reading. Cost: constrains layout width
regardless of screen size. Wrong when: the text is scanned rather than read.
Roughly 60–75 characters per line; leading grows with measure, not with taste.

**Typographic voice can carry an entire identity.**
Condition: there is little interface and no product imagery to work with. Cost:
requires committing to type that most sites would consider risky. Wrong when:
the type choice fights legibility for the actual reading conditions.

**Interruptions must earn the loss of momentum.**
Condition: long-form content. Cost: fewer places to put calls to action. Wrong
when: the piece is genuinely a landing page in essay clothing. A pull quote
that repeats a nearby sentence costs the reader momentum and returns nothing.

## When the product is a utility people need

**Speed and clarity are the aesthetic.**
Condition: the user is task-driven, possibly stressed, possibly on a poor
connection or an old device. Cost: rules out most set-pieces. Wrong when: the
product is chosen for pleasure rather than need.

**Put the answer to the most urgent question above everything.**
Condition: there is one question most visitors arrive with — are you open, what
does it cost, am I eligible, is my data safe. Cost: the brand statement moves
down. Wrong when: visitors genuinely arrive without a question, which is rarer
than it sounds.

**Trust is built by specificity, not by polish.**
Condition: the user is deciding whether to rely on you. Cost: requires real
numbers, real names, real constraints. Wrong when: nothing verifiable exists to
show — in which case fix that before designing around it.

**Accessibility constraints are design constraints of the same rank as brand.**
Condition: always, and non-negotiably when the audience includes people in
distress, older users, or non-native speakers. Cost: bounds contrast, type
size, and motion. Wrong when: never.

## When motion is under consideration

**Motion should explain, connect, direct, or characterise.**
Condition: one of those four jobs exists. Cost: implementation and testing time
on every viewport plus reduced-motion. Wrong when: the honest answer to "what
does this do for the user" is "it makes the section feel less empty."

**Continuity is worth more than spectacle.**
Condition: the user moves between states or sections and needs to keep their
bearings. Cost: requires planning the whole route rather than one section.
Wrong when: the sections are genuinely unrelated.

**Every motion needs a still form that works.**
Condition: always. Reduced-motion, slow devices, and screenshots are all real.
Cost: none. Wrong when: never.

## When the design is nearly finished

**Judge the route by its weakest section.**
Condition: always. Cost: the last 30% of the work is the least fun part of it.
Wrong when: never.

**Squint at the full-page screenshot.**
Condition: always, at desktop and 390px. If the blurred page is an even texture
with no visible structure, hierarchy has failed regardless of how good the
individual sections are. Cost: none.

**Count the defects rather than assessing the vibe.**
Condition: reviewing your own output, where taste is least reliable. Misaligned
edges, inconsistent gaps between similar elements, text under the legibility
floor, overlaps, clipped controls, horizontal overflow, orphaned words. These
are objective and they are most of what separates careful work from generated
work. Cost: none. Wrong when: never.
