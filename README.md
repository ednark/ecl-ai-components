# ECL AI Components

AI-retrievable component registry for the [Europa Component Library (ECL)](https://ec.europa.eu/component-library/) — 29 self-contained component tiles across 24 component families, for AI coding agents building European Commission and EU institutional websites.

Implements the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol (submodule at `_base/`). Sibling to [uswds-ai-components](https://github.com/ednark/uswds-ai-components), [govuk-ai-components](https://github.com/ednark/govuk-ai-components), and [dsfr-ai-components](https://github.com/ednark/dsfr-ai-components).

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/agents.json) — manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded `ecl-agent-meta`
4. [recipes](https://raw.githubusercontent.com/ednark/ecl-ai-components/main/infinite/recipes/index.json) — patterns as atomic fetches

MCP: `npm run mcp` (9 tools). Validate: `node _base/validate-registry.mjs`.

## Coverage

**Forms:** form-group, button, text-input, text-area, select, checkbox, radio, file-upload, search-form
**Navigation:** breadcrumb, tabs, pagination, inpage-navigation, site-header, page-header, site-footer
**Feedback:** notification, highlight-box, label, expandable
**Data display:** table, card, tag, file

Recipes: contact-form, confirmation-page, search-results, content-page, news-listing.

## Compliance metadata

All tiles carry `govCompliance: ["EN 301 549", "WCAG 2.1 AA", "Directive (UE) 2016/2102"]` plus per-tile `compliance` facts (PII handling, audit-trail) and `mobileUX` facts. FedRAMP fields intentionally omitted (EU registry).

## Notes

- Tiles are EC-branded; the EU variant is derivable by swapping identity assets and colour tokens
- ECL is localised into 24 EU languages — language switching lives in the site header; markup labels here are English
- Tiles are original inline-CSS approximations, not copies of ECL source
- EU emblem / EC logo usage follows Commission identity rules — see the site-header tile
