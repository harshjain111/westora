# WESTORA GLOBAL — PRODUCT REQUIREMENTS DOCUMENT

**Project:** Westora Global export website + lead management panel
**Client:** Westora Global, Guwahati, Assam
**Built by:** Vibrnd
**Version:** 1.0 · July 2026
**Companion docs:** `Westora_Global_Website_Structure_and_Content.md` (content source of truth) · `CLAUDE.md` (build conventions) · `westora-build-playbook.md` (prompt sequence)

---

## 1. THE VISION — read this before writing a single line of code

Westora Global exports 17 origin-locked crops from Northeast India to buyers in the **United Kingdom and United States**. The people visiting this site are importers, spice blenders, food manufacturers, private-label brands and sourcing agents. They are not consumers.

They arrive carrying one unspoken question:

> **"Is this a real export house, or a broker with a PDF and a Gmail address?"**

Every pixel, every word, every millisecond of load time on this site exists to answer that question. This is not a brochure. **It is a credibility instrument.**

### The three things we are engineering for

**1. TRUST — "these people are real"**
Real registration numbers as plain text. A full physical address. Lab test panels named explicitly. Documents listed by name. No stock handshake photography, no invented testimonials, no badge walls without numbers. Trust in this category is built by *verifiable specificity*, not by claims of excellence.

**2. AUTHORITY — "these people know this crop"**
Curcumin percentages, Scoville ratings, moisture limits, HS codes, harvest windows, botanical names, the cassia-vs-Ceylon distinction, *Cinnamomum tamala* vs *Laurus nobilis*. A buyer should read three product cards and conclude that whoever wrote this has actually stood in the field. **One number beats one adjective. Always.**

**3. RELATIONSHIP — "I could work with these people"**
Plain, direct, unhurried language. Named processes. Honest limits ("when a lot doesn't meet spec, we don't ship it and find an excuse — we tell you"). Response commitments we actually keep. The tone of a competent counterparty, not a vendor chasing a sale.

### The aesthetic thesis

**Quiet, precise, confident, uncluttered.** Subtle and minimal — the restraint *is* the message. Premium in B2B food trade reads as: enormous whitespace, disciplined type, one accent colour used sparingly, product photography carrying all the visual energy, and specification data set in a monospace face so it reads like a certificate of analysis rather than marketing.

**The anti-brief.** Do not build what "spice exporter India" websites look like: orange gradients, rotating hero carousels, scrolling certification-logo marquees, three WhatsApp float buttons, stock photos of businesspeople shaking hands, `<marquee>`-energy animations, "We Strive For Excellence" headers. Every one of those signals *small-time trader* to a UK procurement manager.

**Reference set** (attached separately as image board): Diaspora Co. · Burlap & Barrel · ofi (Olam Food Ingredients) · JING Tea · CRED · Belazu.

---

## 2. GOALS & SUCCESS METRICS

### Primary goal
Convert qualified UK/US trade visitors into structured inbound enquiries, captured in a system Westora can actually work.

### Success metrics
| Metric | Target |
|---|---|
| Enquiry conversion rate (unique visitor → submitted form) | ≥ 3.5% |
| Enquiries with company name + volume filled | ≥ 70% of total |
| Bounce rate on landing | ≤ 45% |
| LCP (mobile, 4G) | ≤ 2.5s |
| Lighthouse: Performance / Accessibility / SEO | ≥ 90 / ≥ 95 / ≥ 95 |
| Time from enquiry → admin notification | ≤ 30s |
| Indexable product pages live at launch | 17 |

### Non-goals (explicitly out of scope for v1)
- E-commerce, cart, checkout, payments
- User accounts for buyers
- Live pricing or price display of any kind
- Multi-language (English only; en-GB spelling)
- Blog / CMS (deferred to v1.1)
- Live inventory integration
- Shipment tracking portal

---

## 3. AUDIENCE

