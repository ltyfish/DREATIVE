# Planning protocol

Planning has two required, blocking user-facing stages—direction and compact
configuration—plus a blocking prototype review whenever Prototype is selected
and produced, and an optional reveal of the detailed Creative Decision Brief.
The reveal is optional; creating and using the complete private brief is not.
Keep private exploration private. Do not edit implementation files until both
stages have an explicit user response. Never silently apply recommended settings.

## Stage 1: direction

Inspect the real product and read `references/CREATIVE_DIRECTION.md`. Privately
create three genuinely different concepts before assigning them to delivery
levels. They must differ in experience structure or interaction logic, not
only color, type, and effort.

Concepts come from the product, never from a shelf. Decide the type pairing,
palette construction, composition, and depth treatment from what this product is
and does. A catalogue of ready-made combinations was tried here and removed: it
went five rounds without a reviewer ever naming one of its decisions, while
costing context on every turn and risking a Dreative house style in place of the
generic one.

Show exactly:

1. **Recommended — <project-native concept>**
   The direction most likely to produce the strongest product for this
   audience, content, and implementation reality.

2. **Efficient — <focused concept>**
   The highest-value improvement using the least tokens and implementation cost,
   preserving the current structure, assets, and stack where useful.

3. **Showcase — <flagship concept>**
   The highest creative and technical ceiling. Any treatment is available, but
   select only those that materially strengthen the premise. Its delivered
   route must be visibly and structurally distinct from Recommended; a long
   conventional page with one isolated spectacle is insufficient.

Each option must name its premise, composition, material/type voice, meaningful
media or interaction, and product fit. Do not mention reference brands as the
concept. Do not offer three versions of the same editorial landing page.
Each must be the strongest honest design for its stated constraint: Efficient
is not deliberately weak, Recommended is not a diluted Showcase, and Showcase
must genuinely reach the highest coherent creative and technical ceiling.

End with:

> I recommend **<direction>**. Reply with **1, 2, or 3**. You can also say
> **show detailed plan**.

If the user asks for detail before choosing, expand Recommended by default.
This expands information only; it does not select Recommended. Wait for the
user's explicit direction choice. A general instruction such as "go ahead,"
"redesign it," or "use your judgment" is not a direction choice unless it
explicitly authorizes choosing among the three options.

## Stage 2: compact configuration

After selection, show five compact choices with direction-adapted
recommendations. End with:

> Reply **use recommended settings** or list any changes. Say **show detailed
> plan** for the full project-specific Creative Decision Brief.

Wait for the reply. Do not treat the displayed recommendations as accepted
until the user says `use recommended settings` or explicitly supplies their
choices. The prototype choice must always appear and be confirmed; for
Showcase, clearly state that `Required` means prototyping the riskiest signature
mechanism before integrating the route.

### Review depth

- Fast — production build and one focused desktop/mobile primary-flow pass.
- Lean — full-page desktop/mobile, key interactions, console/overflow/text
  integrity, and one visible correction pass.
- Full Audit — Lean plus 320px, reduced motion, performance, direct routes,
  console/network, asset failures, and final full-page regression.

Defaults: Efficient=Fast, Recommended=Lean, Showcase=Full Audit.

Full Audit increases observable review. It never adds approval hashes,
attestation, provenance, evidence ledgers, or a mandatory critic.

### References

- Follow a website, URL, image, or file supplied by the user.
- Scout and synthesize relevant references.
- Use no external reference.

Efficient uses supplied references only. Recommended uses supplied material or
a small cross-domain scout. Showcase uses supplied material plus two to four
strong references from different domains. Extract principles; never reproduce
a reference's complete visual fingerprint.
Mark each adoption as user-required or direction-recommended. A user-required
reference must be visibly implemented, or rejected only after the user
explicitly approves the rejection.

### Sources

- Existing assets only.
- Allow sourced/licensed images.
- Allow sourced and generated images; use video or 3D when useful.
- Ask before each new asset.

Efficient defaults to existing assets. Recommended chooses best-fit media.
Showcase permits maximum useful sourced/generated imagery, video, and 3D.
Mark specific user-requested assets as user-required. They must ship visibly,
or be rejected only after the user explicitly approves the rejection. Broad
permission to source media does not make every possible asset user-required.

### Packages

- Allow focused package installation.
- Keep the existing stack.
- Ask before installing.

Efficient keeps the stack. Recommended and Showcase allow packages whose
capabilities are necessary for the selected experience.

### Prototype

- Skip — build directly.
- Auto — test only a central mechanism with real uncertainty.
- Required — build the riskiest signature mechanism before integrating it.

