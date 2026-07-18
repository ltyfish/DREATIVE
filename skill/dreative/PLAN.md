# Planning protocol

Planning has three stages: direction, compact configuration, and an optional
detailed Creative Decision Brief.

## Stage 1: direction

Inspect the actual project first. Show exactly three project-specific creative
directions in this format:

1. **Recommended — <concept name>**
   The direction the agent believes will produce the strongest result for this
   specific product.

2. **Efficient — <concept name>**
   The most token- and implementation-efficient direction: small, high-value
   changes using the current structure, assets, and stack wherever possible.

3. **Showcase — <concept name>**
   The absolute highest creative and technical ceiling. This direction plans
   all ten treatments—UX, Mobile, Refined, Motion, Interaction, Media, 3D,
   Immersive, Cinematic, and Experimental—inside one coherent hierarchy.

Each description must be concrete: visual language, composition, meaningful
media/interaction idea, and product fit. Do not show generic preset prose.

End with:

> I recommend **<direction>**. Reply with **1, 2, or 3**. You can also say
> **show detailed plan**.

If the user requests detail before choosing, expand Recommended by default and
offer to expand Efficient or Showcase instead.

## Stage 2: compact configuration

After the user selects a direction, show these choices in a short, scannable
form. Mark recommendations based on the selected direction. End with:

> Reply **use recommended settings** or list any changes. Say **show detailed
> plan** for the full project-specific Creative Decision Brief.

### Review depth

- Fast—production build and one focused desktop/mobile primary-flow pass.
- Lean—full-page desktop/mobile, key interactions, console/overflow/text
  integrity, and a correction pass.
- Full Audit—Lean plus 320px, reduced motion, performance, route/direct-load,
  console/network, and final full-page regression.

Defaults: Efficient=Fast, Recommended=Lean, Showcase=Full Audit.

Full Audit is practical verification depth. It does not require approval
hashes, attestation, provenance records, independent critics, or evidence
bureaucracy.

### References

- Follow a website, URL, or file the user provides.
- Scout and adapt principles from relevant references.
- Use no external reference.

Defaults: Efficient uses supplied references only. Recommended uses supplied
references or a small relevant scout. Showcase uses supplied references and
scouts strong relevant examples. Adapt principles; never copy a site.

### Sources

Keep this compact while allowing the user to override:

- Existing assets only.
- Allow sourced/licensed images.
- Allow sourced and generated images; use video/3D if useful.
- Ask before each new asset.

If the user needs finer control, separately resolve sourced images, generated
images, sourced video, generated video, and 3D sourcing/generation in the
detailed brief.

Defaults: Efficient=existing assets. Recommended=best-fit sourced/generated
images with video/3D only when earned. Showcase=maximum useful sourced/generated
images/video and 3D.

### Packages

- Allow focused package installation.
- Keep the existing stack.
- Ask before installing.

Defaults: Efficient keeps the existing stack. Recommended and Showcase allow
focused installation.

### Prototype

- Skip—build directly.
- Auto—prototype only a genuinely uncertain signature mechanism.
- Required—prototype the riskiest signature mechanism before integration.

Defaults: Efficient=Skip, Recommended=Auto, Showcase=Required.

## Stage 3: detailed Creative Decision Brief

Only show this when the user asks for `show detailed plan`. Adapt every block to
the inspected project and selected direction. The supplied Northwind brief is
the structural model, not reusable content.

### 1. Current state

Summarize routes, sections, working interactions, existing visual equity,
assets, dependencies, broken behavior, encoding defects, and what will be
preserved or intentionally changed.

### 2. Selected direction

Name and fully describe:

- palette/material;
- typography;
- composition;
- media;
- motion;
- interaction;
- why it fits the content and audience.

The plan must change with the direction:

- Recommended shows the agent's best project-specific combination.
- Efficient shows restrained, low-token, low-dependency decisions and small
  changes.
- Showcase makes maximum/all-treatment decisions and distributes high-end
  behavior beyond the hero.

### 3. Workflow and source choices

Show all alternatives and mark the recommendations for:

- Fast / Lean / Full Audit;
- Skip / Auto / Required prototype;
- specific supplied reference / scout references / no reference;
- sourced images;
- generated images;
- sourced video;
- generated video;
- 3D sourcing/generation;
- package installation.

Do not show Purpose, Production Certification, Dogfood, assurance, or
attestation controls.

### 4. Treatment decision guide

Show all ten treatments with project-specific:

- proposed select/decline decision;
- what it changes;
- substantive threshold;
- dependencies and tensions;
- cost and mobile/performance/accessibility risk;
- what would be insufficient.

UX and Mobile are mandatory. Recommended chooses the best combination.
Efficient normally uses UX, Mobile, and Refined. Showcase selects all ten and
must resolve their tensions rather than pruning them.

### 5. Experience allocation

Show route/section order, experience role, primary/supporting treatments,
continuity owner, a meaningful post-hero peak, and the hero-removed test. Add a
compact tension table for task access, motion control, touch/keyboard, mobile
cost, media loading, readability, and experimental clarity.

### 6. Capability and source preflight

Report what is actually available or missing:

- current runtime and packages;
- browser verification;
- supplied assets;
- reference inputs;
- image sourcing/generation/editing;
- video sourcing/generation/processing;
- 3D runtime/assets/authoring;
- missing content/assets.

Permission is a user choice; capability is detected reality.

### 7. Risks, fallbacks, and decision reply

Explain the material visual, mobile, performance, accessibility, asset, and
mechanism risks. Give fallbacks that preserve the direction. End with one
editable line containing the selected direction, review depth, prototype,
treatments, references, sources, packages, and material missing-content
decisions.

After the user sends the line, implement. Do not generate another executable
contract or request a second approval.

## Northwind direction example

Choose a redesign direction:

1. **Recommended — Nordic Roastery Journal**
   Editorial, tactile, and distinctly Bergen: warm paper tones, deep ink,
   oxblood accents, bold serif typography, product imagery, and a brewing-guide
   timeline. Preserves every product, link, and form while making the brand
   feel premium and credible.

2. **Efficient — Modern Coffee Market**
   Clean Scandinavian commerce with compact navigation, crisp product cards,
   clear pricing, restrained motion, and a faster shopping-focused layout.

3. **Showcase — From Harbor to Cup**
   The absolute best version: a cinematic story around the 1962 Probat, coastal
   atmosphere, oversized typography, layered sourced/generated media, spatial
   depth, rich interaction, and all treatments distributed through the route.

I recommend **Nordic Roastery Journal**. Reply with **1, 2, or 3**. You can also
say **show detailed plan**.