| Segment | Priority | What they need on page | Dwell |
|---|---|---|---|
| Importer / distributor (UK, US) | P0 | MOQ, Incoterms, port, payment terms, repeatability | ~90s |
| Spice/tea blender, food manufacturer | P0 | Specs, curcumin %, SHU, moisture, ETO + pesticide status, COA | 3–5 min |
| Private label / specialty brand | P1 | Origin story, GI status, packaging flexibility, small MOQ | ~4 min |
| Food service / ethnic wholesaler | P2 | Availability, lead time, consistency | ~60s |
| Sourcing agent | P1 | Registrations, documents, "are you real" | ~45s |

**Device split assumption:** 60% desktop / 40% mobile. Desktop is where procurement research happens; mobile is where the first discovery happens. Both must be excellent; neither is an afterthought.

**Geography:** UK and US primary. Copy uses **en-GB spelling** throughout (`flavour`, `colour`, `enquiry`) — consistent with the existing catalogue and reassuring to UK buyers without alienating US ones.

---

## 4. INFORMATION ARCHITECTURE

```
/                          Single-page scroll, deep-linked sections
│
├── Nav                    Sticky, condenses on scroll
├── §1  Hero               Headline + dual CTA + micro-trust line
├── §2  Credential strip   4 stats + registration number line
├── §3  Catalogue          17 products, filterable grid  ← hero CTA target
│     └── Product modal    Enlarged image + specs + inline enquiry form
├── §4  How we work        4-step source-to-port sequence
├── §5  Quality & Compliance  Certifications · test panel · documents · trade terms
├── §6  About Westora      Narrative + stat row
├── §7  Origin map         Interactive Northeast India, 6 states
├── §8  Buyer voices       "What working with us looks like" (see §9.8)
├── §9  FAQ                8 questions, accordion
├── §10 Main enquiry form  Split panel
└── §11 Footer             4 columns + registration bar
│
├── /products/[slug]       17 static product pages (SEO)
├── /privacy               GDPR policy
├── /terms                 Terms of use
└── /admin                 Auth-gated lead management
      ├── /admin           Dashboard
      ├── /admin/leads     Table + filters
      └── /admin/leads/:id Detail drawer
```

---

## 5. FUNCTIONAL REQUIREMENTS

### FR-1 · Navigation
- **FR-1.1** Sticky header. Transparent over hero, solid surface background with hairline bottom border after 80px scroll. Transition 200ms.
- **FR-1.2** Links: Catalogue · Quality · About · FAQ. Smooth-scroll with 80px offset for the sticky header.
- **FR-1.3** Right-side primary CTA: `Request a quote` → §10.
- **FR-1.4** Active section highlighted via IntersectionObserver.
- **FR-1.5** Mobile: hamburger → full-height drawer sliding from right, dark surface, focus-trapped, closes on link click / ESC / backdrop tap.
- **FR-1.6** Logo returns to top on click.

### FR-2 · Hero
- **FR-2.1** Full-viewport-height section (`min-h-[90svh]`, not `100vh` — avoids mobile browser-chrome jump).
- **FR-2.2** Background: single still image, dark overlay at ~55%. **No carousel. No autoplay video.**
- **FR-2.3** Image served as AVIF/WebP, responsive `srcset`, `priority` loaded, LQIP blur placeholder.
- **FR-2.4** Content (FINAL — approved):
  - Eyebrow (mono, letter-spaced, accent): `NORTHEAST INDIA · EXPORTING TO UK & USA`
  - H1: **Premium origins. Global excellence.**
  - Sub: *We export 17 high-value crops from Northeast India to buyers in the United Kingdom and United States — traceable to district, tested to spec, delivered on schedule.*
- **FR-2.5** CTAs: primary `View the catalogue` (→ §3); secondary ghost `Request a quote` (→ §10).
- **FR-2.6** Micro-trust line below CTAs, mono, reduced opacity: `FOB Kolkata · CIF · DDP · Samples in 7 days · MOQ from 500 kg`
- **FR-2.7** Load animation: staggered fade-up, eyebrow → H1 → sub → CTAs, 80ms stagger, 400ms duration, **once only**, disabled under `prefers-reduced-motion`.
- **FR-2.8** Text left-aligned lower-third on desktop; centred, vertically centred on mobile.

