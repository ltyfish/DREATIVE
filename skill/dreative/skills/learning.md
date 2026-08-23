# Persistent dogfood learning

Use this specialist when changing Dreative itself or completing a Dreative
dogfood run.

1. Read `references/DOGFOOD_LESSONS.md` — in the Dreative repository, not in an
   installed skill — before proposing workflow, contract, critic, verification,
   or evidence changes.
2. Search existing lesson IDs before adding a rule. Prefer revising or
   superseding an existing lesson over creating a duplicate safeguard.
3. After a run, record only repeatable system failures or independently
   validated improvements. Do not paste a run report.
   Nothing round-specific ever reaches a shipped file. A lesson leaves the
   record only once it is a design failure stated without its origin — the run
   that exposed it, the scenario it used, and the dates stay here. A shipped
   file naming a scenario is how a skill starts scoring well on the harness
   without getting better at design.
4. Separate deterministic evidence, builder inference, independent review, and
   unknowns. Tests validate contracts; they do not validate taste.
5. State the added complexity and a recheck condition. Reject a safeguard whose
   maintenance, runtime, or token cost exceeds its demonstrated benefit.
6. Never promote `proposed` to `validated` from the same run that created it.
   A later real run and external verdict are required.
7. When a lesson fails, mark it `rejected` or `superseded`; preserve the reason
   so the next agent does not recreate it under a new name.

Keep `DOGFOOD_LESSONS.md` concise and canonical. Do not duplicate full lesson
records or evidence narratives in SKILL.md, PLAN.md, CHANGELOG, or generated
evaluation artifacts; operational rules derived from lessons still belong in
the workflow documents.
