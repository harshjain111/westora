# WESTORA GLOBAL — CLAUDE CODE BUILD PLAYBOOK

**62 prompts across 8 phases.** Paste one at a time, in order. Review output before moving on.

**Before Prompt 1, place these in the repo root:**
- `CLAUDE.md`
- `docs/westora-prd.md`
- `docs/Westora_Global_Website_Structure_and_Content.md`
- `public/images/products/` — the 17 extracted product images + hero + logos

**Two hard gates in this playbook:**
- **Gate A (before Prompt 27):** the UI/UX reference image board must be attached. Everything before that point builds against provisional tokens.
- **Gate B (before Prompt 58):** client-verified registration numbers, address, and lab figures must be in hand.

---

# PHASE 0 — FOUNDATION (Prompts 1–8)

### 1
```
Read CLAUDE.md, docs/westora-prd.md and docs/Westora_Global_Website_Structure_and_Content.md in full before doing anything.

Then give me back, in your own words and in under 300 words: what we are building, who the visitor is, the three qualities the site must convey, and the two hardest constraints in CLAUDE.md. Do not write any code yet.
```

### 2
```
Scaffold the project: Next.js 15 with App Router, TypeScript strict, Tailwind CSS v4, pnpm.

tsconfig: strict true, noUncheckedIndexedAccess true, paths alias @/*.
Install: framer-motion, react-hook-form, zod, @hookform/resolvers, clsx, tailwind-merge, @supabase/supabase-js, @supabase/ssr, resend, react-email, @react-email/components, recharts.

Add .env.example with every variable listed in PRD §7. Add .gitignore. Do not install anything not listed.
```

### 3
```
Set up the design tokens in app/globals.css using Tailwind v4's CSS-first @theme block.

Use the exact token contract from CLAUDE.md §4 — token names are final, values are provisional. Add a prominent comment block above them stating that these values are provisional and will be replaced once the reference board arrives, and that no component may use a raw hex or a Tailwind default palette class.

Also define the spacing scale, type scale, container max-width and radius values from CLAUDE.md §5–6 as theme tokens.
```

### 4
```
Set up typography with next/font/local. Three roles per CLAUDE.md §5: font-display (Instrument Serif), font-body (Inter Tight), font-mono (JetBrains Mono).

Download and self-host the woff2 files under app/fonts/. No Google Fonts network request. Wire the CSS variables into the @theme block and apply font-body as the document default in the root layout.
```

### 5
```
Build the layout primitives in components/ui/:

Container — max-w-[1320px], responsive gutters 24px→64px
Section — vertical rhythm 96px mobile → 160px desktop, optional `surface` prop ('default' | 'deep') that switches ground and text tokens
Eyebrow — mono, uppercase, letter-spaced, accent colour, 12px
Heading — display face, levels 1-3, correct semantic tag via an `as` prop
Rule — hairline horizontal divider using --color-rule
Chip — small mono pill, variants 'accent' | 'neutral'

Plus lib/utils/cn.ts (clsx + tailwind-merge). Tokens only, no raw colours.
```

### 6
```
Build components/ui/Button.tsx.

Variants: primary (accent fill), secondary (ghost with border), ghost-on-deep (for use on dark surfaces). Sizes: md, lg.
Requirements: visible focus ring, min 44px touch height, loading state with a disabled state and a label swap, renders as <button> or <a> via an `as` prop.

Copy rule from CLAUDE.md §10: buttons say what happens. Sentence case.
```

### 7
```
Create data/company.ts — a single typed config for all company facts.

Shape it so that every field is optional-with-empty-string, and export a helper that filters out empty entries. This enforces the empty-means-omit rule from CLAUDE.md §11.

Include: registrations (fssai, iec, spicesBoard, apeda, teaBoard, gstin, cin, fdaFfr), address (line1, line2, city, state, country, pincode), contact (email, phone, whatsapp), tradeTerms (incoterms, ports, payment, transitUk, transitUsEast, transitUsWest, samplePolicy), stats (established, growerPartnerships, shipmentsDelivered).

Leave every value as an empty string with a // CLIENT TO CONFIRM comment. Do not invent any value.
```

