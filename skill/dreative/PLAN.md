# Dreative planning

Plan enough to make the implementation coherent; do not duplicate the work in
prose. The canonical output is `.dreative/plan.json`.

## 1. Resolve configuration

Use the four independent controls from `SKILL.md`: ambition, execution,
prototype, and purpose. Omitted values resolve to
Lean + Auto + Project Delivery while preserving inferred ambition. Legacy audit,
prototype, and Dogfood flags map explicitly and emit concise deprecations.

If the user has not already specified these controls, present execution,
prototype, and purpose together as concise choices before concept planning. A
user-facing task is interactive regardless of collaboration mode, Plan mode, or
structured-question-tool availability. Use the environment's structured
question tool when available; otherwise ask the same choices in plain text and
wait for the answer. Never silently default these controls on a non-trivial
design run:

```text
Execution mode:
- Lean (Recommended) — keeps the quality-driving work with proportionate evidence.
- Fast — uses the smallest safe process for early or lower-risk work.
- Full Audit — adds relevant certification, regression, and traceability evidence.

Prototype policy:
- Auto (Recommended) — usually the better balance; prototype only when a risky
  mechanism would benefit, otherwise build directly in production.
- Skip — never create a separate prototype.
- Required — always prototype the uncertain mechanism before integration.

Purpose:
- Project Delivery (Recommended) — build and verify the requested website.
- Production Certification — collect release-oriented certification evidence.
- Dreative Dogfood — evaluate Dreative's own behavior with extra diagnostics.
```

Record the selected values in `plan.configuration`. Do not silently replace a
user selection with the recommendation. Use defaults without blocking only in
genuinely headless, non-interactive automation or when the user explicitly asks
the agent to decide. The absence of a structured question tool does not make a
user-facing task non-interactive. Do not ask again when the prompt already
provides the values.

Fast is compact delivery. Lean is the normal quality workflow. Full Audit adds
relevant certification and traceability. Dreative Dogfood studies Dreative's own
behavior and is separate from certification.

## 2. Inspect the baseline

For the relevant pages, identify:

- functional and brand equity to preserve;
- design debt and structural/mobile opportunities;
- routes, workflows, states, and accessibility contracts;
- available source assets and implementation constraints.

Keep these facts in `plan.json`. Full Audit may externalize preservation records
when a later audit or human report consumes them.

## 3. Select the concept

For Expressive, Award, or Experimental work, develop up to three concise overall
directions. Each covers structure, composition, brand expression, motion, media,
mobile, and a signature moment. Select one. Do not branch every micro-effect.

Compare only plausible mechanisms. A short Canvas-versus-WebGL decision is
enough when DOM cannot alter the required pixels. Do not list technologies that
cannot satisfy the effect.

## 4. Write the compact contract

Record:

- `configuration` and independent transformation depth;
- `preflight`, then a mechanism-led `runtimeStack` with package/version/install,
  integration files, provider/ticker/scroll owner, fallback, and status;
- `skillCoverage` for every selected specialist and `runtimeBindings` for every
  shipped section, motion, interaction, and Signature Media owner;
- baseline strengths, weaknesses, and functional constraints;
- selected concept and implementation-ready page/section blueprints;
- preservation, motion, media, and mobile strategies;
- prototype decision with one short risk-based reason;
- verification requirements selected by interaction type;
- risks and any concept-specific Signature Media exemption.

If media is central, use the single `signatureMedia` contract. It names package
type, source assets, derivatives, production implementation, runtime references,
independently controlled elements/states, mobile and reduced-motion fallbacks,
performance safeguards, and visible evidence IDs.

Do not store conversation transcripts, skipped questions, repeated rationales,
three candidates for every treatment, or manually synchronized Markdown.

## 5. Execute

With `prototype=skip`, build the plan directly. With Auto, prototype only when
the shared risk policy selects it. With Required, validate the uncertain
mechanism and delete obsolete experimental code after integration.

Implement and craft the real application, run one independent critic in Lean,
make only meaningful corrections, and verify through the shared risk matrix.
Full Audit broadens relevant route/responsive/performance coverage. Dogfood may
add behavior traces and regression comparison without changing visual ambition.
