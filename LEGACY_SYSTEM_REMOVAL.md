# Legacy system removal

This note is repository history for maintainers. It is not part of the Dreative
skill and is not copied into an agent installation.

## What was removed

The retired editor, deterministic design engine, and v9 compatibility surface
were deleted:

- the React canvas/editor/inspector and Vite application;
- the Express preview server, queue, generated-preview pipeline, and editor
  persistence types;
- keyword-triggered aesthetics, numeric design dials, ambition-tier resolution,
  layout-family assignment, and the claim that Dreative decides while the agent
  only executes;
- `.dreative/plan.yaml` governance, migrations, approvals, and requirement IDs;
- approval provenance, contract hashes, workflow traces, and assurance levels;
- model-authored evidence ledgers, trusted-run manifests, and certification
  state;
- critic prompts, critic runners, critic schemas, and critic completion gates;
- browser-verification evidence packaging and source/build identity sealing;
- hidden `plan`, `treatments`, `doctor`, `resume`, `audit`, `verify`,
  `critic-run`, `critic-prompt`, and `config` commands;
- legacy schemas, rules, tier documents, regression fixtures, and tests that
  existed only to support those systems.

## Why it was removed

The editor and deterministic engine expressed a different product philosophy
from the current skill. They treated design as keyword routing and rule output,
while the active skill gives the coding agent responsibility for product-native
creative judgment and rendered quality. Keeping both made the repository
internally contradictory.

The governance mechanisms also added substantial implementation and maintenance
cost but did not establish independent trust. The same coding agent could write
the plan, produce the evidence, score the critic output, update the hashes, and
declare the gates satisfied. That made the artifacts internally consistent
without proving that the rendered website was good.

Dogfood runs showed that more ceremony did not reliably prevent:

- a polished hero followed by generic sections;
- weak mobile translation;
- selected treatments being present only nominally;
- insufficient rendered-page inspection;
- model-authored claims being treated as objective evidence;
- technically valid completion despite mediocre visual delivery.

The failure source was often agent execution or judgment, not missing schemas.
Adding more self-reported layers could therefore increase token use and false
confidence while leaving the visible product unchanged.

## What remains

Dreative keeps safeguards that check real or useful outcomes:

- a mandatory private implementation blueprint based on the user's choices;
- binding direction and treatment allocation with no silent downgrade;
- full-page desktop and mobile inspection;
- at least one visible correction pass;
- primary-flow and preserved-functionality checks;
- project build, test, typecheck, lint, and documentation checks;
- deterministic exact-copy verification for installed skill files;
- honest incomplete status when promised work or objective checks remain.

`DREATIVE_CHECKS_PASSED` certifies command success only. It does not certify taste,
creative quality, or truthfulness of model-authored claims.

## Why some deterministic hashes remain

The installer still hashes copied skill files. This has a narrow objective use:
detecting a missing, modified, stale, or obsolete installation. It does not
represent user approval, visual evidence, critic independence, or completion,
so it is not part of the removed fake-certification machinery.

## Reconsideration rule

Do not restore a removed system because one result is mediocre. First classify
the failure as:

1. a missing instruction;
2. the agent ignoring an existing instruction;
3. insufficient browser inspection;
4. weak model judgment;
5. unrealistic expectations for the selected direction or settings.

Only the first category normally justifies changing the skill. Restore tooling
only when it checks an objective fact the active workflow cannot check and its
trust does not depend solely on the same agent asserting its own success.