### 8
```
Create data/products.ts using the Product interface in PRD §6.

Populate all 17 SKUs from docs/Westora_Global_Website_Structure_and_Content.md §3.1, verbatim — names, origins, botanical names, hero lines, descriptions, specs, forms, packaging, provenance arrays, categories.

Every spec marked [CONFIRM] in the content doc gets unverified: true.
Apply the three approved copy corrections: STARANISE → Star Anise; bay leaf "vibrant green" → "deep olive-green" with the tamala/nobilis note; remove "Fresh" from black pepper's forms.
hasGI: false for all until the client confirms GI registrations.

Also export derived helpers: getByCategory, getBySlug, categoryCounts. Nothing may hardcode these counts anywhere else.
```

---

# PHASE 1 — MARKETING PAGE STRUCTURE (Prompts 9–26)

### 9
```
Build components/sections/Nav.tsx per PRD FR-1.

Sticky. Transparent over the hero, switches to solid brand-deep with a hairline bottom border after 80px scroll (200ms transition). Links: Catalogue, Quality, About, FAQ — smooth-scroll with an 80px offset. Right-side primary CTA "Request a quote". Active section tracked with IntersectionObserver.

Mobile: hamburger opening a full-height right drawer on brand-deep, focus-trapped, closing on link click / ESC / backdrop tap.
```

### 10
```
Build components/sections/Hero.tsx per PRD FR-2.

min-h-[90svh], full-bleed background image with a dark scrim at ~55%, next/image with priority and blur placeholder. No carousel, no video.

Content is FINAL and locked — use verbatim:
Eyebrow: NORTHEAST INDIA · EXPORTING TO UK & USA
H1: Premium origins. Global excellence.
Sub: We export 17 high-value crops from Northeast India to buyers in the United Kingdom and United States — traceable to district, tested to spec, delivered on schedule.
Primary CTA: View the catalogue → #catalogue
Secondary CTA: Request a quote → #enquiry
Micro-trust line (mono, reduced opacity): FOB Kolkata · CIF · DDP · Samples in 7 days · MOQ from 500 kg

Load animation: staggered fade-up eyebrow → H1 → sub → CTAs, 80ms stagger, 400ms, once only, disabled under prefers-reduced-motion.
Desktop: left-aligned lower third. Mobile: centred, vertically centred.
```

### 11
```
Build components/sections/CredentialStrip.tsx per PRD FR-3.

Full-width band on brand-deep, directly under the hero. Four cells with hairline dividers:
17 / Origin-locked crops
6 / Northeast states sourced
100% / Lot-tested, COA with every shipment
UK · US / Primary export markets

Numbers count up on first scroll into view (600ms easeOut), static under reduced motion. Below, a mono registration line at 11px and reduced opacity, driven by data/company.ts — omitting any empty entry, and omitting the whole line if all are empty. 2×2 on mobile.
```

### 12
```
Build components/product/ProductCard.tsx per PRD FR-4.5–4.8.

Square image (1:1, object-cover) in an overflow-hidden container, product name in display face, origin + botanical name in mono at reduced opacity, optional GI chip top-right.

Hover (gated behind @media (hover: hover)): image scale(1.06) 350ms ease-out, caption block lifts 8px, a "View specs →" affordance fades in, card border shifts to accent at low opacity.

Keyboard focusable with a visible focus ring; Enter and Space open the modal. Descriptive alt text from the product data.
```

### 13
```
Build components/product/CategoryFilter.tsx.

Pill buttons: ALL, SPICES, CHILLIES, TEA, RICE, OTHER — with counts derived from data/products.ts via categoryCounts, never hardcoded. Active pill uses the accent token. Mono labels, uppercase.

Keyboard operable as a radio group with arrow-key navigation and correct ARIA.
```

