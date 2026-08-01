# CLAUDE.md — Westora Global

Project conventions for Claude Code. Read this fully before writing anything. If a request conflicts with this file, follow this file and say so.

---

## 1. WHAT THIS IS

A B2B export website + lead management panel for **Westora Global**, an exporter of 17 origin-locked crops from Northeast India to buyers in the **UK and United States**.

**The visitor is a procurement professional, not a consumer.** Importers, spice blenders, food manufacturers, private-label brands, sourcing agents. They arrive asking one question:

> "Is this a real export house, or a broker with a PDF?"

**Everything you build answers that question.** Three qualities, in priority order:

1. **TRUST** — verifiable specificity. Real registration numbers as text. Full address. Named lab tests. Listed documents. Never a claim we cannot substantiate.
2. **AUTHORITY** — numbers, not adjectives. Curcumin %, SHU, moisture limits, HS codes, botanical names. One number beats one adjective, every time.
3. **RELATIONSHIP** — plain, direct, unhurried language. A competent counterparty, not a vendor chasing a sale.

**Aesthetic:** quiet, precise, minimal, confident. Restraint *is* the message. Enormous whitespace, disciplined type, one accent colour used sparingly, product photography carrying all the visual energy.

**The anti-brief — never build any of this:** orange gradients, hero carousels, scrolling logo marquees, multiple WhatsApp float buttons, stock handshake photography, "We Strive For Excellence" headers, parallax, cursor followers, glassmorphism, neon accents, emoji in UI copy.

---

## 2. STACK

| | |
|---|---|
| Framework | Next.js 15, App Router |
| Language | TypeScript, `strict: true`, `noUncheckedIndexedAccess: true` |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Animation | Framer Motion (sparingly) |
| Forms | react-hook-form + Zod |
| Backend | Supabase (Postgres, Auth, RLS) |
| Email | Resend + React Email |
| Spam | Cloudflare Turnstile |
| Charts (admin only) | Recharts |
| Hosting | Vercel |

**Package manager: pnpm.** Node 20+.

---

## 3. PROJECT STRUCTURE

```
app/
  layout.tsx                 root: fonts, metadata, analytics
  page.tsx                   the single marketing page
  globals.css                @theme tokens — THE ONLY PLACE COLOURS ARE DEFINED
  products/[slug]/page.tsx   17 static product pages
  privacy/page.tsx
  terms/page.tsx
  admin/
    layout.tsx               auth guard
    page.tsx                 dashboard
    leads/page.tsx           table
    leads/[id]/page.tsx      detail
    login/page.tsx
  api/                       avoid — prefer Server Actions
  sitemap.ts
  robots.ts

components/
  sections/                  Hero, CredentialStrip, Catalogue, HowWeWork,
                             Quality, About, OriginMap, BuyerVoices, Faq,
                             EnquirySection, Footer, Nav
  product/                   ProductCard, ProductModal, ProductSpecTable,
                             ProvenanceLine, GiChip, CategoryFilter
  form/                      EnquiryForm, Field, CountrySelect, ProductMultiSelect,
                             ConsentCheckbox, SuccessPanel
  ui/                        Button, Container, Section, Eyebrow, Heading, Rule,
                             Accordion, Modal, Chip, StatCell
  admin/                     LeadsTable, LeadDetail, StatusSelect, Dashboard*, ExportCsv

lib/
  supabase/{client,server,middleware}.ts
  actions/enquiry.ts         Server Action
  email/{notification,autoreply}.tsx
  schemas/enquiry.ts         Zod — shared client + server
  utils/{cn,reference,format}.ts

data/
  products.ts                17 SKUs — SOURCE OF TRUTH
  faq.ts
  company.ts                 registrations, address, trade terms
  navigation.ts

types/
  index.ts

emails/                      React Email templates
public/images/products/      1:1 AVIF/WebP, 1200 + 2000
```

---

## 4. THE COLOUR RULE — READ THIS TWICE