Defaults: Efficient=Skip, Recommended=Auto, Showcase=Required.

Prototype the one mechanism whose outcome you genuinely cannot predict and whose
result would change the build. Show it rendered at desktop and mobile, say what
it does and does not yet prove, and stop for the user's response before
integrating. A general instruction to continue is not acceptance.

Keep the prototype cheap in ceremony and honest in fidelity. If it is easier to
build the real route than to build an artifact about the route, build the real
route. Do not manufacture a second comparison build unless a named decision is
still unresolved and the alternatives differ in medium, interaction model,
spatial structure, or mobile behavior — input method, runtime, or polish is not
a material difference.

The prototype exists to answer a question, not to produce evidence. Its output
is a decision and a rendered thing the user looked at; captures, recordings,
storyboards, frame counts, and fidelity labels are not required and are not
treated as proof of anything.

## Stage 3: removed

The editable Experience Map was a third blocking gate. It was removed on
2026-08-16: a clean blind round showed the arms it produced were the same
sections in the same order as a build with no skill at all, and the gate never
fired in unattended runs anyway. Do not reintroduce a section-table gate. Decide
the page shape in the private brief below and build it.

## Stage 4: private Creative Decision Brief and optional reveal

After direction and configuration are resolved, always complete this entire
project-specific brief privately before implementation. It is the working
blueprint for section allocation, treatments, assets, signature mechanisms,
continuity, mobile transformation, runtime ownership, fallbacks, and review.
Keep it current when repository inspection or prototyping changes a decision.

When `.dreative/evaluation/README.md` exists in the target project, it is an
explicit request for a compact evaluator handoff. After configuration, write
the selected direction and a concise, inspectable decision summary to the
current-run record named by that local contract. Include product observations,
the alternatives considered at a summary level, selection reasons, promises,
and material later changes with their triggers. Do not expose chain-of-thought,
private exploration, raw conversation, or scratch notes. This handoff reports
decisions; it does not replace the private brief or become an approval gate.
Record the exact branch and commit, updating `uncommitted` after the final
commit. Only paths named by the local evaluation README belong to the handoff;
remove stale untracked legacy critic, verification, certification, trace, and
evidence artifacts rather than allowing an evaluator to confuse them with the
current build.

Do not require the user to read or approve it. By default, show only the short
build brief required by `SKILL.md`, including this compact execution map:

```text
Experience arc: <hero> → <proof> → <transformation> → <decision>
Section ownership: <section → perceptible treatment or role>
Post-hero peak: <section and meaningful state change>
Continuity owner: <device that carries the concept beyond the hero>
Mobile transformation: <structural changes, not “stack everything”>
Showcase ceiling: <highest coherent mechanism/media decision and prototype result>
```

Keep it concrete and under roughly ten lines. It exposes the implementation
shape without turning the private brief into an approval or evidence artifact.
If the user says `show detailed plan`, reveal the current full brief. Do not
create a plan file, approval record, or other compliance artifact merely to
prove that the private brief exists.

Adapt every decision below to the inspected project and selected direction.
The user's explicit choices and corrections are the source of truth. Use direction
defaults and agent judgment only where the user left a decision open. Do not
reinterpret a direction label to reduce its promised scope, and do not change taste,
intensity, treatments, or page allocation merely because implementation is
harder than expected.

Ask one focused question before implementation when two plausible readings of
the user's intent would materially change a page or section, or when uncertain
whether a major section should carry an unusually intense, spatial, cinematic,
or experimental treatment. Ask again before any later material deviation from
the brief unless the user delegated that choice. Do not interrupt for routine
craft decisions the selected direction already resolves.

### 1. Product truth

Summarize audience, primary task, routes, content shape, subject vocabulary,
working behavior, valuable visual equity, assets, dependencies, defects, and
preservation.

### 2. Selected direction

Define the project-native premise, composition rule, typography, material/color
logic, media role, motion/interaction grammar, continuity device, and why they
fit. Include three decisions that could only come from this product.

### 3. Reference synthesis

For each supplied or scouted source, show only the principle being adapted and
what will deliberately differ. Confirm that no source contributes the complete
palette + type + layout + signature-motion combination.

### 4. Workflow and resources

Show Fast/Lean/Full Audit, Skip/Auto/Required, reference strategy, Sourced images,
Generated images, sourced/generated video, 3D sourcing or generation,
Packages, and actual detected capabilities. Mark recommendations.

### 5. Treatment and experience allocation