### 14
```
Build components/sections/Catalogue.tsx per PRD FR-4.

Section header: eyebrow "THE CATALOGUE", H2 "Seventeen crops, five categories", sub "Every product below is available for sampling. Click any item for specifications and to raise an enquiry."

CategoryFilter, then the grid: 4-up ≥1280, 3-up ≥1024, 2-up ≥640, 1-up below. Gutters scale 16→32px. Client-side instant filtering with a Framer Motion layout transition (300ms) — no reload, no spinner.

Feature Lakadong Turmeric and King Chilli in the first two positions of the ALL view.
First row images eager, everything else lazy.
```

### 15
```
Build components/product/ProvenanceLine.tsx — the signature element per CLAUDE.md §8.

Takes a string array of nodes. Renders a hairline horizontal line with accent-coloured node dots, place labels above in mono, and role labels below (origin / consolidation / load port / discharge) in mono at reduced opacity.

On scroll into view: the line draws left→right over 600ms, dots land in a 100ms stagger. Static under reduced motion.
Two sizes via a prop: 'inline' (product modal/page) and 'feature' (large, for the Quality section).
This is the one place we spend boldness — get the detailing right and keep it restrained.
```

### 16
```
Build components/product/ProductSpecTable.tsx.

Two-column mono table, hairline row dividers. Label left in reduced opacity, value right in full opacity.

Critical rendering rule from CLAUDE.md §11.3: specs with unverified: true render with a visible amber dev marker when NODE_ENV is development, and do NOT render at all in production. Add a build-time console warning listing every remaining unverified field.
```

### 17
```
Build components/product/ProductModal.tsx per PRD FR-5.

Backdrop: dark 60% + backdrop-blur-sm. Modal scales in from 0.97 over 250ms.
Desktop two columns: image left (with thumbnail row if multiple images), content right. Mobile: stacked full-height sheet with its own scroll, image first.

Right column order: name · origin + botanical + GI chip · hero line · description · ProductSpecTable · forms · packaging · ProvenanceLine (inline size).

Behaviour: body scroll locked, focus trapped, ESC closes, backdrop click closes, focus returns to the originating card. Prev/Next buttons bound to ← / → keys, respecting the active filter. URL updates shallowly to ?product=slug; loading that URL directly opens the modal.

Leave a clearly marked slot below the content for the enquiry form — we build that in Phase 3.
```

### 18
```
Build components/sections/HowWeWork.tsx per PRD FR-6.

Four columns (2×2 tablet, stacked mobile), numbered 01–04 in mono. Content verbatim from content doc §4 — the four steps: Sourced at origin, Processed to spec, Tested before it moves, Shipped and documented.

Scroll-triggered stagger reveal, 100ms apart.
```

### 19
```
Build components/sections/Quality.tsx per PRD FR-7 — this is the argumentative centre of the site and gets the most vertical space of any non-catalogue section.

Full-width brand-deep surface. Header: eyebrow "QUALITY & COMPLIANCE", H2 "Built for buyers who get audited.", sub per the content doc.

Block A — registrations as a mono key/value list, driven by data/company.ts. Empty entries omit entirely. Never render N/A or a placeholder.
Block B — the per-lot test panel as a two-column table (content doc §5 Block B).
Block C — document set as inline mono chips.
Block D — trade terms mono block from data/company.ts.
Anchor the section with ProvenanceLine at 'feature' size.

Give the ETO / pesticide line visual weight — it is the single most persuasive fact on this page for a UK/US buyer.
```

### 20
```
Build components/sections/About.tsx per PRD FR-8.

Two columns: image left, narrative right. Reverses to text-first on mobile.
H2: "We only sell what our region grows." Three-paragraph narrative verbatim from content doc §6.

Stat row below: hairline-divided, mono, driven by data/company.ts stats. If any stat value is empty, that cell omits. If all are empty, the entire row does not render. Do not invent numbers.
```