**The palette is not final.** Rohit will supply a UI/UX reference image board before the visual pass. The final values get derived from that board plus the Westora logo.

**Therefore:**

### ✅ Always
```tsx
<div className="bg-brand-deep text-on-deep border-rule">
<span className="text-accent">
<p className="text-ink-muted">
```

### ❌ Never — no exceptions
```tsx
<div className="bg-[#12301F]">        // raw hex
<div className="bg-green-900">        // Tailwind default palette
<p className="text-gray-600">         // Tailwind default palette
<div style={{ color: '#A8792C' }}>    // inline colour
```

**Every colour in the codebase resolves to a token defined in `app/globals.css`.** When the palette lands, changing six values in that one file must restyle the entire site with **zero component edits**. If a palette swap would require touching a component, you have implemented it wrong — fix it before continuing.

### The token contract (names are FINAL, values are provisional)
```css
@theme {
  --color-brand-deep:     #12301F;  /* dark surfaces: footer, quality section, solid nav */
  --color-brand-mid:      #2E5540;  /* secondary dark, hover, rules */
  --color-accent:         #A8792C;  /* THE single accent */
  --color-surface:        #F4F2EB;  /* page ground */
  --color-surface-raised: #FFFFFF;  /* cards, modal */
  --color-ink:            #2A2B27;  /* body text */

  --color-ink-muted:      color-mix(in srgb, var(--color-ink) 62%, transparent);
  --color-rule:           color-mix(in srgb, var(--color-brand-mid) 15%, transparent);
  --color-on-deep:        var(--color-surface);
  --color-on-deep-muted:  color-mix(in srgb, var(--color-surface) 65%, transparent);
}
```

### Palette discipline — holds regardless of final values
1. **Six base colours. That is the whole palette.** Do not add a seventh.
2. **The accent appears at most three times per viewport.** Ubiquity destroys emphasis.
3. **Product photography is the only saturated colour on the page.** The chrome stays quiet so the turmeric looks like turmeric.
4. Body text is never pure black. Page ground is never pure white (cards may be).
5. **No gradients**, except an image overlay scrim.
6. **No coloured shadows.** Minimal shadows generally — separate with hairline rules and whitespace.

---

## 5. TYPOGRAPHY

| Role | Class | Face (fallback) | Use |
|---|---|---|---|
| Display | `font-display` | Instrument Serif | H1, H2, product names |
| Body | `font-body` | Inter Tight | Everything running |
| Mono | `font-mono` | JetBrains Mono | Specs, HS codes, MOQ, SHU, eyebrows, registration numbers, trade terms |

**The mono is the trust device.** Specification data in monospace reads like a certificate of analysis. Use it consistently for data. **Never for running prose.**

Scale (rem): `0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.5 / 4`
Display: leading `1.05`, tracking tight. Body: leading `1.6`. Mono: tracking `+0.02em`, uppercase for eyebrows and labels.

Self-host with `next/font/local`. **No Google Fonts network request.**

---

## 6. LAYOUT

- Container `max-w-[1320px]`; gutters 24px mobile → 64px desktop.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Section rhythm: 96px mobile → 160px desktop. **Be generous. Whitespace is what makes this read premium.**
- Border radius: **2px maximum, or 0.** Soft rounded cards read consumer; this is a trade site.
- Separate with hairline rules and space, not with boxes and shadows.

---

## 7. MOTION BUDGET

| Element | Motion | Duration |
|---|---|---|
| Hero content | Staggered fade-up, once | 400ms |
| Section content | Scroll fade-up | 500ms |
| Product card image | `scale(1.06)` on hover | 350ms |
| Modal | Scale-in 0.97→1 + backdrop blur | 250ms |
| Provenance line | Left-to-right draw | 600ms |
| Filter change | Layout transition | 300ms |
| Stat counters | Count-up on first view | 600ms |

**Nothing else animates.** No parallax, no marquees, no floating shapes, no scroll-jacking, no cursor effects.

