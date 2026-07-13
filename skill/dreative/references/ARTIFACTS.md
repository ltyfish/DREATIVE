# Direct Design artifacts

Use JSON as the machine source of truth and Markdown only as its readable view.
All paths are relative to the target project.

## `.dreative/plan.json`

Required top-level fields:

- `version: 1`
- `request`, `createdAt`
- `tier`: `solid | premium | expressive | award`
- `depth`: `restyle | relayout | restructure | reimagine`
- `skills`: resolved list including `ux` and `mobile`
- `designRead`: `{ register, concept, signature }`
- `preservationManifest`: normally `.dreative/preservation.json`
- `decisionLedger`: normally `.dreative/ledger.json`
- `sections`: ordered delivery rows

Each section requires `id`, `name`, `layoutFamily`, `skills`, `interactions`,
`mobile`, `fallback`, `verification`, `assets`, and `status`. Status is
`planned | shipped | fallback | cut`; fallback/cut requires `reason`.

Each asset requires `id`, `path`, `purpose`, and `status`. A shipped asset must
exist when `dreative audit` runs.

## `.dreative/preservation.json`

```json
{
  "version": 1,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "items": [
    {
      "id": "nav-pricing",
      "kind": "link",
      "file": "src/components/Nav.tsx",
      "needle": "href=\"/pricing\"",
      "purpose": "Primary pricing navigation"
    }
  ]
}
```

Allowed kinds: `link`, `handler`, `form-field`, `visible-copy`, `state`,
`analytics-hook`, `accessibility`, `route`. Intentional changes add
`intentionallyChanged: true` and a non-empty `changeReason`.

## `.dreative/verify.json`

```json
{
  "version": 1,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "evidence": [
    {
      "id": "mobile-nav",
      "criterion": "Mobile navigation opens and closes",
      "status": "pass",
      "evidence": "Tested at 390px; Escape closes and focus returns to trigger"
    }
  ]
}
```

Every evidence row needs a real observation, command, measurement, or artifact.
`fail` blocks completion. Use `not-applicable` only with a concrete explanation.

## `.dreative/ledger.json`

The ledger is append-only design memory:

```json
{
  "version": 1,
  "entries": [
    {
      "at": "2026-01-01T00:00:00.000Z",
      "request": "Redesign landing page",
      "tier": "premium",
      "chosen": ["Editorial split with product photography"],
      "rejected": ["Bento dashboard", "Dark cinematic world"],
      "failures": [],
      "userPreferences": ["Calm motion", "No custom cursor"]
    }
  ]
}
```

Record only project-relevant design preferences and technical failures. Never
store secrets, personal notes, or unrelated conversation.

## Audit

Run `dreative audit`. It validates schemas, skill dependency closure, section
completion, shipped assets, preservation needles, verification evidence, and the
decision ledger. `--json` emits a machine-readable report.