### 21
```
Build components/sections/OriginMap.tsx per PRD FR-9.

Inline hand-simplified SVG outline of Northeast India — not a map library, not Google Maps. Six state markers on brand-deep ground with accent dots.

Hover or tap reveals a tooltip card with the state name and its crops (mapping in content doc §7). Clicking a state filters the catalogue to that state's products and scrolls to #catalogue.

Every marker is a <button> with an accessible label, keyboard navigable, ≥44px touch target.
```

### 22
```
Build components/sections/BuyerVoices.tsx per PRD FR-10.

Default render: the "What working with us looks like" three-step content from content doc §8 option B — Tell us what you need / Sample first, always / Then we contract.

The component accepts an optional testimonials array. Only if a real, attributed array is supplied does the testimonial layout render.

HARD RULE from CLAUDE.md §11.1: do not commit placeholder, sample, lorem or invented testimonials at any point, including during development. Leave the array undefined.
```

### 23
```
Build data/faq.ts and components/sections/Faq.tsx per PRD FR-11.

Eight questions verbatim from content doc §9. Accordion, single column, max-w-[720px]. Use native <details>/<summary> or a headless accordion — must be keyboard operable and screen-reader correct. First item open by default, multiple may be open at once.

Answers containing [CONFIRM] values must pull those values from data/company.ts and gracefully soften the sentence when a value is empty, rather than printing a blank or a placeholder.
```

### 24
```
Build components/sections/Footer.tsx per PRD FR-13.

Four columns on brand-deep, collapsing to an accordion on mobile:
1 — logo (reversed), "Premium origins. Global excellence.", one-line descriptor
2 — Catalogue links by category + Download catalogue (PDF)
3 — About, Quality & Compliance, How we work, FAQ, Privacy Policy, Terms
4 — email, phone, WhatsApp, full registered address as text

Registration bar above copyright: mono, 11px, 50% opacity, driven by data/company.ts with empty-means-omit.
Bottom bar: © 2026 Westora Global. All rights reserved. · Designed and built by Vibrnd · social icons.
```

### 25
```
Assemble app/page.tsx — compose all sections in PRD §4 order with correct section IDs for the anchor navigation.

Confirm the whole page renders end to end at 375, 768, 1024, 1440 and 1920. Report anything that breaks. Do not fix layout by adding filler copy — change the layout.
```

### 26
```
Full audit pass on everything built so far. Report as a checklist, and fix what you find:

1. Any raw hex, rgb(), or Tailwind default palette class (gray-, green-, amber- etc). Zero tolerance — list every occurrence.
2. Any hardcoded product name, spec, count or category that should come from data/products.ts.
3. Any invented number, testimonial, registration or company statistic.
4. Any copy that deviates from the content doc, or uses a banned word from CLAUDE.md §10.
5. Any animation not on the CLAUDE.md §7 motion budget.
6. Any missing prefers-reduced-motion guard or @media (hover: hover) gate.
7. Any border radius above 2px, or any shadow.
8. Any 'use client' that could be pushed further down the tree.
```

---

# PHASE 2 — VISUAL LOCK (Prompts 27–31)

> **🔒 GATE A — do not start Phase 2 until the UI/UX reference image board is attached.**

### 27
```
I'm attaching the UI/UX reference image board now. [ATTACH IMAGES]

Study them and do NOT write code yet. Give me back:
1. What these references have in common — palette temperature, contrast approach, type treatment, density, use of photography, motion feel.
2. Where they conflict with the provisional palette and layout decisions in CLAUDE.md.
3. Your proposed six final token values as hex, with a one-line justification for each, derived from the board plus the Westora logo.
4. Every WCAG AA contrast pair check for those six values — body text, large text, accent on both grounds, muted text on both grounds. Flag any failure and propose the adjustment.

Remember the brief: subtle, minimal, quiet, premium. Trust, authority, relationship. The accent appears at most three times per viewport. Product photography is the only saturated colour.
```