### FR-3 · Credential strip
- **FR-3.1** Full-width band on dark brand surface, directly beneath hero.
- **FR-3.2** Four cells, hairline dividers: `17 / Origin-locked crops` · `6 / Northeast states sourced` · `100% / Lot-tested, COA with every shipment` · `UK · US / Primary export markets`
- **FR-3.3** Numbers count up on first scroll into view (600ms, easeOut). Static under reduced motion.
- **FR-3.4** Registration line beneath, mono, 11px, reduced opacity. Values from a single config object so unverified entries can be omitted with one edit.
- **FR-3.5** Mobile: 2×2 grid.

### FR-4 · Catalogue grid
- **FR-4.1** Renders all 17 products from a single typed data source (`/data/products.ts`).
- **FR-4.2** Filter pills: `ALL (17)` · `SPICES (7)` · `CHILLIES (3)` · `TEA (2)` · `RICE (2)` · `OTHER (3)`. Counts derived from data, never hardcoded.
- **FR-4.3** Filtering is client-side, instant, with a layout transition (Framer Motion `layout` or CSS `view-transition`). No page reload, no spinner.
- **FR-4.4** Grid: 4-up ≥1280px · 3-up ≥1024px · 2-up ≥640px · 1-up below. Gutter scales 16→32px.
- **FR-4.5** Card: square image (1:1, `object-cover`), product name (display face), origin + botanical name (mono, reduced opacity), optional GI chip top-right.
- **FR-4.6** **Hover:** image `scale(1.06)`, 350ms `ease-out`, container `overflow-hidden`. Caption block lifts 8px. A `View specs →` affordance fades in. Card border shifts to accent at low opacity. **Touch devices get no hover state** — use `@media (hover: hover)`.
- **FR-4.7** Cards are keyboard-focusable with a visible focus ring; Enter/Space opens the modal.
- **FR-4.8** Images lazy-loaded below the fold, eager for the first row.

### FR-5 · Product modal
- **FR-5.1** Opens on card click. Backdrop: dark at 60% + `backdrop-blur-sm`. Modal scales in from 0.97, 250ms.
- **FR-5.2** Desktop: two columns (image left, content right). Mobile: stacked, image first.
- **FR-5.3** Left column: enlarged image, thumbnail row if multiple assets exist.
- **FR-5.4** Right column, in order: product name · origin + botanical + GI chip · hero line · description · **specifications table (mono)** · forms available · packaging · provenance line.
- **FR-5.5** **Inline enquiry form** below the content — no second click, no separate page. Product field pre-filled and locked to the current SKU, with an "add more products" expander.
- **FR-5.6** Body scroll locked while open. Focus trapped. ESC closes. Backdrop click closes. Focus returns to the originating card on close.
- **FR-5.7** Prev/Next navigation between products, bound to ← / → arrow keys, respecting the active filter.
- **FR-5.8** URL updates to `/?product=lakadong-turmeric` (shallow) so a buyer can share a link to one item. Direct load of that URL opens the modal.
- **FR-5.9** Mobile: modal is a full-height sheet with its own scroll; form is reached by scrolling, **never hidden behind a tab or accordion**.

### FR-6 · How we work
- **FR-6.1** Four columns (2×2 on tablet, stacked on mobile).
- **FR-6.2** Numbered `01`–`04` in mono — numbering is permitted here because the content is a genuine sequence.
- **FR-6.3** Scroll-triggered stagger reveal, 100ms apart.

### FR-7 · Quality & Compliance
- **FR-7.1** Full-width dark brand surface. This is the visual and argumentative centre of the site — it gets the most vertical space of any non-catalogue section.
- **FR-7.2** Block A — registrations, rendered as a **mono key/value list with real numbers**, driven by a config object. Any entry with an empty value is omitted from render entirely (never shown as "N/A" or a placeholder).
- **FR-7.3** Block B — per-lot test panel as a two-column table.
- **FR-7.4** Block C — document set, listed as inline chips.
- **FR-7.5** Block D — trade terms in a mono block: Incoterms, ports, payment, transit times, sample policy.
- **FR-7.6** Large-format provenance line graphic anchors the section.

### FR-8 · About
- **FR-8.1** Two-column: image left, narrative right. Reverses on mobile (text first).
- **FR-8.2** Three-paragraph narrative from the content doc.
- **FR-8.3** Stat row: hairline-divided, mono. **Driven by config — if the client cannot supply real figures, the row does not render.** No placeholder numbers ever reach production.

