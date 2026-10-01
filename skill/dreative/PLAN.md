# Directions, selection, execution

Use for open frontend design or redesign. For a scoped fix or an already chosen
design, keep that direction and do the work directly.

## Make the directions viewable

Each direction needs something the user can look at, built from real material:

1. **Generated page compositions** when an image generator is callable (Codex's
   built-in `image_gen`, or `dreative media generate` with a key). Follow `references/VISUAL_DESIGN.md`:
   front-on page at an explicit viewport, real content, opening, working middle and
   ending; sectional images when a full page becomes too small to judge.
2. **Coded studies** otherwise, or when motion is the question a still cannot answer.
   Build the direction's opening and signature moment in the real application with
   its shots (real, or declared placeholders on Claude Code without a key) and type (a `/study/<id>` route, or a page under `design/`).
   Screenshot 1440 and 390 and record it with `dreative motion-capture`. Keep each
   study small — one opening, one transformation, one glimpse of the working state —
   and write it as production code so the selected study becomes the build.

Produce the shot list before either form (SKILL step 3). HTML
mockup slideshows that will be thrown away, prompts presented as images, and
sourced references labelled as generated designs do not count as directions.

## Present

For each direction, together:

- Name, images or recording, and the idea in one sentence.
- Route: opening → development → working task → ending, with the dense content.
- Signature moment score and what has actually been demonstrated versus planned.
- Material: what was generated/sourced, what remains, and its route.
- Mobile and reduced-motion form, implementation approach, main risk, relative cost.

Two or three directions is the usual range. Each must be credible at the available
budget; never pair a polished favourite with a strawman. Recommend one with a
concrete reason, then **stop for the user's selection**. They may choose, combine
named parts, or ask for a revision (update the affected images/studies, then ask
again). An explicit instruction to choose autonomously, or an existing selection,
replaces the stop. Delivery profiles are budgets, not visual options.

If no generator can produce the subject views (Claude Code without a key), keep
them as declared placeholder shots, say which are open and what fills them (a key
with `dreative media fill`, Codex with `dreative media import`, or supplied photos),
and keep the task intact rather than swapping it for an editorial one.

## Execute the selection

Copy the selected images, study code and user edits into `.dreative/NOTE.md`.
Translate the composition into layout, type, asset roles and responsive rules
(`references/VISUAL_DESIGN.md`); a flattened mockup is not a layered asset pack, so
produce separate assets for each role.

Then follow SKILL steps 5–9: foundation, signature moment at full fidelity into its
real destination, the rest of the route including task and ending, browser review,
finalize. Compare the browser render against the selected design at matching
widths and states; correct composition, subject scale, type and spacing before
fine effects. Disclose any material deviation from the selected design.

## Budget

Spend on material, the signature moment and browser correction. Each generation
or retry should fix a named problem. After selection, generate new directions only
when the user asks. Infer routine configuration from the brief; ask only when a
missing constraint changes the outcome.