### 28
```
Apply the approved palette. Change ONLY the six values in app/globals.css.

If applying it requires editing any component file, stop and tell me — that means the token system was implemented wrong and we fix that first rather than patching around it.

Then screenshot the full page and report anything that reads worse than it did with the provisional palette.
```

### 29
```
Typography pass against the reference board. Review every type decision on the live page:

- Is the display/body pairing doing what the references do?
- Is the scale creating enough hierarchy jump between H1, H2 and body?
- Is the mono being used consistently for data and never for prose?
- Is line length in the About and FAQ sections in the 60–75 character range?
- Do the eyebrows read as structural labels rather than decoration?

Propose adjustments as a list with rationale before changing anything.
```

### 30
```
Motion pass. Audit every animation against CLAUDE.md §7 and the feel of the reference board.

Remove anything not on the budget. Tune easing and duration so the whole page feels calm and deliberate rather than eager. The provenance line draw is the one moment allowed to be noticeable — make sure it lands well and that nothing else competes with it.

Verify prefers-reduced-motion produces a fully static, fully usable page.
```

### 31
```
Design self-critique. Look at the full page at 1440 and at 375 and answer honestly:

1. What on this page would a UK procurement manager read as "small-time trader"?
2. Where are we decorating rather than informing?
3. Which single element, if removed, would make the page better? (Chanel's rule — remove one accessory.)
4. Does the page pass the three-second test: does a stranger immediately understand this is a real Northeast India export house selling to the UK and US?

Then implement your answer to #3.
```

---

# PHASE 3 — DATA LAYER & ENQUIRY (Prompts 32–41)

### 32
```
Set up Supabase. Create supabase/migrations/0001_init.sql with the full schema from PRD §6: leads, lead_activity, profiles, plus the three indexes.

Then 0002_rls.sql with the RLS policies exactly as specified: no public SELECT on leads under any circumstance; authenticated admin gets full access; viewer gets SELECT only; inserts happen only through the server-side service path.

Add lib/supabase/client.ts, server.ts and middleware.ts using @supabase/ssr.
```

### 33
```
Build lib/schemas/enquiry.ts — one Zod schema, imported by both the client form and the Server Action.

Fields and validation exactly per PRD FR-12.2. Note: accept all email domains including free webmail — many legitimate small importers use Gmail and rejecting them would cost real leads.

Export the inferred TypeScript type.
```

### 34
```
Build lib/utils/reference.ts — generate WG-{YYYY}-{NNNN} where NNNN is a zero-padded per-year sequence.

Generate it server-side inside the insert transaction so concurrent submissions cannot collide. Write a Postgres function or use a sequence table — your call, but explain the concurrency guarantee.
```

### 35
```
Build components/form/EnquiryForm.tsx per PRD FR-12.

react-hook-form + the Zod resolver. A `variant` prop: 'full' (main section) and 'compact' (product modal). Optional lockedProduct prop that pre-fills and locks the product field with an "add more products" expander.

Sub-components in components/form/: Field, CountrySelect (full ISO list, default United Kingdom), ProductMultiSelect (17 SKUs from data/products.ts), ConsentCheckbox (unticked by default, links to /privacy).

Validation errors appear on blur, not on every keystroke. All labels, placeholders and error strings verbatim from content doc §10.
```

### 36
```
Build the success and error states.

Success (PRD FR-12.6): replaces the form in place — no redirect, no page change. Content verbatim:
"Enquiry received. / We've sent a copy to your email. Someone from our team will reply within one working day — usually sooner. / Reference: WG-2026-0417"

Error (FR-12.7): inline, with info@westoraglobal.com as the fallback. Critically — the user's typed data must survive the error. Never clear the form on failure.

Field-level microcopy verbatim from the content doc.
```