### FR-9 · Origin map
- **FR-9.1** Inline SVG outline of Northeast India (custom, hand-simplified — not an embedded map library, not Google Maps).
- **FR-9.2** Six state markers. Hover/tap reveals a tooltip card: state name + its crops.
- **FR-9.3** Clicking a state filters the catalogue to that state's products and scrolls to §3.
- **FR-9.4** Fully keyboard-navigable; each marker is a `<button>` with an accessible label.
- **FR-9.5** Mobile: tap opens tooltip; markers sized ≥44px touch target.

### FR-10 · Buyer voices
- **FR-10.1** Renders the "What working with us looks like" three-step content by default.
- **FR-10.2** Component accepts an optional `testimonials` array. **If and only if** real, attributed testimonials are supplied does the testimonial layout render.
- **FR-10.3** **Hard rule: no placeholder, sample, lorem, or invented testimonials are to be committed at any point, including during development.** Fake social proof is the single fastest way to lose a Western trade buyer.

### FR-11 · FAQ
- **FR-11.1** Eight-item accordion, single-column, `max-w-[720px]`.
- **FR-11.2** Native `<details>`/`<summary>` or a headless accordion — must be keyboard-operable and screen-reader-correct.
- **FR-11.3** First item open by default. Multiple items may be open simultaneously.
- **FR-11.4** Emits `FAQPage` JSON-LD from the same data source.

### FR-12 · Enquiry form (main + modal)
- **FR-12.1** One shared, reusable `<EnquiryForm>` component with a `variant` prop: `full` | `compact`.
- **FR-12.2** Fields and validation:

| Field | Type | Required | Validation |
|---|---|---|---|
| Full name | text | ✓ | 2–80 chars |
| Company name | text | ✓ | 2–120 chars |
| Work email | email | ✓ | RFC-valid; **reject free webmail? NO — many legitimate small importers use Gmail. Accept all.** |
| Phone / WhatsApp | tel + country dial selector | ✓ | E.164 after normalisation |
| Country | select | ✓ | Full ISO list, default United Kingdom |
| Products of interest | multi-select (17) | ✓ | ≥1 selected |
| Estimated volume | text | ○ | ≤80 chars |
| Destination port | text | ○ | ≤80 chars |
| Message | textarea | ○ | ≤2000 chars |
| Consent | checkbox | ✓ | must be true |

- **FR-12.3** Validation: Zod schema, shared between client and server. Inline field errors on blur, not on every keystroke.
- **FR-12.4** Spam protection: invisible honeypot field + Cloudflare Turnstile (preferred over reCAPTCHA for EU privacy posture) + server-side rate limit of 5 submissions per IP per hour.
- **FR-12.5** Submit via Next.js Server Action. Button enters loading state, is disabled, and the label changes to `Sending…`.
- **FR-12.6** Success: form is **replaced in place** by the success panel (no redirect, no page change) showing the reference code `WG-YYYY-NNNN`.
- **FR-12.7** Failure: inline error with the direct email address as fallback. **Never lose the user's typed data on error.**
- **FR-12.8** On success, fire two emails: internal notification to Westora, auto-reply to the buyer.
- **FR-12.9** GDPR consent checkbox is unticked by default and links to `/privacy`.
- **FR-12.10** Copy for all states (labels, placeholders, errors, success) is taken verbatim from the content doc §10.

### FR-13 · Footer
- **FR-13.1** Four columns, dark brand surface. Stacks to accordion on mobile.
- **FR-13.2** Registration bar above copyright, mono, low opacity, config-driven.
- **FR-13.3** Full registered address rendered as text (not an image) and marked up with `PostalAddress` schema.
- **FR-13.4** Catalogue PDF download link.

### FR-14 · Product pages (`/products/[slug]`)
- **FR-14.1** 17 statically generated pages via `generateStaticParams`.
- **FR-14.2** Same content as the modal, in a full-page layout, plus a "related products" row (same category).
- **FR-14.3** Unique `<title>` and meta description per product.
- **FR-14.4** `Product` JSON-LD per page.
- **FR-14.5** Breadcrumb: Home / Catalogue / Category / Product.

