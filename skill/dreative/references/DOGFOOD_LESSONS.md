# Dreative dogfood lessons

Read this before changing Dreative's planning, creative contracts, critic,
verification, or evidence workflow. Update it after a dog run exposes a
repeatable failure or validates a material correction.

Keep this file short. Record reusable system lessons, not run narration.
One lesson owns one ID and one current status:

- `proposed` — plausible, not yet tested;
- `validated` — independently observed in a later real run;
- `rejected` — tested and ineffective or harmful;
- `superseded` — replaced by a better validated rule.

Each entry must contain:

```text
ID / status / date
Observed failure:
Root cause:
Change:
Evidence:
Cost or trade-off:
Recheck condition:
```

Do not mark a builder assertion, generated critic report, schema pass, or test
fixture as independent validation. Deterministic tests prove only their exact
contract. A real dog run plus human verdict is required to validate taste or
creative judgment.

Do not duplicate full lesson records or evidence narratives in operational
documents. Concise rules derived from a lesson still belong in SKILL.md,
PLAN.md, schemas, and executable checks.

## Active lessons

### DL-001 / proposed / 2026-07-28

Observed failure: Bounded versus Higher Ceiling repeatedly made the lower-risk
prototype an obvious strawman.

Root cause: The options differed in polish and technical ceiling rather than in
final-worthy interaction models.

Change: Compare Best Fit with Bold Alternative. Require shared content,
equivalent desktop/mobile coverage, distinct interaction models, and both
options to be final-worthy.

Evidence: Northwind v.20.11 prototype artifacts and independent review.

Cost or trade-off: Equal-quality prototypes still consume implementation and
capture time; concept cards should eliminate weak directions before coding.

Recheck condition: Two later dog runs where users could reasonably select
either option.

### DL-002 / proposed / 2026-07-28

Observed failure: Setting every section to 5 produced uniform spectacle and
flattened the route.

Root cause: One number was interpreted as craft, motion energy, importance, and
interaction simultaneously.

Change: Keep the user-facing 1–5 craft scale, but add Rest/Build/Peak/Release
rhythm and Watch/Influence/Control agency. Exactly one section owns Peak.

Evidence: Northwind Experience Map declared ten intensity-5 sections while the
rendered route had one real centrepiece and several static sections.

Cost or trade-off: Two small internal fields are added; the user still edits
one familiar number plus plain-language roles.

Recheck condition: Next coffee dog run with all sections set to 5.

### DL-003 / proposed / 2026-07-28

Observed failure: Advanced motion passed contracts while communicating little
product meaning or changing no user decision.

Root cause: Mechanisms described visible state counts but not semantic cause,
decision consequence, or removal cost.

Change: Require product truth, cause, visible change, decision consequence, and
removal cost. Require one Control chain to affect a downstream decision region.

Evidence: Northwind thermal scan and profile propagation changed appearance
more than product choice or recommendation.

Cost or trade-off: More contract fields; offset by removing decorative
mechanisms that fail the test.

Recheck condition: A later Showcase run where removing a declared mechanism
would demonstrably reduce understanding or task outcome.

### DL-004 / proposed / 2026-07-28

Observed failure: References and media were permitted or claimed but absent
from the shipped route; stale artifacts overstated implementation.

Root cause: Permission was treated as adoption, and prose claims were not bound
to current rendered selectors.

Change: Bind reference principles and used asset media to target selectors.
Reject missing declared media during browser verification.

Evidence: Northwind plan claimed shipped documentary media while the current
source had no corresponding product image.

Cost or trade-off: Required commitments need selector maintenance after
refactors.

Recheck condition: Next run using supplied references and required imagery.

### DL-005 / proposed / 2026-07-28

Observed failure: Generated critic and deterministic evidence could reinforce
the builder's own framing instead of independently detecting taste failures.

Root cause: Self-produced reports were treated as stronger evidence than their
inputs justified.

Change: Treat builder reports and deterministic checks as scoped evidence only.
Keep human taste verdict external, and record critic misses here after review.

Evidence: Northwind critic described a coherent developed system despite clear
promise-to-implementation gaps found in source and live inspection.

Cost or trade-off: Completion can remain technically verified while taste is
explicitly pending.

Recheck condition: Compare the next critic findings with an independent human
verdict and record misses rather than rewriting the critic prompt blindly.