### 37
```
Build lib/actions/enquiry.ts — the Server Action.

Sequence: validate with the shared Zod schema → check the honeypot → verify Turnstile server-side → rate-limit check (5 per IP per hour) → generate reference → insert into leads → fire both emails → return a typed result.

Never throw a raw error to the client. Capture utm params and ip_country. Log failures server-side with enough detail to debug, without logging PII to any third party.
```

### 38
```
Wire Cloudflare Turnstile: invisible widget on the form, server-side verification in the action, plus the honeypot field (visually hidden, aria-hidden, tabindex -1).

Add the rate limiter. Use Vercel KV or a simple Postgres-backed counter — pick one and explain the tradeoff.
```

### 39
```
Build the emails with React Email in emails/.

NotificationEmail — internal, to info@westoraglobal.com. Content verbatim from content doc §5 "Notification email to Westora", including the admin deep link. Subject: New enquiry — {product} — {company_name} ({country}). Plain and scannable; this gets read on a phone.

AutoReplyEmail — to the buyer. Content verbatim from content doc §5 "Auto-reply to the buyer". Brand-consistent but restrained. Include a plain-text version.

Wire both through Resend in the Server Action.
```

### 40
```
Build components/sections/EnquirySection.tsx per PRD FR-12 / content doc §10.

Split panel: left on brand-deep with eyebrow "START HERE", H2 "Tell us what you need.", the body copy, the three mono commitment lines, and direct contacts from data/company.ts. Right on surface with EnquiryForm variant="full".

Then wire EnquiryForm variant="compact" into the ProductModal slot from Prompt 17, with lockedProduct set. On mobile the modal form must be reachable by scrolling — never behind a tab or accordion.
```

### 41
```
End-to-end test of the enquiry flow. Report results:

- Submit from the main form → row in Supabase, both emails sent, correct reference
- Submit from a product modal → source_section and source_product recorded correctly
- Validation failures on every required field
- Consent unticked → blocked
- Honeypot filled → silently rejected, no row created
- Rate limit → 6th submission in an hour blocked
- Network failure mid-submit → error state shown, typed data preserved
- Anonymous client attempting to SELECT from leads → denied by RLS

Fix anything that fails.
```

---

# PHASE 4 — ADMIN PANEL (Prompts 42–49)

### 42
```
Build the auth layer: app/admin/login/page.tsx with Supabase email+password sign-in, and middleware.ts protecting every /admin route.

Unauthenticated users redirect to /admin/login. After login, redirect to the originally requested path. Roles come from the profiles table — enforce them in RLS, not only in the UI.

Login page styled in the same design language as the site. Errors are specific and actionable.
```

### 43
```
Build app/admin/layout.tsx — the admin shell.

Sidebar (collapsing to a bottom bar on mobile): Dashboard, Leads, Sign out. Current user email and role displayed. Same tokens and type system as the marketing site so it feels like one product.

Fully responsive — Westora will check leads on a phone.
```

### 44
```
Build the admin dashboard per PRD FR-15.3.

Cards: leads today / 7d / 30d. Status funnel (new → contacted → quoted → sampled → won/lost). Top-enquired products — this tells the client what to stock, so give it prominence. Country split UK / US / other. A 30-day submissions line chart with Recharts.

Code-split Recharts so it never touches the marketing bundle. Show real empty states, not zeros presented as data.
```

### 45
```
Build components/admin/LeadsTable.tsx per PRD FR-15.4.

Paginated (25/page), sortable by date, filterable by status / country / product / date range, free-text search across name, company and email. Inline status dropdown with optimistic UI and rollback on failure.

Columns: date, reference, company, name, country, products, volume, status. Row click opens the detail view. Responsive: cards on mobile, table on desktop.
```

