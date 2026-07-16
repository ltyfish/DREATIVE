# Project map

- `src/shared/planGovernance.ts`: canonical plan v7, YAML I/O, intake, approval
  hashing and v3-v6 migrations.
- `src/cli/plan.ts`: plan lifecycle commands and exact user-facing intake.
- `src/shared/treatments.ts`: explanations, dependencies, cost, risk and tension
  metadata.
- `src/shared/experienceGates.ts`: anti-static, treatment, checkpoint and
  browser-grounded media/runtime gates.
- `src/shared/runtimeReliability.ts`: transactional package installation and
  competing owner detection.
- `src/cli/doctor.ts`: diagnosis and checkpoint-safe resume.
- `src/cli/audit.ts`: v7 fail-closed orchestration plus legacy compatibility.
- `src/cli/finalize.ts`: build/test/audit completion gate.
- `skill/dreative/schemas/plan.schema.json`: canonical v7 schema.
- `src/shared/*test.ts` and `src/cli/*test.ts`: governance, adversarial and
  regression tests.