Every animation wraps in a `prefers-reduced-motion` check. Hover effects gate behind `@media (hover: hover)` so touch devices do not get stuck hover states.

---

## 8. THE SIGNATURE ELEMENT

The **Provenance Line** — a hairline route strip on every product modal and product page, and once, large, in the Quality section:

```
JAINTIA HILLS ──── GUWAHATI ──── KOLKATA (INCCU) ──── FELIXSTOWE / NEW YORK
   origin           consolidation      load port            discharge
```

Accent-coloured node dots; place labels above in mono; role labels below in mono at reduced opacity. Draws left→right on scroll into view, dots landing in 100ms stagger.

**This is the one place boldness is spent.** Do not invent a second signature device. Do not decorate elsewhere.

---

## 9. CODE CONVENTIONS

**Components**
- Server Components by default. Add `'use client'` **only** for state, effects, or event handlers, and push it as far down the tree as possible.
- Named exports. One component per file. Filename matches the component: `ProductCard.tsx`.
- Props interfaces named `ComponentNameProps`, defined above the component.
- No default exports except Next.js pages/layouts.

**TypeScript**
- Zero `any`. Zero non-null assertions (`!`) unless there is a comment explaining the invariant.
- `type` for unions, `interface` for object shapes.
- Every data structure typed in `types/index.ts` or colocated.

**Styling**
- Tailwind utilities inline. No CSS modules, no styled-components.
- `cn()` (clsx + tailwind-merge) for conditional classes.
- Extract a component when a utility string repeats three times. Do not build an abstraction on the second occurrence.
- Mobile-first: base styles are mobile, `md:` / `lg:` add up.

**Data**
- `data/products.ts` is the **single source of truth** for all 17 SKUs. Never hardcode a product name, spec, or category count in a component.
- Filter counts, sitemap entries, JSON-LD and `generateStaticParams` all derive from that array.

**Forms**
- One Zod schema in `lib/schemas/enquiry.ts`, imported by both the client form and the Server Action. Client validation is UX; **server validation is the actual gate.**

**Server Actions**
- All writes go through Server Actions. Do not create public API routes that touch `leads`.
- Every action: validate → rate-limit check → Turnstile verify → insert → send emails → return typed result. Never throw raw errors to the client.

**Naming**
- Files: `PascalCase.tsx` for components, `kebab-case.ts` for utilities.
- Booleans: `isOpen`, `hasGI`, `shouldReveal`.
- Handlers: `handleSubmit`, `handleCardClick`.
- Product slugs: kebab-case, matching `data/products.ts` exactly.

---

## 10. CONTENT RULES

All copy comes **verbatim** from `Westora_Global_Website_Structure_and_Content.md`. Do not paraphrase. Do not "improve". Do not add filler sentences to balance a layout — **change the layout instead**.

**Voice**
- en-GB spelling throughout: `flavour`, `colour`, `enquiry`, `organisation`.
- Sentence case for headings and buttons. Not Title Case. Not ALL CAPS except mono eyebrows and labels.
- Active voice. Plain verbs.
- **Banned:** "world-class", "finest quality", "customer satisfaction is our priority", "we strive to", "unparalleled", "one-stop solution", "leading provider", "cutting-edge", "seamless", "delve", "elevate", "unlock".
- Buttons say what happens: `Send enquiry`, not `Submit`. `View the catalogue`, not `Learn more`.
- An action keeps its name through the whole flow: the button says `Send enquiry`, the success panel says `Enquiry received`.
- Errors explain what went wrong and how to fix it. They do not apologise and are never vague.
- No emoji anywhere in UI copy.

**Approved and locked**
- Hero H1: **`Premium origins. Global excellence.`**
- Hero sub: *We export 17 high-value crops from Northeast India to buyers in the United Kingdom and United States — traceable to district, tested to spec, delivered on schedule.*

---

