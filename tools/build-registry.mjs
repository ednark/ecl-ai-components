/**
 * GOV.UK AI Components — tile builder.
 *
 * Renders self-contained tiles from tools/inventory.mjs: one HTML file per
 * variant with real GOV.UK markup, inline CSS approximation, and the full
 * v2 agent-meta block (discovery/selection/instruction/coordination/
 * constraints/portability + compliance/mobileUX).
 *
 * Usage: node tools/build-registry.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inventory, COMPLIANCE } from './inventory.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TILE_DIR = join(ROOT, 'infinite');
const FORCE = process.argv.includes('--force');

// ─── Shared CSS (GOV.UK visual language approximation) ───────────────────────

const BASE_CSS = `
body{font-family:Arial,Helvetica,sans-serif;font-size:1rem;line-height:1.5rem;color:#404040;padding:2rem;background:#fff;margin:0}
.cap{position:fixed;bottom:12px;left:16px;font-size:11px;letter-spacing:.08em;color:#707070;text-transform:uppercase}
a,.ecl-link{color:#004494;text-decoration:underline}
:focus-visible{outline:3px solid #ffd617;outline-offset:1px;box-shadow:0 0 0 2px #404040}
.ecl-visually-hidden{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.ecl-form-label{display:block;font-weight:700;font-size:.875rem;margin-bottom:.5rem;color:#404040}
.ecl-help-block{font-size:.875rem;color:#404040;margin:.25rem 0}
.ecl-feedback-message{font-weight:700;font-size:.875rem;color:#cc0000;margin-top:.5rem}
`;

const CSS = {
  'button': `.ecl-button{font:inherit;display:inline-block;padding:.5rem 1.25rem;border-radius:.25rem;border:1px solid #004494;background:#004494;color:#fff;cursor:pointer;text-decoration:none}
.ecl-button:hover{background:#003776}
.ecl-button--secondary{background:#fff;color:#004494}
.ecl-button--secondary:hover{background:#eef3fb}
.ecl-button--ghost{background:none;border-color:transparent;color:#004494;text-decoration:underline}
.ecl-button__container{display:inline-flex;align-items:center;gap:.5rem}
`,
  'form-group': `.ecl-form-group{margin-bottom:1.25rem;max-width:30rem}
.ecl-form-group--error{padding-left:.75rem;border-left:4px solid #cc0000}
.ecl-text-input,.ecl-text-area,.ecl-select,.ecl-file-upload{font:inherit;display:block;width:100%;box-sizing:border-box;padding:.5rem .75rem;border:1px solid #404040;border-radius:.25rem;color:#161616;background:#fff}
.ecl-text-input:focus,.ecl-text-area:focus,.ecl-select:focus,.ecl-file-upload:focus{outline:3px solid #ffd617}
.ecl-text-input--error,.ecl-text-area--error,.ecl-select--error,.ecl-file-upload--error{border:2px solid #cc0000}
.ecl-text-area{min-height:8rem}
`,
  'text-input': `.ecl-form-group{margin-bottom:1.25rem;max-width:30rem}
.ecl-text-input{font:inherit;display:block;width:100%;box-sizing:border-box;padding:.5rem .75rem;border:1px solid #404040;border-radius:.25rem;color:#161616;background:#fff}
.ecl-text-input:focus{outline:3px solid #ffd617}
`,
  'text-area': `.ecl-form-group{margin-bottom:1.25rem;max-width:30rem}
.ecl-text-area{font:inherit;display:block;width:100%;box-sizing:border-box;padding:.5rem .75rem;border:1px solid #404040;border-radius:.25rem;min-height:8rem}
.ecl-text-area:focus{outline:3px solid #ffd617}
`,
  'select': `.ecl-form-group{margin-bottom:1.25rem;max-width:30rem}
.ecl-select{font:inherit;display:block;width:100%;padding:.5rem .75rem;border:1px solid #404040;border-radius:.25rem;background:#fff}
.ecl-select:focus{outline:3px solid #ffd617}
`,
  'checkbox': `.ecl-form-group{margin-bottom:1.25rem}
.ecl-checkbox{display:block;position:relative;padding-left:2rem;cursor:pointer;margin-bottom:.5rem}
.ecl-checkbox__input{position:absolute;opacity:0;width:20px;height:20px;margin:0}
.ecl-checkbox__box{position:absolute;left:0;top:2px;width:18px;height:18px;border:2px solid #404040;border-radius:.15rem;background:#fff}
.ecl-checkbox__input:checked+.ecl-checkbox__box{background:#004494;box-shadow:inset 0 0 0 2px #004494}
.ecl-checkbox__input:checked+.ecl-checkbox__box:after{content:"✓";position:absolute;left:2px;top:-2px;color:#fff;font-weight:700}
.ecl-checkbox__input:focus+.ecl-checkbox__box{outline:3px solid #ffd617}
`,
  'radio': `.ecl-form-group{margin-bottom:1.25rem}
.ecl-radio{display:block;position:relative;padding-left:2rem;cursor:pointer;margin-bottom:.5rem}
.ecl-radio__input{position:absolute;opacity:0;width:20px;height:20px;margin:0}
.ecl-radio__box{position:absolute;left:0;top:2px;width:18px;height:18px;border:2px solid #404040;border-radius:50%;background:#fff}
.ecl-radio__input:checked+.ecl-radio__box{border-color:#004494}
.ecl-radio__input:checked+.ecl-radio__box:after{content:"";position:absolute;left:3px;top:3px;width:8px;height:8px;border-radius:50%;background:#004494}
.ecl-radio__input:focus+.ecl-radio__box{outline:3px solid #ffd617}
`,
  'file-upload': `.ecl-form-group{margin-bottom:1.25rem;max-width:30rem}
.ecl-file-upload{font:inherit}
.ecl-file-upload:focus{outline:3px solid #ffd617}
`,
  'search-form': `.ecl-search-form{display:flex;max-width:30rem}
.ecl-search-form__label{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ecl-search-form__textfield-wrapper{flex:1}
.ecl-search-form__textfield{width:100%;font:inherit;padding:.5rem .75rem;border:1px solid #404040;border-radius:.25rem 0 0 0;box-sizing:border-box}
.ecl-search-form__button{border-radius:0 .25rem 0 0}
`,
  'breadcrumb': `.ecl-breadcrumb{margin:1rem 0}
.ecl-breadcrumb__container{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.25rem;font-size:.875rem}
.ecl-breadcrumb__segment:not(:first-child):before{content:"›";margin-right:.25rem;color:#707070}
.ecl-breadcrumb__link{color:#004491}
.ecl-breadcrumb__segment[aria-current=page]{color:#404040}
`,
  'tabs': `.ecl-tabs__list{list-style:none;margin:0;padding:0;display:flex;gap:.25rem;border-bottom:1px solid #ddd}
.ecl-tabs__tab{font:inherit;color:#004491;background:#f2f5f9;border:1px solid #ddd;border-bottom:0;padding:.5rem 1rem;cursor:pointer;text-decoration:underline;border-radius:.25rem .25rem 0 0}
.ecl-tabs__tab--active{background:#fff;font-weight:700;border-bottom:1px solid #fff;margin-bottom:-1px;text-decoration:none}
.ecl-tabs__panel{padding:1rem 0}
`,
  'pagination': `.ecl-pagination__list{list-style:none;margin:1rem 0;padding:0;display:flex;gap:.25rem}
.ecl-pagination__link{display:inline-block;padding:.25rem .5rem;color:#004491;text-decoration:underline;border:1px solid transparent}
.ecl-pagination__link[aria-current=page]{background:#004494;color:#fff;text-decoration:none;font-weight:700}
`,
  'inpage-navigation': `.ecl-inpage-navigation{background:#f2f5f9;padding:1rem;max-width:24rem;margin-bottom:1.5rem}
.ecl-inpage-navigation__title{font-weight:700;margin:0 0 .5rem;font-size:.875rem}
.ecl-inpage-navigation__list{list-style:none;margin:0;padding:0;font-size:.875rem}
.ecl-inpage-navigation__list li{margin:.25rem 0}
`,
  'site-header': `.ecl-site-header{margin:-2rem -2rem 2rem;border-bottom:4px solid #ffd617}
.ecl-site-header__banner{background:#004494;padding:.5rem}
.ecl-site-header__banner .ecl-container{display:flex;justify-content:space-between;align-items:center;max-width:78rem;margin:0 auto;padding:0 1rem}
.ecl-site-header__logo-link{text-decoration:none}
.ecl-site-header__selector-link{color:#fff;font-size:.875rem;text-decoration:underline}
.ecl-site-header__content{background:#fff;padding:.75rem}
.ecl-site-header__content .ecl-container{max-width:78rem;margin:0 auto;padding:0 1rem}
.ecl-site-header__site-name{margin:0;font-weight:700;font-size:1.25rem;color:#161616}
`,
  'page-header': `.ecl-page-header{border-bottom:1px solid #ddd;padding-bottom:1rem;margin-bottom:1.5rem}
.ecl-page-header__meta{font-size:.875rem;color:#707070;margin:0 0 .5rem}
.ecl-page-header__title{font-size:2rem;margin:0 0 .5rem;color:#161616}
.ecl-page-header__description{margin:0;color:#404040}
`,
  'site-footer': `.ecl-site-footer{background:#f5f5f5;border-top:4px solid #004494;margin:3rem -2rem -2rem;padding:1.5rem}
.ecl-site-footer .ecl-container{max-width:78rem;margin:0 auto;padding:0 1rem}
.ecl-site-footer__title{font-weight:700;margin-bottom:.75rem;color:#161616}
.ecl-site-footer__info-line{font-size:.875rem;margin:.25rem 0}
`,
  'notification': `.ecl-alert{display:flex;gap:1rem;padding:1rem 1.5rem;margin-bottom:1rem;border-left:6px solid #375da0;background:#eef3fb}
.ecl-alert--success{border-left-color:#2e7d32;background:#eaf5ea}
.ecl-alert--error{border-left-color:#cc0000;background:#fdeaea}
.ecl-alert--warning{border-left-color:#e6a501;background:#fdf3e2}
.ecl-alert__title{font-weight:700;margin:0 0 .25rem}
.ecl-alert p{margin:0}
`,
  'highlight-box': `.ecl-highlight-box{border:2px solid #004494;padding:1rem 1.5rem;margin:1rem 0}
`,
  'label': `.ecl-label{display:inline-block;font-size:.75rem;font-weight:700;padding:.125rem .5rem;border-radius:.25rem;margin:0 .25rem .25rem 0;background:#f2f5f9;color:#404040;border:1px solid #cfd8e5}
.ecl-label--high{background:#fdeaea;color:#cc0000;border-color:#cc0000}
.ecl-label--medium{background:#fdf3e2;color:#b34000;border-color:#b34000}
.ecl-label--low{background:#eaf5ea;color:#2e7d32;border-color:#2e7d32}
`,
  'expandable': `.ecl-expandable{margin:1rem 0}
.ecl-expandable__toggle{font:inherit;color:#004494;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer}
.ecl-expandable__content{padding:.75rem 0}
`,
  'table': `.ecl-table table{width:100%;border-collapse:collapse;margin:1rem 0}
.ecl-table__caption{font-weight:700;text-align:left;margin-bottom:.5rem}
.ecl-table__header{text-align:left;font-weight:700;padding:.5rem .75rem;border-bottom:2px solid #404040}
.ecl-table__cell{padding:.5rem .75rem;border-bottom:1px solid #ddd}
`,
  'card': `.ecl-card{border:1px solid #ddd;border-radius:.25rem;max-width:24rem;background:#fff;overflow:hidden}
.ecl-card__content{padding:1rem}
.ecl-card__label{font-size:.75rem;color:#707070;margin-bottom:.25rem}
.ecl-card__title{font-size:1.125rem;margin:0 0 .5rem}
.ecl-card__link{color:#004494}
.ecl-card__description{margin:0;font-size:.875rem;color:#404040}
`,
  'tag': `.ecl-tag-group{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
.ecl-tag{display:inline-block;padding:.25rem .75rem;border-radius:1rem;background:#f2f5f9;color:#004491;font-size:.875rem;border:1px solid #cfd8e5;text-decoration:none;font:inherit}
button.ecl-tag,a.ecl-tag{cursor:pointer}
button.ecl-tag[aria-pressed=true]{background:#004494;color:#fff;border-color:#004494}
`,
  'file': `.ecl-file{margin:1rem 0;padding:.75rem 0;border-bottom:1px solid #ddd;max-width:30rem}
.ecl-file__title{color:#004494;text-decoration:underline}
.ecl-file__meta{font-size:.75rem;color:#707070;display:flex;gap:.75rem;margin-top:.25rem}
`
};


// ─── Cost model (same calibration as the USWDS registry) ────────────────────

function costDefaults(bytes, requiresJs) {
  const estimatedTokens = Math.ceil(bytes / 4);
  let costTier;
  if (requiresJs === 'required') costTier = estimatedTokens > 2000 ? 'expensive' : 'moderate';
  else if (requiresJs === 'optional') costTier = 'moderate';
  else costTier = estimatedTokens > 1000 ? 'moderate' : 'cheap';
  const renderingTimeMs = requiresJs === 'required' ? 60 : requiresJs === 'optional' ? 35 : 15;
  const recommendedModel = costTier === 'expensive' ? 'sonnet' : 'haiku';
  return { costTier, estimatedTokens, renderingTimeMs, recommendedModel };
}

// ─── Recipe membership ───────────────────────────────────────────────────────

const recipeMembership = {};
try {
  const recipesDir = join(TILE_DIR, 'recipes');
  for (const item of readdirSync(recipesDir)) {
    if (!item.endsWith('.json') || item === 'index.json') continue;
    const recipe = JSON.parse(readFileSync(join(recipesDir, item), 'utf-8'));
    for (const c of recipe.components || []) {
      (recipeMembership[c.component] ||= []).push(recipe.recipe);
    }
  }
} catch {
  console.log('(no recipes yet — compositionRecipes skipped)');
}

// ─── Meta assembly ───────────────────────────────────────────────────────────

function buildMeta(component, variant, relPath, html) {
  const bytes = Buffer.byteLength(html, 'utf-8');
  const cost = costDefaults(bytes, component.requiresJs);
  const requiresJs = component.requiresJs;
  const isInteractive = (component.interaction || []).length > 0;

  const coord = {
    prerequisiteComponents: component.prerequisites || [],
    incompatibleWith: component.incompatibleWith || [],
    compositionCost: cost,
  };
  if (component.agentPromptSequence) coord.agentPromptSequence = component.agentPromptSequence;
  const memberOf = [...new Set(recipeMembership[component.dir] || [])];
  if (memberOf.length) coord.compositionRecipes = memberOf;

  const meta = {
    _schemaVersion: 2,
    discovery: {
      eclComponentType: component.dir,
      eclClass: component.cls,
      section: component.section,
      variant: variant,
      requiresJs,
      interaction: component.interaction || [],
      a11y: {
        wcag21AA: true,
        keyboardNav: isInteractive,
        screenReader: true,
        reducedMotion: true,
        forcedColors: true,
        ariaAttributes: true,
      },
      govCompliance: COMPLIANCE,
      tier: 'curated',
      tags: component.tags,
      description: component.description,
      compliance: {
        nistControls: [],
        en301549: true,
        wcag21AA: true,
        webAccessibilityDirective: true,
        piiHandling: component.pii || 'none',
        auditTrailCompatible: component.audit || false,
        dataMaskingCompatible: component.dir === 'text-input',
      },
      mobileUX: {
        touchTargetSize: isInteractive ? '44px' : 'n/a',
        requiredMinSpacing: '8px',
        orientationLocked: false,
        fullscreenSafe: true,
      },
    },
    selection: {
      useWhen: component.useWhen,
      avoidWhen: component.avoidWhen,
    },
    instruction: {
      agentPrompt: component.agentPrompt,
      relatedComponents: component.related || [],
    },
    coordination: coord,
    constraints: {
      preserve: component.preserve,
      editable: component.editable,
      limitations: component.limitations,
      portableInvariants: component.invariants,
    },
    supportedTokenProfiles: ['highContrast'],
    file: relPath,
    title: `${component.name} (${variant})`,
  };

  if (component.classMappingUswds) {
    meta.portability = {
      classMapping: { uswds: component.classMappingUswds },
    };
  }
  return meta;
}

// ─── Tile rendering ──────────────────────────────────────────────────────────

function renderTile(component, variant, relPath, markup) {
  const meta = buildMeta(component, variant.variant, relPath, markup);
  const description = `Europa Component Library ${component.name.toLowerCase()} demonstrating the ${variant.variant} variant.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${component.name} (${variant.variant})</title>
<script type="application/json" id="ecl-agent-meta">
${JSON.stringify(meta, null, 2)}
</script>
<style>${BASE_CSS}
${CSS[component.dir] || ''}
</style>
</head>
<body>
${markup}
<div class="cap">${component.dir} ${variant.variant}</div>
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let written = 0;
for (const component of inventory) {
  const variants = component.variants || [
    { file: 'default', variant: 'default', desc: component.description, markup: component.defaultMarkup },
  ];
  const dir = join(TILE_DIR, component.dir);
  mkdirSync(dir, { recursive: true });
  for (const variant of variants) {
    const markup = variant.markup ?? component.defaultMarkup;
    if (!markup) {
      console.error(`  ✗ ${component.dir}/${variant.file}: no markup`);
      continue;
    }
    const relPath = `${component.dir}/${variant.file}.html`;
    const outPath = join(TILE_DIR, relPath);
    if (!FORCE && existsSync(outPath)) continue; // hand-edited tiles survive re-runs
    writeFileSync(outPath, renderTile(component, variant, relPath, markup));
    written++;
    console.log(`  ✓ ${relPath}`);
  }
}
console.log(`\nWrote ${written} tiles (${inventory.length} components)`);