For each relevant treatment, state the project-specific use, selected/declined
decision, cost, risk, and insufficient version. Then map the selected treatments
to route sections, including a meaningful post-hero peak and the continuity
owner. User-selected treatment names or counts override direction defaults. UX and
Mobile always apply. Showcase may use any treatment but has no minimum technology
count. It requires one connected experience system: a meaningful choice or
transformation must propagate through at least three non-adjacent regions across
the pre-peak, central peak, and post-peak experience. Static grids, isolated
widgets, and thematic labels do not count.
Selection is a delivery promise, not checkbox coverage: every
selected treatment needs a named owner and perceptible contribution, although
one coherent mechanism may serve several treatments.

Decide the page's sections here — which sections exist, in what order, and why
this product needs those and not the default five. Then add executable states,
owners, handoffs, responsive forms, fallbacks, and evidence targets. Do not
force a generic architecture.

Name the **signature component** here: the one element on this route that could
not be lifted onto a competitor's page, and the one sentence saying why. It is
the requirement most often missed, and removing generic components does not
satisfy it. Name the product subject it operates on, too — the item for sale,
the document being read, the appointment being booked. A chart, log, or metrics
panel *about* the product satisfies the letter of this requirement and has twice
lost the round; it is the right answer only when the product is itself data or
developer tooling.

Name the **interaction baseline** as a separate line item, on every profile
including Efficient: the hover, focus, press, and regional-entrance grammar that
applies to the whole route. It is deliberately cheap and unoriginal, it is not
part of the signature-moment budget, and it is the thing blind review reads as
smoothness. Do not fund a second set-piece before it exists. Pick one hover
behaviour for the whole route rather than mixing four.

For every focal subject, decide the medium and where the asset actually comes
from before writing focal code. Read `references/MEDIA_SOURCES.md` for where to
look and what each licence permits, and `references/ASSET_PIPELINES.md` for
turning what you find into shippable output. Evaluate external media before
fabricating a realistic physical subject out of CSS or SVG; fabricated product
imagery is the single failure blind reviewers have called out most sharply, and
"evaluated external options" means you searched. If the selected fidelity needs a capability you do not
have, say so and name one concrete route to it — a tool, a supplied asset, or an
explicit treatment change — rather than quietly substituting geometry. Local
assets must exist in the repository and be tracked; remote assets must load.

Then write `schemas/showcase-mechanism.schema.json` using the operational rules
in `SKILL.md`: the signature component, the Recommended baseline, perceptible
Showcase differences, media decisions, and the mechanisms the browser will
exercise. The connected experience system must carry either meaningful shared
state or one authored physical/cinematic/material motif through pre-peak,
central peak, and post-peak regions. User Control is required only when it
improves the product decision.

The contract is small on purpose. It has no field for your own account of your
process, because a non-empty string is not evidence and checking one only
teaches you to write longer strings. Everything in it is exercised in a browser
or read by a human; none of it is a verdict on visual quality.

### 6. Build architecture

Name the signature mechanism, semantic fallback, runtime ownership, component
boundaries, asset pipeline, mobile transformation, accessibility behavior, and
performance budget. Use a prototype only when its result can change the build.

### 7. Review, risks, and decision

List observable review passes, material risks, and fallbacks that preserve the
concept. End with one editable decision line containing direction, review,
prototype, treatments, references, sources, packages, and missing-content
choices.

Before completion, reconcile the rendered product against this current brief.
Check every promised route, section role, treatment owner, signature mechanism,
mobile transformation, preserved behavior, fallback, and chosen review pass.
Do not call the work complete while an item is absent, imperceptible, replaced
by a weaker substitute, or unverified. Continue correcting it or report the
specific blocker and remaining scope.

For Showcase, inspect below the first peak and reject completion if the rest
could plausibly be Efficient or ordinary Recommended. Disclose:

```text
Showcase implementation attempted: <what visibly shipped>
Independent visual verdict: awaiting user review
Not pursued: <material advanced treatment rejected or replaced, and why>
```

Omit `Not pursued:` only when no material treatment was rejected or replaced.
Ask the user for the independent visual verdict; Codex cannot author it.

After the explicit configuration reply, implement. Do not generate another
approval or contract gate. The prototype-review pause above and a small
integrated experience checkpoint are the only exceptions.

For Showcase and experience-led Recommended work, checkpoint the primary peak,
its downstream consequence, and their desktop/mobile handoff before polishing.

Every substantial final handoff ends with:

```text
Implementation complete; human taste verdict: awaiting user review
```

This applies to every direction. Supply rendered views and ask for the verdict.
For opted-in evaluation, reconcile the designated record with shipped source.