### FR-15 · Admin panel
- **FR-15.1** Route `/admin`, protected by Supabase Auth (email + password). Middleware redirects unauthenticated users to `/admin/login`.
- **FR-15.2** Roles: `admin` (full), `viewer` (read-only). Enforced by RLS, not just UI.
- **FR-15.3** Dashboard: leads today / 7d / 30d · status funnel · top-enquired products · country split (UK / US / other) · 30-day submissions line chart.
- **FR-15.4** Leads table: paginated, sortable by date, filterable by status / country / product / date range, free-text search across name, company, email. Inline status dropdown.
- **FR-15.5** Detail view: all submitted fields, `mailto:` and `wa.me` deep-link action buttons, status control, internal notes, assignment, activity timeline.
- **FR-15.6** CSV export of the current filtered set.
- **FR-15.7** Optimistic UI on status change with rollback on failure.
- **FR-15.8** Fully responsive — Westora will check leads on a phone.

---

## 6. DATA MODEL

### `products` — static, in-repo (not database)
Products change rarely and must be statically renderable for SEO and speed. Keep them in `/data/products.ts` as a typed constant.

```ts
export type Category = 'spices' | 'chillies' | 'tea' | 'rice' | 'other';

export interface Product {
  slug: string;              // 'lakadong-turmeric'
  name: string;              // 'Lakadong Turmeric'
  category: Category;
  origin: string;            // 'Meghalaya'
  originDistrict?: string;   // 'Jaintia Hills'
  botanical: string;         // 'Curcuma longa'
  hasGI: boolean;            // render GI chip
  giNumber?: string;         // only if verified
  heroLine: string;          // one sentence
  description: string;       // two sentences
  specs: { label: string; value: string; unverified?: boolean }[];
  forms: string[];
  packaging: string[];
  provenance: string[];      // ['Jaintia Hills','Guwahati','Kolkata','Felixstowe / New York']
  images: { src: string; alt: string }[];
  featured?: boolean;        // Lakadong + King Chilli
}
```

### `leads` — Supabase
```sql
create table leads (
  id                uuid primary key default gen_random_uuid(),
  reference         text unique not null,          -- WG-2026-0417
  full_name         text not null,
  company_name      text not null,
  email             text not null,
  phone             text not null,
  country           text not null,
  products          text[] not null default '{}',
  volume            text,
  destination_port  text,
  message           text,
  source_section    text not null,                 -- 'modal' | 'main_form' | 'product_page'
  source_product    text,
  status            text not null default 'new',   -- new|contacted|quoted|sampled|won|lost
  assigned_to       uuid references auth.users(id),
  internal_notes    text,
  consent_given     boolean not null,
  ip_country        text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx     on leads (status);
create index leads_country_idx    on leads (country);

create table lead_activity (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  actor       uuid references auth.users(id),
  action      text not null,        -- 'status_change' | 'note' | 'assigned'
  detail      text,
  created_at  timestamptz not null default now()
);

create table profiles (
  id     uuid primary key references auth.users(id) on delete cascade,
  email  text not null,
  role   text not null default 'viewer'   -- 'admin' | 'viewer'
);
```

**RLS:**
- `leads` INSERT: allowed for the anon role **only** via the Server Action's service path — public client cannot read.
- `leads` SELECT/UPDATE: authenticated users whose `profiles.role` is `admin` or `viewer` (viewer: SELECT only).
- `lead_activity`: same as leads.
- **No public SELECT on `leads` under any circumstance.** A leaked buyer list is a client-relationship-ending event.

**Reference generator:** `WG-{YYYY}-{4-digit zero-padded sequence per year}`. Generated server-side inside the insert transaction.

---