## 11. THE HONESTY RULES — HARD CONSTRAINTS

These are not style preferences. Breaking any of them damages the client commercially.

1. **Never invent a testimonial.** Not in dev, not as a placeholder, not as lorem. The `BuyerVoices` component renders the "What working with us looks like" content by default and only renders testimonials if a real, attributed array is supplied.

2. **Never invent a registration number, certification, GI tag, or lab figure.** Config-driven with empty-means-omit: if a value is absent, the row does not render. Never `N/A`, never `XXXXX`, never a plausible-looking fake.

3. **Unverified specs do not reach production.** Specs carrying `unverified: true` render with a visible amber dev marker in development and **do not render at all** in production. A missing spec row is a non-event; a wrong curcumin figure on a shipped consignment is a legal problem.

4. **Never invent company statistics.** If the client cannot supply real founding year, grower count or shipment count, the About stat row does not render.

5. **Never use stock photography of people.** Product imagery only until real photography is supplied.

6. If you are ever unsure whether a value is real, **omit it and flag it in your response.** Omission is always the safe failure mode here.

---

## 12. ACCESSIBILITY FLOOR — NON-NEGOTIABLE

WCAG 2.1 AA. This overrides aesthetic preference, including anything on the reference board.

- Contrast 4.5:1 body, 3:1 large text. Check every foreground/background pair when the palette lands.
- Every interactive element keyboard-reachable, with a **visible** focus ring (never `outline: none` without a replacement).
- Modal: focus trapped, ESC closes, focus returns to the trigger.
- Real `<label>` on every field; errors linked via `aria-describedby`.
- Descriptive alt text on all product images (`"Dried Lakadong turmeric fingers"`, not `"turmeric"`).
- Touch targets ≥44×44px.
- Semantic heading order, one `<h1>` per document.
- `prefers-reduced-motion` honoured everywhere.
- Test keyboard-only and with a screen reader before calling anything done.

---

## 13. SECURITY

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. **Never** in a client component, never prefixed `NEXT_PUBLIC_`.
- RLS on every table. **No public SELECT on `leads`, ever.** A leaked buyer list ends the client relationship.
- `/admin` protected in middleware, not only in the UI.
- Rate limit the enquiry action: 5 per IP per hour.
- Turnstile verified server-side.
- No PII in analytics events.

---

## 14. PERFORMANCE TARGETS

LCP ≤2.5s on mobile 4G · CLS <0.1 · INP <200ms · initial JS <150KB gzipped.

- `next/image` everywhere, AVIF + WebP, explicit dimensions, blur placeholder.
- Hero image `priority`; everything below the fold lazy.
- Admin bundle (including Recharts) code-split away from the marketing page.
- Marketing page is statically rendered. It should be a CDN document.

---

## 15. GIT

Conventional commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`.
Scope where useful: `feat(catalogue): add category filter`.
Small, focused commits. When the palette is derived, state the derivation in the commit body.

---

## 16. DEFINITION OF DONE

A section is not done until all of these are true:

- [ ] Renders correctly at 375 / 768 / 1024 / 1440 / 1920
- [ ] Zero raw hex, zero Tailwind default palette classes
- [ ] Keyboard navigable, visible focus states
- [ ] `prefers-reduced-motion` respected
- [ ] Copy matches the content doc verbatim
- [ ] No invented data of any kind
- [ ] TypeScript clean, no `any`
- [ ] Images optimised with descriptive alt text
- [ ] Semantic HTML, correct heading order

---

## 17. WHEN YOU ARE UNSURE

- **Unsure about a fact, number, or claim** → omit it and flag it. Never invent.
- **Unsure about a colour** → use a token. Never a hex.
- **Unsure about copy** → use the content doc. Never write filler.
- **Unsure whether to animate** → don't.
- **Unsure whether to add a section, badge, or decoration** → don't. Restraint is the brief.

Chanel's rule applies to this build: before shipping a section, look at it and **remove one thing**.
