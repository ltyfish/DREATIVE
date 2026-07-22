# Planning protocol

Planning has two required, blocking user-facing stages—direction and compact
configuration—plus an optional reveal of the detailed Creative Decision Brief.
The reveal is optional; creating and using the complete private brief is not.
Keep private exploration private. Do not edit implementation files until both
stages have an explicit user response. Never silently apply recommended settings.

## Stage 1: direction

Inspect the real product and read `references/CREATIVE_DIRECTION.md`. Privately
create three genuinely different concepts before assigning them to delivery
levels. They must differ in experience structure or interaction logic, not
only color, type, and effort.

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

### Sources

- Existing assets only.
- Allow sourced/licensed images.
- Allow sourced and generated images; use video or 3D when useful.
- Ask before each new asset.

Efficient defaults to existing assets. Recommended chooses best-fit media.
Showcase permits maximum useful sourced/generated imagery, video, and 3D.

### Packages

- Allow focused package installation.
- Keep the existing stack.
- Ask before installing.

Efficient keeps the stack. Recommended and Showcase allow packages whose
capabilities are necessary for the selected experience.

### Prototype

- Skip — build directly.
- Auto — test only a central mechanism with real uncertainty.
- Required — test the riskiest signature mechanism before integration.

Defaults: Efficient=Skip, Recommended=Auto, Showcase=Required.

## Stage 3: private Creative Decision Brief and optional reveal

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
count. It does require a meaningful pre-peak mechanism, central signature mechanism,
and post-peak mechanism or transformation; each must visibly change composition,
media, state, or interaction. Static grids with thematic labels do not count.
Selection is a delivery promise, not checkbox coverage: every
selected treatment needs a named owner and perceptible contribution, although
one coherent mechanism may serve several treatments.

For Showcase, write the compact JSON contract defined by
`schemas/showcase-mechanism.schema.json`. Bind the Recommended baseline, at
least two perceptible Showcase-only differences, two concrete product-native
media opportunities and their use/reject reasons, and an observed comparison
between one bounded prototype and one higher-ceiling media/spatial approach.
Then define exactly the real `before`, `peak`, and `after` selectors and their
triggers, experience roles, ceiling contributions, media modes, continuity
connections, mobile transformations, and differences from Recommended. The
mechanisms must span at least two perceptibly different media modes. If the
concept is a journey, process, or transformation, at least one mechanism must
be scroll-authored and visibly transform content across stages; smooth scroll
alone does not qualify. It is executable input and an accountability contract,
not proof that the visual result is good.

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

For Showcase, perform a below-hero comparison: inspect the route after its
first major peak and reject completion if those sections could plausibly be the
Efficient or ordinary Recommended direction. In the final response include two
short disclosures:

```text
Showcase ceiling delivered: <what visibly shipped>
Not pursued: <material advanced treatment rejected or replaced, and why>
```

Omit the second line only when no material treatment was considered, promised,
rejected, downgraded, or replaced. Do not turn these lines into a ledger.

After the explicit configuration reply, implement. Do not generate a second approval
or contract gate.
For an opted-in evaluation package, reconcile the decision record and final
review with the delivered source and rendered result before completion.
