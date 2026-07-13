# Direct Design artifacts

Use JSON as the machine source of truth and Markdown only as its readable view.
All paths are relative to the target project.

## `.dreative/plan.json`

Required top-level fields:

- `version: 2`
- `request`, `createdAt`
- `tier`: `solid | premium | expressive | award`
- `depth`: `restyle | relayout | restructure | reimagine`
- `skills`: user-approved, dependency-resolved pool including `ux` and `mobile`
- `skillPolicy`: hybrid routing policy, global foundations, explicit user page
  assignments, and `routingApproved: true`
- `designRead`: `{ register, concept, signature }`
- `preservationManifest`: normally `.dreative/preservation.json`
- `decisionLedger`: normally `.dreative/ledger.json`
- `pages`: ordered pages, each with its assigned skills and delivery sections

Every selected skill must appear on at least one page. Every page includes `ux`
and `mobile`, but optional treatments are assigned only where they serve that
page. A section may use only skills assigned to its parent page.

Each section requires `id`, `name`, `layoutFamily`, `skills`, `interactions`,
`mobile`, `fallback`, `verification`, `assets`, and `status`. Status is
`planned | shipped | fallback | cut`; fallback/cut requires `reason`.

Each asset requires `id`, `path`, `purpose`, and `status`. A shipped asset must
exist when `dreative audit` runs.

### Routing authority

The user's selection is authoritative. Routing may place selected-but-unassigned
skills and suggest additional treatments, but it never activates an unselected
optional skill. Explicit page assignments always win. If the user selects all,
all ten skills appear in the overall plan; this does not mean all ten belong on
every page. Show the proposed page matrix and obtain approval before setting
`routingApproved: true`.

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

Schema: `schemas/verify.schema.json`.

```json
{
  "version": 1,
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "evidence": [
    {
      "id": "mobile-nav",
      "criterion": "Mobile navigation opens and closes",
      "status": "pass",
      "evidence": "Escape closes and focus returns to trigger",
      "proof": {
        "timestamp": "2026-01-01T00:00:00.000Z",
        "artifactPath": ".dreative/screenshots/mobile-nav.png",
        "viewport": { "width": 390, "height": 844, "dpr": 2 },
        "testedUrl": "http://localhost:3000",
        "consoleErrorCount": 0,
        "playwrightTestId": "navigation closes with Escape"
      }
    }
  ]
}
```

Every evidence row requires a timestamp and concrete proof: an existing artifact
path, command + exit code, tested URL/console count, FPS/frame-time measurement,
or Playwright test identifier. `dreative audit` checks referenced artifact paths
and rejects passing commands with nonzero exits or passing runs with console
errors. `fail` blocks completion. Use `not-applicable` only with a concrete
explanation and proof of why the criterion does not apply.

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
