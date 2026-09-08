# ECL AI Components

AI-retrievable component registry for the [Europa Component Library (ECL)](https://ec.europa.eu/component-library/) — 36 self-contained component tiles across 24 component families, for AI coding agents building European Commission and EU institutional websites.

Part of a family of registries implementing the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol ("the components are the database, the retrieval layer is the product").

## What This Is

Every component is a **single self-contained HTML tile**: real ECL `ecl-*` markup, inline CSS approximation, and an embedded `ecl-agent-meta` JSON block carrying categorized adaptation metadata (schema v2: discovery / selection / instruction / coordination / constraints / portability). Tiles are EC-branded; the EU variant is derivable by swapping identity assets and colour tokens.

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/agents.json) — machine manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded metadata
4. [recipes](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/recipes/index.json) — patterns as atomic fetches
5. [versions.json](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/versions.json) — version history

MCP: `npm run mcp` (9 tools). Full agent docs: [AGENTS.md](AGENTS.md) · [llms.txt](llms.txt)

## Quick start (humans)

- Browse `infinite/<component>/<variant>.html` in a browser — every tile renders standalone
- Validate: `node _base/validate-registry.mjs`

## Coverage

**Forms:** form-group, button, text-input, text-area, select, checkbox, radio, file-upload, search-form
**Navigation:** breadcrumb, tabs, pagination, inpage-navigation, site-header, page-header, site-footer
**Feedback:** notification, highlight-box, label, expandable
**Data display:** table, card, tag, file

**Recipes:** contact-form, confirmation-page, search-results, content-page, news-listing

## Compliance & domain metadata

All tiles carry `govCompliance: ["EN 301 549", "WCAG 2.1 AA", "Directive (UE) 2016/2102"]` plus per-tile compliance facts (PII handling, audit-trail) and mobileUX facts (44px touch targets). ECL-specific: 24 EU languages — language selection is a site-header concern; FedRAMP fields intentionally omitted (EU registry).

## Agent-facing docs

- [AGENTS.md](AGENTS.md) — retrieval workflow, ECL rules, quality gates
- [llms.txt](llms.txt) — the lean protocol: decision strategy, quality gates, facets, output contract
- [agents.json](agents.json) — compact machine manifest
- [compatibility.json](compatibility.json) — ECL → USWDS / GOV.UK / DSFR family maps
- [core-classes.json](infinite/core-classes.json) — documented untiled layout/typography layer
- `gaps` (registry.config.json) — declared component absences with nearest alternatives

## The registry family

| Registry | Design system | Tiles |
|---|---|---|
| [uswds-ai-components](https://github.com/ednark/uswds-ai-components) | U.S. Web Design System | 152 |
| [govuk-ai-components](https://github.com/ednark/govuk-ai-components) | GOV.UK Design System | 45 |
| [dsfr-ai-components](https://github.com/ednark/dsfr-ai-components) | Système de Design de l'État | 42 |
| **ecl-ai-components** (this repo) | Europa Component Library | 36 |
| [canada-ai-components](https://github.com/ednark/canada-ai-components) | Canada.ca Design System | 25 |
| [drupal-uswds-ai-components](https://github.com/ednark/drupal-uswds-ai-components) | USWDS on Drupal | 24 |
| [forever-ai-components](https://github.com/isas1/forever-ai-components) | Forever (origin project) | 604 |

All implement the same 5-surface protocol; cross-registry translation lives in each registry's `compatibility.json`.

## Validation

```bash
node _base/validate-registry.mjs                # full lint
node _base/validate-registry.mjs --conformance .  # spec certification
npm run build                                    # rebuild tiles + index
```

## License

Tile markup and metadata are original works (inline CSS approximations, not copies of ECL source). `ecl-*` class names and component concepts are used under the ECL's terms (ECL code: EUPL-1.2; verify usage terms for EU identity assets). Tile implementations in this registry: see LICENSE guidance in the DSFR/GOV.UK registries for the family approach.
