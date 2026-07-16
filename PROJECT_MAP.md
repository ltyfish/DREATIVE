# Project map

- `src/shared/planGovernance.ts`: canonical plan v9, all-ten decisions, stable
  intent versus mutable execution, route roles, assets, mechanism governance,
  run identity, approval hashing and v3-v8
  migrations.
- `src/cli/plan.ts`: plan lifecycle commands and exact user-facing intake.
- `src/shared/treatments.ts`: explanations, dependencies, cost, risk and tension
  metadata.
- `src/shared/preflight.ts`: permission/runtime/authoring/sourcing capability
  separation.
- `src/shared/mechanisms.ts`: structured high-ambition mechanism catalog.
- `src/shared/experienceGates.ts`: anti-static, treatment, checkpoint and
  browser-grounded media/runtime gates.
- `src/shared/runtimeReliability.ts`: transactional package installation and
  competing owner detection.
- `src/cli/doctor.ts`: diagnosis and checkpoint-safe resume.
- `src/cli/audit.ts`: v9 fail-closed orchestration plus legacy compatibility.
- `src/cli/finalize.ts`: build/test/audit completion gate.
- `skill/dreative/schemas/plan.schema.json`: canonical v9 schema.
- `src/shared/*test.ts` and `src/cli/*test.ts`: governance, adversarial and
  regression tests.