## 7. TECHNICAL ARCHITECTURE

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15, App Router** | RSC by default; `'use client'` only where interaction demands it |
| Language | **TypeScript, strict** | `noUncheckedIndexedAccess: true`; zero `any` |
| Styling | **Tailwind CSS v4** | CSS-first config; all tokens in `@theme` |
| Animation | **Framer Motion** | Only where CSS cannot do it; keep the bundle honest |
| Forms | **react-hook-form + Zod** | Shared schema client/server |
| Backend | **Supabase** | Postgres + Auth + RLS |
| Email | **Resend** | React Email templates |
| Spam | **Cloudflare Turnstile** | EU-privacy-friendlier than reCAPTCHA |
| Hosting | **Vercel** | Edge middleware for `/admin` auth |
| Images | `next/image` + AVIF/WebP | LQIP blur placeholders |
| Analytics | **Vercel Analytics + Plausible** | Cookieless; keeps the GDPR story clean |
| Charts (admin) | **Recharts** | Admin only, code-split |

### Rendering strategy
- `/` — static, revalidate `false`. It is a marketing page; it should be a CDN document.
- `/products/[slug]` — SSG via `generateStaticParams`.
- `/admin/**` — dynamic, `force-dynamic`, auth-gated.
- Server Actions handle all writes. **No public API routes that touch the leads table.**

### Environment variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # server only, never in a client bundle
RESEND_API_KEY
NOTIFICATION_EMAIL_TO              # info@westoraglobal.com
NOTIFICATION_EMAIL_FROM
TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

---

## 8. DESIGN SYSTEM

### 8.1 Colour palette — **PENDING FINAL DIRECTION**

> **⚠ BUILD RULE: the palette is not locked.**
> Rohit will attach a **UI/UX reference image board** before the visual pass. The final six values will be derived from that board plus the Westora logo.
>
> **Until then, build against semantic tokens only.** Every colour in the codebase must reference a token name — never a raw hex, never a Tailwind default like `text-gray-600`. When the palette lands, changing six values in `app/globals.css` must restyle the entire site with zero component edits. If a palette swap would require touching a component file, the token system has been implemented incorrectly.

**Token contract (names are final; values are provisional):**

```css
@theme {
  /* Provisional values — derived from the existing logo.
     REPLACE after the reference board is supplied. Names must not change. */

  --color-brand-deep:    #12301F;  /* primary dark surface: footer, quality section, nav-solid */
  --color-brand-mid:     #2E5540;  /* secondary dark, hover states, hairline rules */
  --color-accent:        #A8792C;  /* THE single accent — CTAs, active filter, GI chip */
  --color-surface:       #F4F2EB;  /* page ground */
  --color-surface-raised:#FFFFFF;  /* cards, modal ground */
  --color-ink:           #2A2B27;  /* body text — never pure black */

  /* Derived, do not add new base colours */
  --color-ink-muted:     color-mix(in srgb, var(--color-ink) 62%, transparent);
  --color-rule:          color-mix(in srgb, var(--color-brand-mid) 15%, transparent);
  --color-on-deep:       var(--color-surface);
  --color-on-deep-muted: color-mix(in srgb, var(--color-surface) 65%, transparent);
}
```

**Palette discipline — non-negotiable regardless of final values:**
1. **Six base colours. That is the entire palette.** No sevenths, no "just one more grey".
2. **The accent appears at most three times per viewport.** If it is everywhere it means nothing.
3. **Product photography is the only source of saturated colour on the page.** The chrome stays quiet so the turmeric looks like turmeric.
4. Body text is never `#000`. Backgrounds are never `#FFF` on the page ground (cards may be).
5. No gradients anywhere, except an image overlay scrim.
6. No coloured shadows. Minimal shadows generally — use hairline rules for separation instead.

**When the reference board arrives, derive the palette by this protocol:** pull the dominant neutral for `--color-surface`, the darkest brand-consistent value for `--color-brand-deep`, and exactly one saturated value for `--color-accent`. Check every foreground/background pair against WCAG AA (4.5:1 body, 3:1 large text) before committing. State the derivation in the commit message.

### 8.2 Typography

| Role | Primary | Free fallback | Applied to |
|---|---|---|---|
| Display | PP Editorial New / Ogg | **Instrument Serif** | H1, H2, product names |
| Body | Söhne / Suisse Int'l | **Inter Tight** | All running copy, buttons, nav, labels |
| Utility mono | Söhne Mono | **JetBrains Mono** | Specs, HS codes, MOQ, SHU, eyebrows, registration numbers, trade terms |

