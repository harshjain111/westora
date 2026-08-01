# Westora Global website — handover

Written for whoever maintains the site day-to-day, not assuming a developer background. If a step needs a developer, it says so.

---

## Pre-launch checklist

| # | Item | Status |
|---|---|---|
| 1 | All test leads deleted | Not yet run — nothing to delete until real data exists. Run `delete from leads where reference like 'TEST-%';` in the Supabase SQL editor before go-live if the seed data (`supabase/seed-test-leads.sql`) was ever loaded. |
| 2 | Zero unverified specs rendering in production | **Done.** `ProductSpecTable` hides any `unverified: true` spec at build time — verified in every production build so far (only `cinnamon → Species` and `bay-leaf → Botanical note` are currently marked this way, and neither renders in prod). |
| 3 | No invented testimonials, statistics, registrations or GI claims | **Done.** `BuyerVoices` never renders fabricated testimonials (the array is left `undefined`). Registrations, address, trade terms, About's stat row, and the Quality section's test panel/documents are all empty in `data/company.ts`, so they correctly render nothing rather than a placeholder. GI is `false` for all 17 products. |
| 4 | Registration numbers match client-supplied values, character for character | **Blocked on you.** `data/company.ts` has every registration field (FSSAI, IEC, Spices Board, APEDA, Tea Board, GSTIN, CIN, FDA FFR) as an empty string with a `// CLIENT TO CONFIRM` comment. Fill these in and the credential strip, footer, and Quality section will pick them up automatically. |
| 5 | Full registered address correct in footer and schema | **Blocked on you.** Same file, `address` object — currently empty. |
| 6 | Both emails deliver, don't land in spam | **Not tested** — needs a real Resend API key and a verified sending domain. |
| 7 | Admin login works for every client user at the correct role | **Not tested** — needs a real Supabase project with `profiles` rows created for each staff member. |
| 8 | Every form path tested on production | Tested locally as far as possible without live credentials (validation, honeypot, error states, focus/keyboard behaviour) — needs a full re-test once deployed with real Supabase/Resend/Turnstile. |
| 9 | sitemap.xml and robots.txt live and correct | **Done** — both generate automatically from `data/products.ts`, verified in the local build. |
| 10 | 404 page exists and is on-brand | **Not done** — Next.js's default 404 is in place; a branded one wasn't in the original 62-prompt playbook and should be added before launch. |
| 11 | Catalogue PDF download works | **Done** — the real catalogue you supplied is served from `/westora-global-catalogue.pdf`. |
| 12 | Lighthouse targets met on production URL | **Not measured** — this environment can't run Lighthouse. Bundle size was reduced from 207KB to 178KB First Load JS by code-splitting the enquiry form, but it's still above the 150KB target; run Lighthouse once deployed and see "Performance follow-ups" below. |

---

## What's genuinely blocking launch

These are the same items PRD §14 already flagged as client-owed, confirmed still open:

1. **Registration numbers** (FSSAI, IEC, Spices Board, APEDA, Tea Board, GSTIN, CIN, FDA FFR)
2. **Full registered address**
3. **Real lab figures** for the two `[CONFIRM]` specs (cinnamon species — cassia or Ceylon; bay leaf's precise botanical name)
4. **Live Supabase, Resend, and Cloudflare Turnstile accounts** — the enquiry form, admin panel, and emails are fully built and code-complete, but none of them can be tested end-to-end or go live without real credentials in `.env`. See `.env.example` for the full list.
5. **Content doc copy** — `Westora_Global_Website_Structure_and_Content.md`, referenced throughout the original PRD, was never supplied. The catalogue PDF you provided covers product data well, but several sections have no source copy: the "How we work" and "Buyer voices" step descriptions, the About section's narrative paragraphs, and all 8 FAQ questions/answers. These sections currently show only what's genuinely known (step titles, structure) rather than invented text — see "Content gaps" below.

---

## Content gaps — what's showing nothing, and why

Per the project's own rule (never invent client-facing copy or numbers), these sections are built and working but visually sparse until you supply real content:

- **How We Work** — shows the four step titles only (Sourced at origin / Processed to spec / Tested before it moves / Shipped and documented), no description under each.
- **Buyer Voices** — shows the three step titles only (Tell us what you need / Sample first, always / Then we contract), no description under each.
- **About** — shows the heading and a product photo, but no narrative paragraphs.
- **FAQ** — the whole section is hidden (renders nothing) because there are zero real questions to show.
- **Quality & Compliance** — the registrations, per-lot test panel, and documents-issued blocks are all empty and hidden.

To fill any of these in, see "How to..." below.

---

## How to do common tasks (no coding required for most of these)

### Add a product
1. Open `data/products.ts` in a code editor (or ask a developer to do this one — it's a structured file, easy to get wrong by hand).
2. Copy an existing product's block as a template.
3. Fill in name, origin, botanical name, description, specs, forms, packaging.
4. Add a square product photo to `public/images/products/` and reference it in the `images` array.
5. The product automatically appears in the catalogue grid, category filters, sitemap, and gets its own page at `/products/your-slug` — nothing else needs to change.

### Update a registration number
1. Open `data/company.ts`.
2. Find the `registrations` object and fill in the relevant field (e.g. `fssai: "12345678901234"`).
3. Save. It will now appear in the credential strip, footer, and Quality section automatically — you don't need to touch those files.

### Add an admin user
1. In the Supabase dashboard, go to Authentication → Users → Add user, and set their email/password.
2. In the Table Editor, open the `profiles` table and add a row: `id` = the user's ID from step 1, `email` = their email, `role` = `admin` or `viewer`.
3. They can now sign in at `yoursite.com/admin/login`.

### Swap the hero image
1. Replace `public/images/hero-tea-garden.jpg` with a new image of the same filename (or update the filename referenced in `components/sections/Hero.tsx`).
2. **Important:** the current hero image was extracted from your catalogue PDF and is lower-resolution than ideal for a full-width banner — this was flagged during the build as needing real photography (PRD Open Item #9). Replace it with a proper high-resolution photo before launch if possible.

### Add real content to a section (FAQ, About, etc.)
This needs a developer, since the copy lives inside component files, not a simple data file (except FAQ, which does have its own data file). For FAQ specifically:
1. Open `data/faq.ts`.
2. Add entries to the `faqItems` array, each with `id`, `question`, `answer`.
3. Save — the FAQ section will appear automatically with the correct accordion behaviour and search-engine markup.

---

## Environment variables needed to go live

See `.env.example` for the full list. In short, you'll need to create accounts and generate keys for:
- **Supabase** (database + admin login) — free tier is sufficient to start
- **Resend** (sending the two enquiry emails)
- **Cloudflare Turnstile** (spam protection on the enquiry form — free)
- **Plausible** (optional — cookieless analytics; the site works fine without it)

Once you have these, add them to your hosting provider's environment variable settings (e.g. Vercel project settings) — never commit them to the code.

---

## Performance follow-ups (once deployed)

- Run Lighthouse (Chrome DevTools → Lighthouse tab, or web.dev/measure) on the live URL and compare against PRD §11's targets.
- First Load JS is currently ~178KB on the homepage (target: 150KB). The enquiry form is already code-split; the next place to look is `framer-motion` usage — several scroll animations could potentially move to plain CSS.
