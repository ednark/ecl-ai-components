/**
 * ECL AI Components — component inventory.
 *
 * Each component declares its variants (real ECL `ecl-` markup), metadata for
 * the v2 categorized schema, coordination, and compliance facts. The builder
 * (build-registry.mjs) turns this into self-contained tiles.
 *
 * Note: ECL ships two branded variants — EC (European Commission) and EU
 * (European Union). Tiles here use the EC identity; EU-branded tiles can be
 * derived by swapping the logo/colour tokens. Component metadata is in
 * English; markup labels are in English (ECL is localised into 24 EU
 * languages — language selection is a site-header concern).
 */

export const COMPLIANCE = ["EN 301 549", "WCAG 2.1 AA", "Directive (EU) 2016/2102"];

export const inventory = [
  // ─── FORMS ────────────────────────────────────────────────────────────────
  {
    dir: "form-group",
    name: "Form group",
    cls: "ecl-form-group",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus"],
    pii: "none",
    audit: false,
    useWhen: [
      "Wrapping any form control with its label, help block, and feedback message",
      "The prerequisite container every ECL field expects"
    ],
    avoidWhen: ["Styling inputs without labels — ECL forbids unlabelled fields"],
    agentPrompt: "Keep the ecl-form-group wrapper; add ecl-form-group--error plus an ecl-feedback-message when the field fails validation.",
    preserve: [
      ".ecl-form-group wrapper around label + control",
      "Label 'for' attribute matching the input id",
      "aria-describedby linking help/feedback ids to the control"
    ],
    editable: ["Label text", "Help text", "Feedback message text"],
    limitations: ["The feedback message must stay inside the form group, after the control"],
    invariants: ["Label element associated via for/id", "Help/feedback referenced by aria-describedby"],
    related: ["text-input", "notification"],
    tags: ["form", "group", "label", "error", "wrapper"],
    description: "Container for a form control with label, help block, and feedback message.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Form group with label and help block.",
        markup: `<div class="ecl-form-group">
  <label class="ecl-form-label" for="fg-example">Email address</label>
  <p class="ecl-help-block" id="fg-example-help">Format: name@domain.eu</p>
  <input type="text" id="fg-example" name="email" class="ecl-text-input" aria-describedby="fg-example-help">
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Form group in the error state with feedback message.",
        markup: `<div class="ecl-form-group ecl-form-group--error">
  <label class="ecl-form-label" for="fg-error">Email address</label>
  <input type="text" id="fg-error" name="email" class="ecl-text-input ecl-text-input--error" value="" aria-describedby="fg-error-feedback" aria-invalid="true">
  <p class="ecl-feedback-message" id="fg-error-feedback">The email address format is incorrect.</p>
</div>`
      }
    ]
  },
  {
    dir: "button",
    name: "Button",
    cls: "ecl-button",
    section: "forms",
    requiresJs: "no",
    interaction: ["click", "focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: [
      "Primary actions (ecl-button--primary), search submit (--call-to-action? use --primary for search)",
      "Secondary actions via ecl-button--secondary; text-like actions via ecl-button--ghost"
    ],
    avoidWhen: ["Links between pages — use ecl-link", "Multiple primary buttons per view"],
    agentPrompt: "Edit the label inside ecl-button__label. Variants: ecl-button--primary / --secondary / --ghost. Keep the ecl-button__container > ecl-button__label structure — ECL icons render through it.",
    preserve: [
      ".ecl-button + .ecl-button__container > .ecl-button__label structure",
      "type='submit' on form-submitting buttons"
    ],
    editable: ["Label text", "Variant class", "Icon (ecl-icon inside container)"],
    limitations: ["One primary button per view", "Ghost buttons read as links to users — use only for low-emphasis actions"],
    invariants: ["Semantic <button> or <a> root element", "Accessible name preserved"],
    related: ["text-input", "notification"],
    classMappingUswds: { base: "usa-button", secondary: "usa-button usa-button--secondary" },
    classMappingGovuk: { base: "govuk-button", secondary: "govuk-button govuk-button--secondary" },
    classMappingDsfr: { base: "fr-btn", secondary: "fr-btn fr-btn--secondary" },
    tags: ["button", "submit", "action", "cta"],
    description: "Primary, secondary, and ghost buttons (ecl-button).",
    variants: [
      {
        file: "primary", variant: "primary",
        desc: "Primary button.",
        markup: `<button class="ecl-button ecl-button--primary" type="submit">
  <span class="ecl-button__container">
    <span class="ecl-button__label">Submit</span>
  </span>
</button>`
      },
      {
        file: "secondary", variant: "secondary",
        desc: "Secondary button.",
        markup: `<button class="ecl-button ecl-button--secondary" type="button">
  <span class="ecl-button__container">
    <span class="ecl-button__label">Secondary action</span>
  </span>
</button>`
      },
      {
        file: "ghost", variant: "ghost",
        desc: "Ghost (text-like) button.",
        markup: `<button class="ecl-button ecl-button--ghost" type="button">
  <span class="ecl-button__container">
    <span class="ecl-button__label">Ghost action</span>
  </span>
</button>`
      }
    ]
  },
  {
    dir: "text-input",
    name: "Text field",
    cls: "ecl-text-input",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL fields sit inside an ecl-form-group carrying the label, help block, and feedback message" }],
    useWhen: ["Short free-text answers (name, email, reference)"],
    avoidWhen: ["Longer answers — use text-area", "Structured dates — use datepicker"],
    agentPrompt: "Edit the label and help text. Error state: ecl-form-group--error on the group, ecl-text-input--error on the input, and an ecl-feedback-message linked via aria-describedby.",
    preserve: [
      ".ecl-text-input class on the input",
      "ecl-form-group wrapper with ecl-form-label",
      "ecl-help-block linked via aria-describedby",
      "ecl-feedback-message wiring for errors"
    ],
    editable: ["Label text", "Help text", "type attribute"],
    limitations: ["Do not use placeholder as a label substitute"],
    invariants: ["Semantic <input> element", "Label association via for/id"],
    related: ["form-group", "notification"],
    classMappingUswds: { base: "usa-input", error: "usa-input usa-input--error" },
    classMappingGovuk: { base: "govuk-input", error: "govuk-input govuk-input--error" },
    classMappingDsfr: { base: "fr-input" },
    tags: ["input", "text", "form", "field"],
    description: "Text field with label, help text, and error state (ecl-text-input).",
    defaultMarkup: `<div class="ecl-form-group">
  <label class="ecl-form-label" for="ti-example">Email address</label>
  <p class="ecl-help-block" id="ti-example-help">Format: name@domain.eu</p>
  <input type="text" id="ti-example" name="email" class="ecl-text-input" aria-describedby="ti-example-help">
</div>`,
  },
  {
    dir: "text-area",
    name: "Text area",
    cls: "ecl-text-area",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL text areas sit inside an ecl-form-group carrying the label and feedback message" }],
    useWhen: ["Longer free-text answers (descriptions, enquiries)"],
    avoidWhen: ["Single-line values — use text-input"],
    agentPrompt: "Adjust the rows attribute. Error state: ecl-form-group--error + ecl-text-area--error + linked ecl-feedback-message.",
    preserve: [".ecl-text-area class", "ecl-form-group wrapper", "Label association via for/id"],
    editable: ["Label text", "rows attribute"],
    limitations: ["Fixed height by rows"],
    invariants: ["Semantic <textarea> element"],
    related: ["form-group", "text-input"],
    classMappingUswds: { base: "usa-textarea" },
    classMappingGovuk: { base: "govuk-textarea" },
    classMappingDsfr: { base: "fr-input" },
    tags: ["textarea", "multiline", "form"],
    description: "Multi-line text input with label and error state (ecl-text-area).",
    defaultMarkup: `<div class="ecl-form-group">
  <label class="ecl-form-label" for="ta-example">Your enquiry</label>
  <textarea id="ta-example" name="enquiry" rows="5" class="ecl-text-area"></textarea>
</div>`,
  },
  {
    dir: "select",
    name: "Select",
    cls: "ecl-select",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "change"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL selects sit inside an ecl-form-group carrying the label and feedback message" }],
    useWhen: ["Choosing one option from a short list"],
    avoidWhen: ["Long option lists", "Multiple selections — use checkbox"],
    agentPrompt: "Replace <option> values and text. Error state: ecl-form-group--error + ecl-select--error + linked ecl-feedback-message.",
    preserve: [".ecl-select class on the <select>", "ecl-form-group wrapper with label", "Placeholder option convention"],
    editable: ["Label text", "Option list"],
    limitations: ["Native select — platform appearance varies"],
    invariants: ["Semantic <select> with <option> children"],
    related: ["form-group", "radio"],
    classMappingUswds: { base: "usa-select" },
    classMappingGovuk: { base: "govuk-select" },
    classMappingDsfr: { base: "fr-select" },
    tags: ["select", "dropdown", "form", "options"],
    description: "Dropdown select with label and error state (ecl-select).",
    defaultMarkup: `<div class="ecl-form-group">
  <label class="ecl-form-label" for="sel-example">Country of residence</label>
  <select id="sel-example" name="country" class="ecl-select">
    <option value="" selected disabled hidden>Select an option</option>
    <option value="be">Belgium</option>
    <option value="fr">France</option>
    <option value="de">Germany</option>
  </select>
</div>`,
  },
  {
    dir: "checkbox",
    name: "Checkbox",
    cls: "ecl-checkbox",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL checkboxes sit inside an ecl-form-group carrying the label and feedback message" }],
    useWhen: ["Multiple selections including none", "Single consent checkbox"],
    avoidWhen: ["Exactly one choice — use radio"],
    agentPrompt: "Edit the checkbox text. The ecl-checkbox__box span renders the custom box — keep it. Group errors use ecl-form-group--error + ecl-feedback-message.",
    preserve: [
      "ecl-checkbox__input on the input",
      "ecl-checkbox__box span (custom box renderer)",
      "Label wrapping input + ecl-checkbox__text"
    ],
    editable: ["Checkbox text", "Option values"],
    limitations: ["Do not pre-check consent boxes"],
    invariants: ["Real <input type='checkbox'> elements"],
    related: ["radio", "form-group"],
    classMappingUswds: { base: "usa-checkbox__input", label: "usa-checkbox__label" },
    classMappingGovuk: { base: "govuk-checkboxes__input", label: "govuk-label govuk-checkboxes__label" },
    classMappingDsfr: { base: "fr-checkbox-group" },
    tags: ["checkbox", "multiple", "form", "options"],
    description: "Checkbox with custom box renderer (ecl-checkbox).",
    defaultMarkup: `<div class="ecl-form-group">
  <label class="ecl-checkbox" for="cb-example">
    <input type="checkbox" id="cb-example" name="consent" class="ecl-checkbox__input" />
    <span class="ecl-checkbox__box"></span>
    <span class="ecl-checkbox__text">I agree to the data protection terms</span>
  </label>
</div>`,
  },
  {
    dir: "radio",
    name: "Radio",
    cls: "ecl-radio",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL radios sit inside an ecl-form-group carrying the label and feedback message" }],
    useWhen: ["Exactly one choice from a small set"],
    avoidWhen: ["Multiple selections — use checkbox"],
    agentPrompt: "Edit option text. All radios share one name attribute. Group errors use ecl-form-group--error + ecl-feedback-message.",
    preserve: ["ecl-radio__input on the input", "ecl-radio__box span", "Same name across the group"],
    editable: ["Option text", "Values"],
    limitations: ["Keep option lists short — reconsider the question otherwise"],
    invariants: ["Real <input type='radio'> elements sharing one name"],
    related: ["checkbox", "form-group"],
    classMappingUswds: { base: "usa-radio__input", label: "usa-radio__label" },
    classMappingGovuk: { base: "govuk-radios__input", label: "govuk-label govuk-radios__label" },
    classMappingDsfr: { base: "fr-radio-group" },
    tags: ["radio", "single-choice", "form"],
    description: "Radio buttons with custom box renderer (ecl-radio).",
    defaultMarkup: `<div class="ecl-form-group" role="radiogroup" aria-label="Preferred contact method">
  <label class="ecl-radio" for="rd-email">
    <input type="radio" id="rd-email" name="contact" class="ecl-radio__input" value="email" />
    <span class="ecl-radio__box"></span>
    <span class="ecl-radio__text">Email</span>
  </label>
  <label class="ecl-radio" for="rd-phone">
    <input type="radio" id="rd-phone" name="contact" class="ecl-radio__input" value="phone" />
    <span class="ecl-radio__box"></span>
    <span class="ecl-radio__text">Phone</span>
  </label>
</div>`,
  },
  {
    dir: "file-upload",
    name: "File upload",
    cls: "ecl-file-upload",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "ECL file uploads sit inside an ecl-form-group carrying the label and feedback message" }],
    useWhen: ["Uploading documents (evidence, attachments)"],
    avoidWhen: ["Users may not have the file ready — allow saving progress"],
    agentPrompt: "Edit the label. State accepted formats and size limits in the ecl-help-block. Error state: ecl-form-group--error + ecl-file-upload--error + ecl-feedback-message.",
    preserve: [".ecl-file-upload class", "ecl-form-group wrapper", "Label association via for/id"],
    editable: ["Label text", "Help text", "accept attribute"],
    limitations: ["Native control — platform appearance varies"],
    invariants: ["Semantic <input type='file'>"],
    related: ["form-group"],
    classMappingUswds: { base: "usa-file-input" },
    classMappingGovuk: { base: "govuk-file-upload" },
    classMappingDsfr: { base: "fr-upload" },
    tags: ["file", "upload", "form", "document"],
    description: "File upload control with error state (ecl-file-upload).",
    defaultMarkup: `<div class="ecl-form-group">
  <label class="ecl-form-label" for="fu-example">Upload evidence</label>
  <p class="ecl-help-block" id="fu-example-help">PDF, PNG or JPG — 10 MB maximum</p>
  <input type="file" id="fu-example" name="evidence" class="ecl-file-upload" aria-describedby="fu-example-help">
</div>`,
  },
  {
    dir: "search-form",
    name: "Search form",
    cls: "ecl-search-form",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus", "click"],
    pii: "accepts_input",
    audit: true,
    useWhen: ["Global or section-level content search"],
    avoidWhen: ["Filtering within one page — use tags or links"],
    agentPrompt: "Set the form action. The label is visually hidden but mandatory for screen readers. The submit button uses ecl-button--primary with a search icon.",
    preserve: [
      "form with role='search'",
      "Visually-hidden label on the input",
      "ecl-search-form__textfield / __button structure"
    ],
    editable: ["Placeholder text", "Button label", "hrefs"],
    limitations: ["Input needs its accessible name — keep the hidden label"],
    invariants: ["Input labelled", "Submit button inside the form"],
    related: ["table", "pagination", "site-header"],
    classMappingUswds: { base: "usa-search" },
    classMappingGovuk: { base: "govuk-search" },
    classMappingDsfr: { base: "fr-search-bar" },
    tags: ["search", "query", "find"],
    description: "Search form with hidden label and icon submit (ecl-search-form).",
    defaultMarkup: `<form class="ecl-search-form" role="search" action="#" method="get">
  <label class="ecl-form-label ecl-search-form__label" for="sf-example">Search</label>
  <div class="ecl-search-form__textfield-wrapper">
    <input type="search" id="sf-example" name="q" class="ecl-text-input ecl-search-form__textfield" placeholder="Search...">
  </div>
  <button class="ecl-button ecl-button--primary ecl-search-form__button" type="submit">
    <span class="ecl-button__container"><span class="ecl-button__label">Search</span></span>
  </button>
</form>`
  },
  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  {
    dir: "breadcrumb",
    name: "Breadcrumb",
    cls: "ecl-breadcrumb",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Sites deeper than two levels", "ECL collapses middle segments on mobile (JS)"],
    avoidWhen: ["Top-level pages"],
    agentPrompt: "Edit the trail links. The last segment carries aria-current='page' and is not a link. data-ecl-breadcrumb enables the JS collapse behaviour.",
    preserve: [
      "nav[aria-label='Breadcrumb']",
      "ecl-breadcrumb__container > __segment list structure",
      "aria-current='page' on the last segment"
    ],
    editable: ["Trail links"],
    limitations: ["Mobile collapse needs ECL JS (data-ecl-breadcrumb)"],
    invariants: ["Breadcrumb landmark labelled"],
    related: ["page-header", "site-header", "pagination"],
    classMappingUswds: { base: "usa-breadcrumb" },
    classMappingGovuk: { base: "govuk-breadcrumbs" },
    classMappingDsfr: { base: "fr-breadcrumb" },
    tags: ["breadcrumb", "navigation", "hierarchy"],
    description: "Hierarchical breadcrumb trail with mobile collapsing.",
    defaultMarkup: `<nav class="ecl-breadcrumb" aria-label="Breadcrumb" data-ecl-breadcrumb="true">
  <ol class="ecl-breadcrumb__container">
    <li class="ecl-breadcrumb__segment">
      <a href="#" class="ecl-link ecl-link--standalone ecl-breadcrumb__link">Home</a>
    </li>
    <li class="ecl-breadcrumb__segment">
      <a href="#" class="ecl-link ecl-link--standalone ecl-breadcrumb__link">Policies</a>
    </li>
    <li class="ecl-breadcrumb__segment" aria-current="page">Current page</li>
  </ol>
</nav>`,
  },
  {
    dir: "tabs",
    name: "Tabs",
    cls: "ecl-tabs",
    section: "navigation",
    requiresJs: "required",
    interaction: ["click", "focus", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Switching between related views of the same data"],
    avoidWhen: ["Content that must be visible or printable in full"],
    agentPrompt: "Edit tab titles and panel content. role='tablist'/'tab'/'tabpanel' wiring and arrow-key navigation are ECL-JS-managed — keep ids and aria attributes paired.",
    preserve: [
      "role='tablist'/'tab'/'tabpanel' structure",
      "aria-selected + aria-controls pairing",
      "ecl-tabs__panel--active state class"
    ],
    editable: ["Tab titles", "Panel content"],
    limitations: ["Hidden panels stay in the DOM — content must make sense stacked"],
    invariants: ["tab/tabpanel ARIA relationships intact"],
    related: ["expandable", "accordion-none-ecl-has-expandable"],
    tags: ["tabs", "content", "views"],
    description: "Tabbed content panels with full ARIA wiring (ecl-tabs).",
    defaultMarkup: `<div class="ecl-tabs" data-ecl-tabs="true">
  <ul class="ecl-tabs__list" role="tablist">
    <li role="presentation" class="ecl-tabs__item">
      <button role="tab" id="tab-day" class="ecl-tabs__tab ecl-tabs__tab--active" aria-selected="true" aria-controls="panel-day">Past day</button>
    </li>
    <li role="presentation" class="ecl-tabs__item">
      <button role="tab" id="tab-week" class="ecl-tabs__tab" aria-selected="false" aria-controls="panel-week" tabindex="-1">Past week</button>
    </li>
  </ul>
  <section role="tabpanel" id="panel-day" class="ecl-tabs__panel ecl-tabs__panel--active" aria-labelledby="tab-day">
    <p>3,964 applications received.</p>
  </section>
  <section role="tabpanel" id="panel-week" class="ecl-tabs__panel" aria-labelledby="tab-week" hidden>
    <p>27,812 applications received.</p>
  </section>
</div>`,
  },
  {
    dir: "pagination",
    name: "Pagination",
    cls: "ecl-pagination",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Paginated result lists"],
    avoidWhen: ["Question flows — use buttons"],
    agentPrompt: "Edit page links. aria-current='page' on the active page. Labelled items (Previous/Next) carry visually-hidden context.",
    preserve: [
      "nav[aria-label='Pagination']",
      "ecl-pagination__list structure",
      "aria-current='page' on the active item"
    ],
    editable: ["Page numbers", "hrefs", "Prev/next labels"],
    limitations: ["No dead links — page count must be honest"],
    invariants: ["Pagination landmark labelled"],
    related: ["table", "search-form"],
    classMappingUswds: { base: "usa-pagination" },
    classMappingGovuk: { base: "govuk-pagination" },
    classMappingDsfr: { base: "fr-pagination" },
    tags: ["pagination", "pages", "results"],
    description: "Numbered pagination with previous/next controls.",
    defaultMarkup: `<nav class="ecl-pagination" aria-label="Pagination">
  <ul class="ecl-pagination__list">
    <li class="ecl-pagination__item ecl-pagination__item--previous">
      <a href="#" class="ecl-link ecl-link--standalone ecl-pagination__link ecl-pagination__link--previous">
        <span class="ecl-link__label">Previous</span>
      </a>
    </li>
    <li class="ecl-pagination__item">
      <a href="#" class="ecl-link ecl-link--standalone ecl-pagination__link" aria-current="page">1</a>
    </li>
    <li class="ecl-pagination__item">
      <a href="#" class="ecl-link ecl-link--standalone ecl-pagination__link">2</a>
    </li>
    <li class="ecl-pagination__item ecl-pagination__item--next">
      <a href="#" class="ecl-link ecl-link--standalone ecl-pagination__link ecl-pagination__link--next">
        <span class="ecl-link__label">Next</span>
      </a>
    </li>
  </ul>
</nav>`,
  },
  {
    dir: "inpage-navigation",
    name: "In-page navigation",
    cls: "ecl-inpage-navigation",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Long content pages — links to page headings with scroll tracking"],
    avoidWhen: ["Short pages"],
    agentPrompt: "Anchor links must match real heading ids. data-ecl-inpage-navigation enables the JS scroll-spy.",
    preserve: [
      "nav with ecl-inpage-navigation__title and heading list",
      "Anchor targets resolve to real ids"
    ],
    editable: ["Anchor texts", "Targets"],
    limitations: ["Scroll-spy highlighting is JS-provided"],
    invariants: ["Anchors resolve to real heading ids"],
    related: ["breadcrumb"],
    tags: ["inpage", "toc", "anchors", "long-form"],
    description: "Table-of-contents navigation with scroll tracking (ecl-inpage-navigation).",
    defaultMarkup: `<nav class="ecl-inpage-navigation" aria-label="Page navigation" data-ecl-inpage-navigation="true">
  <p class="ecl-inpage-navigation__title">Page contents</p>
  <ul class="ecl-inpage-navigation__list">
    <li><a href="#section-1" class="ecl-link ecl-inpage-navigation__link">Section one</a></li>
    <li><a href="#section-2" class="ecl-link ecl-inpage-navigation__link">Section two</a></li>
  </ul>
</nav>`,
  },
  {
    dir: "site-header",
    name: "Site header",
    cls: "ecl-site-header",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — EC/EU identity banner, language selector, search, navigation"],
    avoidWhen: ["Do not nest forms other than search inside the header"],
    agentPrompt: "The EC/EU logo image is fixed identity — keep it. Edit the site name, language selector label, and search action. data-ecl-site-header enables JS menus. Every page needs skip links before this header — the ECL registry has no skiplinks tile, so add them in site markup (EC/EU production pages embed them above the header).",
    preserve: [
      "ecl-site-header__banner with the EC/EU logo link",
      "ecl-site-header__selector (language selector) structure",
      "Banner/identity image alt text"
    ],
    editable: ["Site name", "Language selector label", "Search action", "Navigation links"],
    limitations: [
      "EU emblem usage is governed by Commission identity rules — do not restyle the logo",
      "Language selector and menus are JS-enhanced"
    ],
    invariants: ["Logo alt text present", "Header is the banner landmark"],
    related: ["site-footer", "breadcrumb", "search-form"],
    tags: ["header", "identity", "logo", "language", "navigation"],
    description: "EC/EU site header with logo, language selector, and search.",
    defaultMarkup: `<header class="ecl-site-header" data-ecl-site-header="true">
  <div class="ecl-site-header__banner">
    <div class="ecl-container">
      <a href="#" class="ecl-site-header__logo-link" aria-label="European Commission">
        <img class="ecl-site-header__logo-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='64'%3E%3Crect width='96' height='64' fill='%23004494'/%3E%3Ctext x='48' y='40' fill='%23ffd617' text-anchor='middle' font-size='16'%3EEC%3C/text%3E%3C/svg%3E" alt="European Commission logo">
      </a>
      <div class="ecl-site-header__selector">
        <a href="#" class="ecl-link ecl-link--standalone ecl-site-header__selector-link">English</a>
      </div>
    </div>
  </div>
  <div class="ecl-site-header__content">
    <div class="ecl-container">
      <p class="ecl-site-header__site-name">Commission and its priorities</p>
    </div>
  </div>
</header>`,
  },
  {
    dir: "page-header",
    name: "Page header",
    cls: "ecl-page-header",
    section: "navigation",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Top of every content page — breadcrumbs, meta, title, description"],
    avoidWhen: ["Application-style pages without a title hierarchy"],
    agentPrompt: "Edit the meta label, title (h1), and description. The breadcrumb typically lives inside the page header in ECL layouts.",
    preserve: [
      "ecl-page-header structure with h1 title",
      "One h1 per page — it lives here"
    ],
    editable: ["Meta text", "Title", "Description"],
    limitations: ["Do not place interactive controls in the page header"],
    invariants: ["Single h1 per page"],
    related: ["site-header", "breadcrumb", "site-footer"],
    tags: ["page-header", "title", "h1", "layout"],
    description: "Page-level header with meta, title, and description.",
    defaultMarkup: `<div class="ecl-page-header">
  <div class="ecl-container">
    <p class="ecl-page-header__meta">Home > Policies</p>
    <h1 class="ecl-page-header__title">Page title</h1>
    <p class="ecl-page-header__description">Short description of the page content.</p>
  </div>
</div>`,
  },
  {
    dir: "site-footer",
    name: "Site footer",
    cls: "ecl-site-footer",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — European Commission/EU contact and legal links"],
    avoidWhen: ["Do not place primary navigation here"],
    agentPrompt: "Edit the contact/other-sites link columns. Keep the 'European Commission' title block and the standard legal contact link.",
    preserve: [
      "ecl-site-footer__title block ('European Commission')",
      "footer landmark semantics"
    ],
    editable: ["Link columns", "Contact links"],
    limitations: ["Identity text is fixed — do not rebrand"],
    invariants: ["Contentinfo landmark"],
    related: ["site-header", "page-header"],
    tags: ["footer", "legal", "contact", "identity"],
    description: "EC/EU site footer with contact and legal link columns.",
    defaultMarkup: `<footer class="ecl-site-footer">
  <div class="ecl-container">
    <div class="ecl-site-footer__title">European Commission</div>
    <div class="ecl-site-footer__info">
      <div class="ecl-site-footer__info-line">Contact the EU</div>
      <div class="ecl-site-footer__info-line">Find a contact person</div>
    </div>
  </div>
</footer>`,
  },
  // ─── FEEDBACK ─────────────────────────────────────────────────────────────
  {
    dir: "notification",
    name: "Notification",
    cls: "ecl-alert",
    section: "feedback",
    requiresJs: "optional",
    interaction: ["focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Page-level information, success, warning, or error messages", "role='alert' variants announce to screen readers"],
    avoidWhen: ["Field-level errors — use ecl-feedback-message in the form group"],
    agentPrompt: "Variants: ecl-alert--info / --success / --error / --warning. role='alert' for error/warning, role='status' for info/success. The close button requires ECL JS.",
    preserve: [
      "ecl-alert__title and __description structure",
      "role attribute matching the variant",
      "ecl-alert__icon (type conveyed by icon + text)"
    ],
    editable: ["Title", "Description", "Variant class"],
    limitations: ["Do not stack many notifications on one page"],
    invariants: ["Title/description structure intact"],
    related: ["label", "highlight-box", "form-group"],
    classMappingUswds: { base: "usa-alert", info: "usa-alert usa-alert--info", success: "usa-alert usa-alert--success", error: "usa-alert usa-alert--error", warning: "usa-alert usa-alert--warning" },
    classMappingGovuk: { base: "govuk-notification-banner", success: "govuk-notification-banner govuk-notification-banner--success" },
    classMappingDsfr: { base: "fr-alert", success: "fr-alert fr-alert--success", error: "fr-alert fr-alert--error", warning: "fr-alert fr-alert--warning", info: "fr-alert fr-alert--info" },
    tags: ["notification", "alert", "info", "success", "error", "warning"],
    description: "Info, success, error, and warning notifications (ecl-alert).",
    variants: [
      {
        file: "info", variant: "info",
        desc: "Information notification.",
        markup: `<div class="ecl-alert ecl-alert--info" role="status">
  <div class="ecl-alert__icon ecl-icon ecl-icon--l ecl-icon--info"></div>
  <div class="ecl-alert__content">
    <p class="ecl-alert__title">Information</p>
    <p class="ecl-alert__description">The service will be unavailable on Sunday between 2am and 4am.</p>
  </div>
</div>`
      },
      {
        file: "success", variant: "success",
        desc: "Success notification.",
        markup: `<div class="ecl-alert ecl-alert--success" role="status">
  <div class="ecl-alert__icon ecl-icon ecl-icon--l ecl-icon--success"></div>
  <div class="ecl-alert__content">
    <p class="ecl-alert__title">Success</p>
    <p class="ecl-alert__description">Your request has been submitted.</p>
  </div>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Error notification.",
        markup: `<div class="ecl-alert ecl-alert--error" role="alert">
  <div class="ecl-alert__icon ecl-icon ecl-icon--l ecl-icon--error"></div>
  <div class="ecl-alert__content">
    <p class="ecl-alert__title">Error</p>
    <p class="ecl-alert__description">Something went wrong while sending. Please try again.</p>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "highlight-box",
    name: "Highlight box",
    cls: "ecl-highlight-box",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Emphasising key information in a bordered box"],
    avoidWhen: ["Page-level alerts — use notification"],
    agentPrompt: "Edit the text. fr-style variants: ecl-highlight-box--default / --filled. Titles inside use ecl-highlight-box__title.",
    preserve: [".ecl-highlight-box wrapper"],
    editable: ["Title", "Text", "Variant class"],
    limitations: ["Reserve for genuinely key information"],
    invariants: ["Plain reading flow"],
    related: ["notification", "label"],
    classMappingUswds: { base: "usa-summary-box" },
    classMappingGovuk: { base: "govuk-inset-text" },
    classMappingDsfr: { base: "fr-callout" },
    tags: ["highlight", "box", "emphasis"],
    description: "Bordered emphasis box for key information (ecl-highlight-box).",
    defaultMarkup: `<div class="ecl-highlight-box">
  <p>If your application is successful, you will receive a letter within 10 working days.</p>
</div>`,
  },
  {
    dir: "label",
    name: "Label (status)",
    cls: "ecl-label",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Short status labels (Draft, Published, High)"],
    avoidWhen: ["Interactive elements", "Long text"],
    agentPrompt: "Severity variants: ecl-label--high / --medium / --low. Text always carries the meaning.",
    preserve: [".ecl-label on the element"],
    editable: ["Text", "Severity variant"],
    limitations: ["Never rely on colour alone"],
    invariants: ["Text carries the meaning"],
    related: ["tag", "notification"],
    classMappingUswds: { base: "usa-tag" },
    classMappingGovuk: { base: "govuk-tag" },
    classMappingDsfr: { base: "fr-badge" },
    tags: ["label", "status", "severity", "badge"],
    description: "Status labels with severity variants (ecl-label).",
    defaultMarkup: `<p><span class="ecl-label ecl-label--high">High</span>
<span class="ecl-label ecl-label--medium">Medium</span>
<span class="ecl-label ecl-label--low">Low</span></p>`,
  },
  {
    dir: "expandable",
    name: "Expandable",
    cls: "ecl-expandable",
    section: "feedback",
    requiresJs: "required",
    interaction: ["click", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Progressive disclosure of secondary content"],
    avoidWhen: ["Critical information — keep it visible"],
    agentPrompt: "The toggle button controls the ecl-expandable__content visibility — ECL JS manages aria-expanded and the --expanded class.",
    preserve: [
      "ecl-expandable__toggle button with aria-expanded",
      "ecl-expandable__content region"
    ],
    editable: ["Toggle label", "Content"],
    limitations: ["Content hidden by default — never essential information"],
    invariants: ["Button/region ARIA pairing intact"],
    related: ["tabs", "highlight-box"],
    tags: ["expandable", "disclosure", "content"],
    description: "Toggle-disclosed content region (ecl-expandable).",
    defaultMarkup: `<div class="ecl-expandable" data-ecl-expandable="true">
  <button class="ecl-button ecl-button--ghost ecl-expandable__toggle" aria-expanded="false" aria-controls="exp-content" data-ecl-expandable-toggle="true">
    <span class="ecl-button__container"><span class="ecl-button__label">More information</span></span>
  </button>
  <div class="ecl-expandable__content" id="exp-content" hidden>
    <p>Secondary information that most users will not need.</p>
  </div>
</div>`,
  },
  // ─── DATA DISPLAY ─────────────────────────────────────────────────────────
  {
    dir: "table",
    name: "Table",
    cls: "ecl-table",
    section: "data-display",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Tabular data with a genuine row/column relationship"],
    avoidWhen: ["Lists that could be markup lists"],
    agentPrompt: "Edit headers and cells. Caption is required. Grouped headers and multi-level tables are supported — keep scope attributes.",
    preserve: [
      "<caption> element (required)",
      "scope='col'/'row' on header cells",
      "ecl-table wrapper structure"
    ],
    editable: ["Caption text", "Headers and cells"],
    limitations: ["Wide tables need horizontal scroll handling"],
    invariants: ["Caption present", "scope attributes on headers"],
    related: ["pagination", "search-form"],
    classMappingUswds: { base: "usa-table" },
    classMappingGovuk: { base: "govuk-table" },
    classMappingDsfr: { base: "fr-table" },
    tags: ["table", "data", "numbers"],
    description: "Accessible data table with caption (ecl-table).",
    defaultMarkup: `<div class="ecl-table">
  <table class="ecl-table__table">
    <caption class="ecl-table__caption">Dates and amounts</caption>
    <thead class="ecl-table__head">
      <tr class="ecl-table__row">
        <th scope="col" class="ecl-table__header">Date</th>
        <th scope="col" class="ecl-table__header">Amount</th>
      </tr>
    </thead>
    <tbody class="ecl-table__body">
      <tr class="ecl-table__row">
        <td class="ecl-table__cell">First 6 weeks</td>
        <td class="ecl-table__cell">€109.80 per week</td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    dir: "card",
    name: "Card",
    cls: "ecl-card",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Linking to content pages in grids (news, publications, campaigns)"],
    avoidWhen: ["Action buttons", "Tabular data"],
    agentPrompt: "The ecl-link inside ecl-card__title makes the card clickable via ECL's link-stretching. Edit title, description, meta (ecl-card__meta), and optional image with alt text.",
    preserve: [
      "ecl-card__title with ecl-card__link",
      "ecl-card__meta / __description structure",
      "Image alt text when present"
    ],
    editable: ["Title", "Description", "Meta", "Media"],
    limitations: ["One primary link per card", "Keep descriptions short"],
    invariants: ["Single accessible name per card"],
    related: ["tag", "label"],
    classMappingUswds: { base: "usa-card" },
    classMappingGovuk: { base: "govuk-card" },
    classMappingDsfr: { base: "fr-card" },
    tags: ["card", "content", "grid", "news"],
    description: "Content card with title link, description, and meta (ecl-card).",
    defaultMarkup: `<article class="ecl-card">
  <div class="ecl-card__content">
    <div class="ecl-card__label">News</div>
    <h3 class="ecl-card__title">
      <a href="#" class="ecl-link ecl-link--standalone ecl-card__link">Commission adopts new digital strategy</a>
    </h3>
    <p class="ecl-card__description">Short description of the news item.</p>
  </div>
</article>`,
  },
  {
    dir: "tag",
    name: "Tag",
    cls: "ecl-tag",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Labelling and filtering content by keyword"],
    avoidWhen: ["Status severity — use label", "Static decoration"],
    agentPrompt: "Interactive tags are <button class='ecl-tag'> (or <a>); static ones are <span>. Keep element semantics matching interactivity.",
    preserve: [".ecl-tag class", "Element type matches interactivity"],
    editable: ["Label text"],
    limitations: ["Static tags must not look clickable"],
    invariants: ["Element type matches interactivity"],
    related: ["label", "card"],
    classMappingUswds: { base: "usa-tag" },
    classMappingGovuk: { base: "govuk-tag" },
    classMappingDsfr: { base: "fr-tag" },
    tags: ["tag", "keyword", "filter"],
    description: "Interactive or static keyword tags (ecl-tag).",
    defaultMarkup: `<div class="ecl-tag-group">
  <button class="ecl-tag" aria-pressed="false">Digital</button>
  <button class="ecl-tag" aria-pressed="true">Economy</button>
  <span class="ecl-tag">Environment</span>
</div>`,
  },
  {
    dir: "file",
    name: "File (download)",
    cls: "ecl-file",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "none",
    audit: false,
    useWhen: ["Linking to downloadable documents with format, size, and language metadata"],
    avoidWhen: ["Regular page links — use ecl-link"],
    agentPrompt: "Edit the title and meta. ECL shows format, size, and language visibly — users must know before clicking. The download attribute is standard.",
    preserve: [
      "ecl-file__title with ecl-link",
      "ecl-file__meta (language, format, size) visible text",
      "download attribute on the link"
    ],
    editable: ["Title", "Meta text", "href"],
    limitations: ["Direct downloads only"],
    invariants: ["Format/size/language visible before download"],
    related: ["card"],
    classMappingUswds: { base: "usa-collection__item" },
    classMappingGovuk: { base: "govuk-download" },
    classMappingDsfr: { base: "fr-download" },
    tags: ["download", "file", "document", "pdf"],
    description: "File download item with format, size, and language metadata.",
    defaultMarkup: `<div class="ecl-file">
  <a href="#" class="ecl-link ecl-file__title" download>
    <span class="ecl-file__title-label">Annual report 2025</span>
  </a>
  <div class="ecl-file__meta">
    <span class="ecl-file__language">English</span>
    <span class="ecl-file__type">PDF</span>
    <span class="ecl-file__size">2.4 MB</span>
  </div>
</div>`,
  },
  {
    dir: "banner",
    name: "Banner (hero)",
    cls: "ecl-banner",
    section: "layout",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Full-width hero at the top of landing pages (image + title + CTA)", "Campaign or priority promotion"],
    avoidWhen: ["Regular content pages — use page-header", "More than one banner per page"],
    agentPrompt: "Variants: default (plain) and ecl-banner--image with ecl-banner__image background. Keep the title/description/button hierarchy and the single primary CTA.",
    preserve: ["ecl-banner structure with title/description", "Button uses ecl-button--primary or ecl-link"],
    editable: ["Title", "Description", "CTA label and href", "Image variant"],
    limitations: ["Image banners need sufficient text contrast over the image (overlay handles it)", "One banner per page"],
    invariants: ["Title hierarchy: banner title is the page h1 on landing pages"],
    related: ["page-header", "card", "button"],
    tags: ["banner", "hero", "landing", "campaign", "image"],
    description: "Full-width hero banner with title, description, and CTA (ecl-banner).",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    variants: [
      {
        file: "default", variant: "default",
        desc: "Plain banner.",
        markup: `<section class="ecl-banner">
  <div class="ecl-banner__content">
    <h1 class="ecl-banner__title">Dream big. Act now.</h1>
    <p class="ecl-banner__description">Discover what the EU offers young people.</p>
    <a href="#" class="ecl-button ecl-button--primary ecl-banner__button">
      <span class="ecl-button__container"><span class="ecl-button__label">Learn more</span></span>
    </a>
  </div>
</section>`
      },
      {
        file: "image", variant: "image",
        desc: "Image banner with overlay.",
        markup: `<section class="ecl-banner ecl-banner--image">
  <div class="ecl-banner__image" style="background-image:url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'300\\'%3E%3Crect width=\\'800\\' height=\\'300\\' fill=\\'%23004494\\'/%3E%3C/svg%3E')"></div>
  <div class="ecl-banner__content">
    <h1 class="ecl-banner__title">Dream big. Act now.</h1>
    <p class="ecl-banner__description">Discover what the EU offers young people.</p>
    <a href="#" class="ecl-button ecl-button--primary ecl-banner__button">
      <span class="ecl-button__container"><span class="ecl-button__label">Learn more</span></span>
    </a>
  </div>
</section>`
      }
    ]
  },
  {
    dir: "date-block",
    name: "Date block",
    cls: "ecl-date-block",
    section: "data-display",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Agenda and events listings — day/month/year blocks beside event titles"],
    avoidWhen: ["Full tables of dates — use table"],
    agentPrompt: "Set the day, month, and year spans. Combine with ecl-content-item for full agenda entries.",
    preserve: ["ecl-date-block day/month/year span structure"],
    editable: ["Day", "Month", "Year"],
    limitations: ["Short month names only — full dates go in the accompanying content"],
    invariants: ["Date remains readable as text"],
    related: ["content-item", "table"],
    tags: ["date", "block", "agenda", "event"],
    description: "Compact day/month/year date block for agenda entries.",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    defaultMarkup: `<div class="ecl-date-block">
  <span class="ecl-date-block__day">16</span>
  <span class="ecl-date-block__month">Sep</span>
  <span class="ecl-date-block__year">2026</span>
</div>`
  },
  {
    dir: "content-item",
    name: "Content item",
    cls: "ecl-content-item",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["News listings with image, date, title, and reading time", "The commission.europa.eu homepage news pattern"],
    avoidWhen: ["Tabular data — use table"],
    agentPrompt: "Structure: ecl-content-item > ecl-content-block with __image, __title (link), __description, __meta. Meta carries date and read time as separate lines.",
    preserve: [
      "ecl-content-block__title with ecl-link",
      "Meta lines for date and read time",
      "Image alt text when present"
    ],
    editable: ["Title", "Description", "Meta", "Image"],
    limitations: ["One primary link per item"],
    invariants: ["Single accessible name via the title link"],
    related: ["card", "date-block", "tag"],
    tags: ["content", "news", "item", "listing"],
    description: "News/content listing item with image, meta, and title link.",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    defaultMarkup: `<article class="ecl-content-item">
  <div class="ecl-content-block">
    <div class="ecl-content-block__image">
      <img class="ecl-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23e3e3fd'/%3E%3C/svg%3E" alt="">
    </div>
    <div class="ecl-content-block__info">
      <h3 class="ecl-content-block__title">
        <a href="#" class="ecl-link ecl-link--standalone">EU and NATO respond to Leipzig sabotage attempt</a>
      </h3>
      <p class="ecl-content-block__description">Short description of the news item.</p>
      <div class="ecl-content-block__meta">
        <p class="ecl-content-block__meta-item">2 September 2026</p>
        <p class="ecl-content-block__meta-item">1 min read</p>
      </div>
    </div>
  </div>
</article>`
  },
  {
    dir: "list-illustration",
    name: "List with illustrations",
    cls: "ecl-list-illustration",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Icon + link quick-access lists (the commission.europa.eu 'Europe and you' block)"],
    avoidWhen: ["Plain navigation — use menu"],
    agentPrompt: "Each item is an illustration image plus a link. Images are decorative (alt='') when the link text carries the meaning.",
    preserve: ["ecl-list-illustration__item structure", "Link text carries the meaning"],
    editable: ["Illustrations", "Link text", "hrefs"],
    limitations: ["Keep illustrations consistent in style and size"],
    invariants: ["Link text meaningful without the illustration"],
    related: ["card", "site-footer"],
    tags: ["list", "illustration", "icons", "quick-access"],
    description: "Illustrated quick-access link list (ecl-list-illustration).",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    defaultMarkup: `<ul class="ecl-list-illustration">
  <li class="ecl-list-illustration__item">
    <img class="ecl-list-illustration__image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23ffd617'/%3E%3C/svg%3E" alt="">
    <a href="#" class="ecl-link ecl-link--standalone">Your Europe</a>
  </li>
  <li class="ecl-list-illustration__item">
    <img class="ecl-list-illustration__image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23004494'/%3E%3C/svg%3E" alt="">
    <a href="#" class="ecl-link ecl-link--standalone">Funding and tenders</a>
  </li>
</ul>`
  },
  {
    dir: "language-list",
    name: "Language list",
    cls: "ecl-language-list",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "none",
    audit: false,
    useWhen: ["Selecting one of the 24 official EU languages", "Splash pages and the site-header selector panel"],
    avoidWhen: ["Single-language sites"],
    agentPrompt: "Each link carries lang and hreflang attributes matching its target language. The current language is not a link (aria-current). Link text is the language's own name in its own script.",
    preserve: [
      "lang + hreflang attributes on every language link",
      "Language names in their own language/script",
      "aria-current on the active language"
    ],
    editable: ["Languages included", "Target URLs"],
    limitations: ["All 24 official languages expected on EC/EU sites — omitting one needs a documented reason"],
    invariants: ["lang/hreflang attributes preserved", "Current language marked"],
    related: ["site-header"],
    tags: ["language", "multilingual", "selector", "24-languages"],
    description: "24-official-language selection list (ecl-language-list).",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    defaultMarkup: `<div class="ecl-language-list">
  <div class="ecl-container">
    <ul class="ecl-language-list__list">
      <li><a href="#" lang="en" hreflang="en" class="ecl-language-list__link" aria-current="true">English</a></li>
      <li><a href="#" lang="fr" hreflang="fr" class="ecl-language-list__link">français</a></li>
      <li><a href="#" lang="de" hreflang="de" class="ecl-language-list__link">Deutsch</a></li>
      <li><a href="#" lang="es" hreflang="es" class="ecl-language-list__link">español</a></li>
      <li><a href="#" lang="nl" hreflang="nl" class="ecl-language-list__link">Nederlands</a></li>
      <li><a href="#" lang="pl" hreflang="pl" class="ecl-language-list__link">polski</a></li>
    </ul>
  </div>
</div>`
  },
  {
    dir: "social-media-follow",
    name: "Social media follow",
    cls: "ecl-social-media-follow",
    section: "feedback",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "none",
    audit: false,
    useWhen: ["Commission social-media channel links (homepage and footer)"],
    avoidWhen: ["Individual share actions — those belong on content pages"],
    agentPrompt: "Each link pairs an ecl-social-media-follow__icon with the network name as text. Keep visible network names — icons alone are not sufficient.",
    preserve: [
      "ecl-social-media-follow__list structure",
      "Visible network names on links"
    ],
    editable: ["Networks list", "hrefs"],
    limitations: ["Only official Commission channels"],
    invariants: ["Accessible name per network"],
    related: ["site-footer", "label"],
    tags: ["social", "follow", "networks"],
    description: "Social-media channel follow links with icons and names.",
    provenance: { observed: "2026-09-06", source: "https://commission.europa.eu/index_en", method: "live-site observation" },
    defaultMarkup: `<div class="ecl-social-media-follow">
  <div class="ecl-container">
    <ul class="ecl-social-media-follow__list">
      <li class="ecl-social-media-follow__item">
        <a class="ecl-link ecl-social-media-follow__link" href="#">Mastodon</a>
      </li>
      <li class="ecl-social-media-follow__item">
        <a class="ecl-link ecl-social-media-follow__link" href="#">LinkedIn</a>
      </li>
      <li class="ecl-social-media-follow__item">
        <a class="ecl-link ecl-social-media-follow__link" href="#">YouTube</a>
      </li>
    </ul>
  </div>
</div>`
  }
];