### 46
```
Build app/admin/leads/[id]/page.tsx per PRD FR-15.5.

All submitted fields laid out clearly. Action buttons: mailto: pre-filled with a reply, and wa.me deep link to the phone number. Status control, assignment dropdown, internal notes textarea with save.

Activity timeline from lead_activity, newest first. Every status change, note and assignment writes an activity row.
```

### 47
```
Build CSV export per PRD FR-15.6 — exports the currently filtered set, not the whole table.

Include every field. Filename: westora-leads-{YYYY-MM-DD}.csv. Handle commas and quotes in the message field correctly.
```

### 48
```
Security audit of the admin panel. Report and fix:

- Confirm SUPABASE_SERVICE_ROLE_KEY appears in no client bundle. Grep the build output.
- Confirm a viewer-role user cannot update or delete, verified at the RLS layer with the UI bypassed.
- Confirm an anonymous request to every admin route redirects.
- Confirm no leads data is reachable from the public client.
- Confirm no PII is sent to analytics.
```

### 49
```
Seed 20 realistic-shaped test leads for QA — clearly marked as test data with a TEST- reference prefix, and give me a single SQL statement to delete them all before launch.

These are for testing the table, filters and charts only. Do not seed anything that could be mistaken for real client data.
```

---

# PHASE 5 — PRODUCT PAGES & SEO (Prompts 50–55)

### 50
```
Build app/products/[slug]/page.tsx per PRD FR-14.

17 statically generated pages via generateStaticParams from data/products.ts. Same content as the modal in a full-page layout: hero image, name, origin, botanical, GI chip, hero line, description, spec table, forms, packaging, provenance line, then the full enquiry form with the product locked.

Plus a related-products row (same category, excluding self). Breadcrumb: Home / Catalogue / Category / Product.
```

### 51
```
Metadata for every route using the Next.js Metadata API.

Root: title "Westora Global — Spice, Tea & Rice Exporters from Northeast India | UK & US Supply" and the meta description from content doc §6.

Per product: unique title and description built from the product's name, origin and hero line — targeting the priority keywords in PRD §10. Never duplicate a description across two pages.

OG and Twitter cards throughout.
```

### 52
```
JSON-LD structured data:

Organization with PostalAddress on the root layout, driven by data/company.ts (omit fields that are empty).
Product schema on each of the 17 product pages.
FAQPage generated from data/faq.ts.
BreadcrumbList on product pages.

Validate every block against schema.org and report the results. The FAQPage markup is the AEO play — it's what surfaces Westora when a buyer asks an AI assistant to find a Northeast India supplier.
```

### 53
```
Build app/sitemap.ts and app/robots.ts, both generated from data/products.ts so they can never drift out of sync with the catalogue.
```

### 54
```
Generate OG images: a branded 1200×630 for the root and one per product page using next/og, pulling the product name, origin and a token-derived background.

Keep them in the site's visual language — no gradients, no decoration beyond the wordmark and type.
```

### 55
```
Write app/privacy/page.tsx and app/terms/page.tsx.

Privacy must be GDPR-appropriate for UK visitors: what we collect via the enquiry form, why, lawful basis (legitimate interest / consent), retention, third-party processors (Supabase, Resend, Vercel, Cloudflare, Plausible), and data subject rights with the contact route.

Plain language, same design system. Add a clear note at the top of the file that this is a working draft requiring client legal review before launch.
```

---

# PHASE 6 — QA (Prompts 56–59)

### 56
```
Full accessibility audit against CLAUDE.md §12. Report as a pass/fail checklist with every failure located, then fix:

- Contrast on every foreground/background pair with the FINAL palette
- Keyboard-only traversal of the entire page including the modal, filter, map and accordion
- Visible focus rings everywhere, no outline:none without replacement
- Modal focus trap and focus restoration
- Labels and aria-describedby on every field
- Descriptive alt text on all 17 product images
- Heading order, one h1 per document
- Touch targets ≥44px
- prefers-reduced-motion producing a fully static, fully usable page
- Screen reader pass on the catalogue and the enquiry form
```