**The mono is the trust device.** Specification data set in monospace reads like a certificate of analysis rather than a sales sheet. Use it consistently and never for running prose.

Scale (rem): `0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.5 / 4`
Display leading `1.05`, tight tracking. Body leading `1.6`. Mono tracking `+0.02em`, uppercase for eyebrows and labels.
Self-host via `next/font/local`. No render-blocking Google Fonts request.

### 8.3 Layout & spacing
- Container `max-w-[1320px]`, gutters `24px` mobile → `64px` desktop.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Section vertical rhythm: `96px` mobile → `160px` desktop. **Generous. Whitespace is the budget item that makes this look premium.**
- Border radius: `2px` maximum, or `0`. No soft rounded cards — softness reads consumer, and this is a trade site.
- Separation is achieved by **hairline rules and whitespace**, not by shadows or boxes.

### 8.4 The signature element — the Provenance Line
A hairline horizontal route strip appearing on every product modal/page and once, large, in the Quality section:

```
JAINTIA HILLS ──── GUWAHATI ──── KOLKATA (INCCU) ──── FELIXSTOWE / NEW YORK
   origin            consolidation      load port           discharge
```

Nodes are small accent-coloured dots; labels above in mono, roles below in mono at reduced opacity. On scroll into view the line draws left→right (600ms) with dots landing in sequence (100ms stagger). Static under reduced motion.

**This is the one place boldness is spent.** Everything else on the page stays quiet. Do not add a second signature device.

### 8.5 Motion budget — deliberately small
| Element | Motion | Duration |
|---|---|---|
| Hero content | Staggered fade-up, once | 400ms |
| Section content | Scroll-triggered fade-up | 500ms |
| Product card image | `scale(1.06)` on hover | 350ms |
| Modal | Scale-in 0.97→1 + backdrop blur | 250ms |
| Provenance line | Left-to-right draw | 600ms |
| Filter change | Layout transition | 300ms |
| Counter stats | Count-up on first view | 600ms |

**Nothing else animates.** No parallax, no marquees, no floating shapes, no cursor followers, no scroll-jacking. Every animation respects `prefers-reduced-motion: reduce`.

### 8.6 Reference board
Rohit will supply a UI/UX reference image board before the visual pass (Prompt 24 in the playbook). **Do not finalise the visual layer without it.** If the board conflicts with anything in §8.1–8.5, **the board wins** — except for the accessibility floor in §11, which is absolute.

---

## 9. CONTENT

All copy is taken **verbatim** from `Westora_Global_Website_Structure_and_Content.md`. Do not paraphrase, do not "improve", do not add filler.

