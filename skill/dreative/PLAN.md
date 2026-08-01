# Planning protocol

Planning has three required, blocking user-facing stages—direction, compact
configuration, and the Experience Map—plus a blocking prototype review whenever Prototype is selected
and produced, and an optional reveal of the detailed Creative Decision Brief.
The reveal is optional; creating and using the complete private brief is not.
Keep private exploration private. Do not edit implementation files until all
three stages have an explicit user response. Never silently apply recommended settings.

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
- Required — compare two or three cheap 3–8-frame visual treatment boards, then build one production-like prototype of the selected treatment before integration.

Defaults: Efficient=Skip, Recommended=Auto, Showcase=Required.

If Auto results in a prototype, or Required is selected, first show two or
three cheap visual boards that concretely show input, change, and outcome, and ask the user to
select one. Then build one production-like prototype with desktop/mobile
captures and recordings, show it, and stop for explicit user acceptance or a
revision request before integration. Build a second coded prototype only when a named
decision remains genuinely unresolved and the alternatives differ materially
in medium, interaction model, spatial structure, or mobile behavior. Changing
only input method, runtime, or polish does not justify a second build. Label
every artifact `treatment-board`, `animatic`, `production-like`, or
`integration-ready`; an animatic cannot be presented as final motion fidelity
or integrated as Showcase production evidence. Record the treatment selection
as `selectedBy: "user"`; silence or general permission is not a selection.
Record production-prototype acceptance as `prototypeReview.status: "accepted"`
and `acceptedBy: "user"`; treatment selection alone is not implementation approval.

After treatment selection, compile a treatment-translation lock before coding.
Name the selected board artifact; bind composition, focal subject,
material/lighting, type scale, transition handoff, and mobile framing to visible
prototype selectors; and list prohibited substitutions. This is not another
approval gate. It prevents a coded probe from preserving only palette and copy
while discarding the selected composition and media logic. At prototype review,
show the selected board and matched desktop/mobile captures side by side. Do not
ask for acceptance if the defining crop, realism, scale, or handoff is absent.
Use `references/TREATMENT_TRANSLATION.md` for the required categories and
side-by-side self-review.

## Stage 3: editable Experience Map

After configuration, turn the recommended concept into a short section-level
proposal the user can understand without design or animation terminology.
Include every major page or section, Dreative's recommended role, craft
intensity from 1–5, a plain journey rhythm (`Rest`, `Build`, `Peak`, or
`Release`), user agency (`Watch`, `Influence`, or `Control`), and its connection
to the surrounding journey. Explain once that 5 means flagship craft and a
meaningful transformation where appropriate; it does not mean continuous or
maximal animation. Users may choose 5 everywhere while the route retains one
Peak and deliberate quiet sections. Add one to three
targeted recommendations explaining where stronger treatment will help and
where it would create competition.

End with:

> Reply **use Dreative's recommended approach** or name section changes:
> **more animated**, **calmer**, **change layout**, **change interaction**,
> **keep static**, or add an instruction.

Wait for the reply. After acceptance, privately compile every row into
`schemas/experience-map.schema.json`: role, input state, visible start and end
states, mechanism owner, connection, desktop, mobile, reduced-motion, and
evidence target. This working map is a promise-to-implementation bridge, not an
approval receipt or a claim of visual quality. Journey-balance arithmetic is
advisory and must lead to screenshot comparison, not a taste score.
This is the user's concrete design decision, not a second approval artifact.

## Stage 4: private Creative Decision Brief and optional reveal

After direction, configuration, and the Experience Map are resolved, always complete this entire
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

Start from the accepted Experience Map. Preserve every row's role and intensity
intent while privately adding executable states, owners, handoffs, responsive
forms, fallbacks, and evidence targets. Do not force a generic architecture.

For Showcase, first write a compact production-feasibility table for every
focal subject: required medium, exact available source/tool, editing required,
responsive deliverable, rights/cost, and readiness (`executable now`, `needs a
tool`, `paid/licensed`, or `external production`). Read
`references/ASSET_PIPELINES.md`. If a treatment-defining subject cannot be
produced at the selected fidelity, stop before focal application code and ask
for the exact missing capability or an explicit treatment change. Final focal
assets, responsive crops, masks, and sequences come before the production-like
signature-scene prototype; CSS/SVG stand-ins are not temporary substitutes for
photoreal subjects. The executable production-feasibility gate records every
treatment-defining subject, exact tool/source, editing operations, desktop and
mobile deliverables, rights/cost, readiness, and repository-relative output
files. All treatment-defining subjects must be `ready`; their outputs must
exist, be tracked, and be referenced by the accepted prototype. `needs-tool`,
`paid-licensed`, or `external-production` blocks focal implementation until
resolved or the user explicitly changes the treatment. Output signatures and
extensions must match the declared medium. Desktop and mobile use distinct
files unless `responsiveMode: shared` explicitly names one responsive asset.
Each viewport binds its repository-relative output to a visible selector in the
accepted prototype through `data-dreative-asset-ref`; browser verification runs
at desktop, 390px, and 320px, checks the corresponding viewport deliverable,
and hashes the resource actually loaded by source-addressable media against the
declared output file. The data attribute is an index, not proof by itself.

Then write `schemas/showcase-mechanism.schema.json` using the
operational rules in `SKILL.md`: bind the Recommended baseline, perceptible
Showcase differences, media decisions, two or three concrete 3–8-frame
treatment boards, and one user-selected production-like prototype. Build a
second coded prototype only for a named material uncertainty. The connected
experience system must carry either meaningful shared state or one authored
physical/cinematic/material motif through pre-peak, central peak, and post-peak
regions. User Control is required only when it improves the product decision. Reference
the executable routes, captures, recordings, primary subjects, and temporal
evidence required by the schema. These are accountability inputs, not proof of
visual quality; `builderSelectionRationale` is never a reviewer verdict.

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

After the explicit Experience Map reply, implement. Do not generate another
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
