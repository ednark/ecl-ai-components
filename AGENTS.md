# AGENTS.md — ECL AI Components

## What This Is

A structured component knowledge base for AI coding agents building European Commission and EU institutional websites with the Europa Component Library (ECL). 29 component tiles across 24 component families, with categorized adaptation metadata (schema v2), coordination metadata, pattern recipes, and compliance facts (EN 301 549 / WCAG 2.1 AA / Directive (EU) 2016/2102).

Tiles are EC-branded; EU-branded variants are derivable by swapping identity assets and colour tokens. ECL is localised into 24 EU languages — markup labels here are English, language selection is a site-header concern.

## How to Query This Registry

1. **Manifest:** https://raw.githubusercontent.com/ednark/ecl-ai-components/main/agents.json
2. **Index:** https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/components.index.json
3. **Facets:** https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/facets.json
4. **Tile pattern:** https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/{file}

## Workflow

1. Fetch the index (lean — discovery facets + lean summaries only)
2. Filter in code by section, eclComponentType, requiresJs, a11y, govCompliance, costTier, prerequisites, compositionRecipes
3. **Recipe check:** published patterns (contact-form, confirmation-page, search-results, content-page, news-listing) — fetch `infinite/recipes/{name}.json` first
4. Fetch only the chosen tiles
5. Parse the `ecl-agent-meta` JSON block inside each tile
6. Check `_schemaVersion` — v2 categories:
   - `discovery` — facets (index carries them; compliance/mobileUX blocks are tile-side)
   - `selection` — `useWhen` / `avoidWhen`
   - `instruction` — `agentPrompt`
   - `coordination` — `prerequisiteComponents` (fields need `form-group` first), `compositionCost`, `agentPromptSequence`, `compositionRecipes`
   - `constraints` — `preserve` / `editable` / `limitations` / `portableInvariants`
   - `portability` — `classMapping` for uswds + govuk + dsfr substitution
7. Adapt within `constraints`; verify `constraints.preserve` in output

## ECL-Specific Rules

- Every field sits inside an `ecl-form-group` — fetch `form-group` first (see `coordination.prerequisiteComponents`)
- Errors use `ecl-feedback-message` inside the group (no page-level error summary in ECL)
- Buttons carry the `ecl-button__container > ecl-button__label` structure — keep it for icon support
- Use EN 301 549 (harmonized WCAG 2.1 AA) — check `govCompliance`
- The EU emblem and EC logo usage follow Commission identity rules — never restyle identity assets
- ECL is 24-language: keep text externalisable; language switching lives in the site header

## Cross-Registry Transfer

- `portability.classMapping` covers uswds + govuk + dsfr for simple cases (button, text-input, select, notification, table, breadcrumb, tag)
- `compatibility.json` holds family-level maps for all three targets with mismatch notes
- Validate output against `constraints.portableInvariants`

## MCP Server

`node _base/mcp/server.mjs` (or `npm run mcp`) — 9 tools: `search_components`, `get_component`, `list_facets`, `get_index`, `get_adapter`, `translate_component`, `get_recipe`, `query_compliance`, `get_versions`

CLI: `node _base/validate-registry.mjs` (lint), `--conformance .` (certification)


## Quality gates and declared gaps

Do not retrieve or deploy a component that:

- Has `costTier: "expensive"` unless the task explicitly requires the richer behavior
- Has `requiresJs: "required"` when the delivery context has no JavaScript
- Whose `constraints.knownLimitations` block the delivery context
- Implements a concept declared in `gaps` (registry.config.json) — use the gap's nearestAlternative; never invent component-style classes
- Needs layout or typography classes outside the tiles — use `infinite/core-classes.json`

Registry mandates that act as gates:

- Content is localised into 24 EU languages — language selection lives in the site header
- Check `govCompliance` (EN 301 549 / WCAG 2.1 AA / Directive (EU) 2016/2102)
- EU emblem and EC logo are governed identity assets — never restyle

## Constraint Priority

1. `constraints.preserve` — NEVER modify
2. `constraints.limitations` — respect
3. `instruction.agentPrompt` — adapt within boundaries
4. `constraints.editable` — prefer

## Version Sync

This registry is a faithful snapshot of **ECL 5.3.1** (`designSystem.version` in
`registry.config.json`). Ground truth is `@ecl/preset-eu` — installed as an
**exact** devDependency (5.3.1) and declared to `staticView.classCheck`, so
class drift is caught automatically by `validate-registry.mjs`.

- ECL ships 95 per-component packages as **SCSS only**; the preset is the only
  compiled bundle and therefore the only class surface that can be verified
  mechanically.
- `staticView.classCheck.allowlist` holds the **known drift register** (40
  entries as of 2026-09-29): classes the tiles use that ECL 5.3.1 does not
  define — mostly pre-5.x element classes. Each entry carries its rework reason.
- 18 of 36 tiles are verified and version-stamped; the 18 drifted tiles are
  deliberately **unstamped** — their rework needs the official twig templates
  that ship in the component packages, not CSS inference.
- **Upgrading ECL**: follow the runbook in `_base/protocol.md` ("Design-System
  Version Sync"). Bump the pin + the exact devDependency, regenerate, read the
  classCheck errors and the stamp worklist, apply cited corrections through the
  purity path, then record the event in `versions.json`.


## Before you change a tile: read the findings ledger

`infinite/findings.json` is this registry's epistemic record — what was tested,
what broke, and what changed. It is the highest-leverage file here for one
reason: it records the fixes, so they do not get undone by an agent that reads
a drift register without knowing it is a register.

Check the ledger before:
- editing a tile body (a pre-migration class is not a gap — `changed` says so)
- removing a class from the classCheck allowlist (it may be canonical markup the
  stylesheet simply does not style)
- changing an `origin` label, a stamp, or a `gaps` entry
- retiring a family (it may be deprecated upstream rather than unused)

A summary is generated at `registry-health.json` under `findings`, including
`openItems` — findings that broke something and have no recorded change.
Those are the open items; they should be closed with a fix, or re-scoped.
See `_base/findings-ledger.md` for the schema.