### 57
```
Performance audit against PRD §11. Report Lighthouse scores for mobile and desktop, then optimise to hit: Performance ≥90, Accessibility ≥95, SEO ≥95, LCP ≤2.5s on mobile 4G, CLS <0.1, INP <200ms, initial JS <150KB gzipped.

Check specifically: are all images AVIF/WebP with explicit dimensions; is the hero priority-loaded; is everything below the fold lazy; are fonts self-hosted and preloaded; is the admin bundle fully split from the marketing page; is the marketing page actually statically rendered.
```

### 58
```
Content verification pass. 

Go through every rendered string on the site and produce a table: the text, its source in the content doc, and whether it matches verbatim. Flag every deviation.

Then produce a second table listing every remaining unverified: true spec, every empty field in data/company.ts, and every place the site currently omits content because a client value is missing. This is the punch list I send the client.
```

> **🔒 GATE B — do not proceed past 58 until the client returns verified registration numbers, address and lab figures.**

### 59
```
Cross-browser and device QA. Test and report: Chrome, Safari, Firefox, Edge on desktop; iOS Safari and Chrome Android on mobile.

Specifically verify: the hover-zoom does not stick on touch devices; the modal scroll-lock works on iOS Safari; the sticky nav does not jump with mobile browser chrome; the country selector is usable on mobile; backdrop-blur degrades acceptably where unsupported.
```

---

# PHASE 7 — LAUNCH (Prompts 60–62)

### 60
```
Deployment setup: Vercel project, all environment variables from PRD §7, custom domain westoraglobal.com with the www redirect, and security headers including a CSP that permits Supabase, Resend, Turnstile and Plausible and nothing else.

Confirm SUPABASE_SERVICE_ROLE_KEY is set as a server-only variable.
```

### 61
```
Wire analytics: Vercel Analytics plus Plausible (cookieless — it keeps the GDPR story clean).

Implement every event in PRD §12 with exactly those names and payloads. Verify no PII appears in any payload. Confirm the enquiry funnel is measurable end to end: hero_cta_click → product_modal_open → enquiry_form_start → enquiry_form_submit.
```

### 62
```
Final pre-launch checklist. Verify and report on each:

1. All test leads deleted (run the cleanup SQL from Prompt 49)
2. Zero unverified specs rendering in production
3. No invented testimonials, statistics, registrations or GI claims anywhere
4. All registration numbers match what the client supplied, character for character
5. Full registered address correct in footer and schema
6. Both emails deliver, and neither lands in spam — test against Gmail, Outlook and a corporate domain
7. Admin login works for every client user at the correct role
8. Every form path tested once more on production
9. sitemap.xml and robots.txt live and correct
10. 404 page exists and is on-brand
11. Catalogue PDF download works
12. Lighthouse targets met on the production URL

Then give me a written handover: how to add a product, how to update a registration number, how to add an admin user, and how to swap the hero image — written for someone who is not a developer.
```

---

## PROMPTS TO KEEP HANDY DURING THE BUILD

**When something looks generic:**
```
This is reading like a template. Against CLAUDE.md §1 and the reference board: what specifically makes it generic, and what would a designer who had actually visited a Meghalaya turmeric farm do instead? Propose before changing.
```

**When a colour slips in:**
```
Grep the entire codebase for raw hex values, rgb(), hsl(), and Tailwind default palette classes. List every occurrence with its file and line, then replace each with the correct token.
```

**When you suspect invented data:**
```
List every number, certification, statistic, testimonial and claim currently rendering on the site, with its source. Anything that does not trace to data/company.ts, data/products.ts, or the content doc gets removed now.
```

**When a section feels overbuilt:**
```
Chanel's rule. Look at this section and remove one thing. Tell me what you removed and why it was the right one.
```