**Approved decisions:**
- **Hero: Option C** — `Premium origins. Global excellence.` with the traceability subline. Locked.
- en-GB spelling throughout.
- Catalogue copy corrections applied: `STARANISE` → `Star Anise`; bay leaf `vibrant green` → `deep olive-green` with the *tamala*/*nobilis* distinction; black pepper "Fresh" removed pending confirmation.

**Unverified-claim handling — critical.**
Every spec marked `[CONFIRM]` in the content doc carries `unverified: true` in the product data. Rendering rule:
- **Development:** unverified specs render with a visible dev-only amber marker so they are impossible to miss.
- **Production:** unverified specs **do not render at all.** A missing row is a non-event; a wrong curcumin figure on a shipped consignment is a legal and commercial problem.
- A build-time check logs a warning listing every remaining `unverified: true` field.

Same rule for registration numbers, the About stat row, and testimonials: **empty means omit, never means placeholder.**

---

## 10. SEO & AEO

- Metadata API for all routes. Unique title + description per product page.
- JSON-LD: `Organization` (with `PostalAddress`), `Product` ×17, `FAQPage`, `BreadcrumbList`.
- `sitemap.ts` and `robots.ts` generated from the product data.
- OG + Twitter cards; branded 1200×630 image per product page.
- Semantic heading order, one `<h1>` per document.
- Target queries: `lakadong turmeric supplier`, `bhut jolokia exporter`, `northeast india spice exporter`, `assam orthodox tea wholesale UK`, `chak-hao black rice supplier`, `bird's eye chilli exporter india`, `joha rice export`, `large cardamom supplier UK`.
- The `FAQPage` markup is the AEO play: it is what gets Westora surfaced when a buyer asks an AI assistant to find a Northeast India supplier.

---

## 11. PERFORMANCE, ACCESSIBILITY, SECURITY

**Performance**
LCP ≤2.5s (mobile 4G) · CLS <0.1 · INP <200ms · initial JS <150KB gzipped · all images AVIF/WebP with explicit dimensions · fonts self-hosted with `font-display: swap` · Recharts and admin code split out of the marketing bundle.

**Accessibility — WCAG 2.1 AA, non-negotiable**
Contrast 4.5:1 body / 3:1 large text · every interactive element keyboard-reachable with a visible focus ring · modal focus-trapped with focus restoration · form fields with real `<label>`s and `aria-describedby` errors · descriptive alt text on all product images · `prefers-reduced-motion` honoured everywhere · touch targets ≥44×44px · tested with keyboard only and with VoiceOver.

**Security**
`SUPABASE_SERVICE_ROLE_KEY` server-side only, never in a client bundle · RLS on every table with no public SELECT on leads · Zod validation server-side (client validation is UX, not security) · rate limiting on the enquiry action · Turnstile verified server-side · CSP headers · `/admin` protected at middleware level, not just in the UI · no PII in analytics events.

---

## 12. ANALYTICS EVENTS

```
hero_cta_click            { target: 'catalogue' | 'quote' }
product_card_click        { slug, category }
product_modal_open        { slug, source: 'grid' | 'map' | 'deeplink' }
catalogue_filter_change   { category }
origin_map_state_click    { state }
faq_open                  { question_index }
enquiry_form_start        { source_section, source_product }
enquiry_form_submit       { source_section, source_product, product_count }
enquiry_form_error        { field }
catalogue_pdf_download    {}
whatsapp_click            { location }
```
No PII in any event payload.

---

## 13. MILESTONES

| Phase | Scope | Est. |
|---|---|---|
| **P0** Foundation | Repo, Next.js 15, Tailwind v4 tokens, fonts, layout primitives, product data | 2 days |
| **P1** Marketing page | §1–§11 built with provisional palette, fully responsive | 5 days |
| **P2** Visual lock | Reference board applied, palette derived, motion pass, design QA | 2 days |
| **P3** Data layer | Supabase schema, RLS, Server Actions, Resend, Turnstile | 2 days |
| **P4** Admin | Auth, dashboard, leads table, detail view, CSV export | 3 days |
| **P5** SEO & product pages | 17 static pages, JSON-LD, sitemap, OG images | 2 days |
| **P6** QA & launch | a11y audit, Lighthouse, cross-browser, content verification pass, deploy | 2 days |

**P2 is blocked on the reference board. P1 must not wait for it — build against tokens and swap.**

---

## 14. OPEN ITEMS (blocking launch)

| # | Item | Owner | Blocks |
|---|---|---|---|
| 1 | UI/UX reference image board | Rohit | P2 |
| 2 | Final registration numbers (FSSAI, IEC, Spices Board, APEDA, Tea Board, GSTIN, FDA FFR) | Client | §2, §5, §11 |
| 3 | Full registered address | Client | Footer, schema |
| 4 | Real lab figures for all `[CONFIRM]` specs | Client | §3 product data |
| 5 | **Cinnamon: cassia or Ceylon?** | Client | Product 04 |
| 6 | Verified GI tags + registration numbers | Client | GI chips |
| 7 | Real MOQ per SKU | Client | Specs, FAQ |
| 8 | Incoterms, ports, payment terms, transit times | Client | §5, FAQ |
| 9 | Real photography (product, facility, growers) | Client | Everything |
| 10 | Real buyer testimonials, if any exist | Client | §8 |
| 11 | Year established + honest stat row figures | Client | §6 |
| 12 | Privacy Policy + Terms copy | Vibrnd + client legal | /privacy, /terms |
| 13 | Admin user list + roles | Client | P4 |

**Launch gate:** items 2, 3, 4, 5, 12 must be closed. Items 6–11 may launch omitted rather than faked.
