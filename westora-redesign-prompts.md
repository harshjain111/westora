# WESTORA GLOBAL — UI/UX REDESIGN PROMPT PACK
**Purpose:** strip the AI-template look and rebuild the visual layer as an institutional trade house.
**Scope:** design only. Content, data model, forms, admin and SEO stay exactly as built.
**Order:** run R1 → R12 in sequence. Do not skip R1 or R2.

---

## R1 — DIAGNOSE BEFORE TOUCHING ANYTHING

```
Do not write any code in this response.

The client's verdict on the current site: "it looks very much AI made, and it does not look like a big company who is a big exporter." I agree with them, and the design direction I originally gave you is part of the cause.

Audit the site you have built against these known AI-design tells and report, with specific file and line references, every place each one appears:

1. PALETTE TELL — a warm cream/bone background (near #F4F1EA) paired with a high-contrast serif display face and a warm clay or brass accent. This exact combination is the single most recognisable AI-generated web aesthetic in circulation. We shipped it.

2. STRUCTURAL MONOTONY — every section using the identical skeleton: eyebrow, centred H2, subtitle, grid of evenly sized cards. Count how many of our sections use that skeleton.

3. UNIFORM CARD SYNDROME — content forced into equal-weight boxes regardless of its actual importance, with the same padding, same radius, same treatment.

4. DECORATIVE STRUCTURE — eyebrows, numbers, dividers or labels that decorate rather than encode real information.

5. HOLLOW MINIMALISM — whitespace with nothing substantial in it, which reads as thin rather than premium.

6. CENTRED-EVERYTHING — centred headings and centred body copy throughout, which is the default when no compositional decision has been made.

7. GENERIC TYPE PAIRING — a decorative serif for display plus a neutral geometric sans for body, chosen because it is safe rather than because it is right for a commodity trade house.

For each tell: state whether it is present, where, and how severe. Be blunt. Then, separately, list the three things about the current build that genuinely work and should survive the redesign.
```

---

## R2 — RESET THE REFERENCE FRAME

```
Do not write code in this response.

The original brief pointed you at Diaspora Co. and Burlap & Barrel. That was my error. Those are small-batch direct-to-consumer spice brands, and their aesthetic — soft, editorial, boutique — is the opposite of what this client needs.

Westora sells containers, not jars. The buyer is a procurement manager at an importer or a food manufacturer. The site must read as an established trade house.

The corrected reference frame is agricultural commodity trading and industrial food ingredients:
- ofi (Olam Food Ingredients)
- Louis Dreyfus Company
- ED&F Man
- Tata Consumer Products
- Bühler Group
- Barry Callebaut

Study what those sites have in common and report back on:
- How they handle colour — how much of the page is brand colour versus neutral, and whether colour appears as a small accent or as a large field
- How they use photography — scale, subject matter, whether it is decorative or evidential
- How they vary section treatment down the page, rather than repeating one layout
- How they present data, figures and credentials
- Their type character — and specifically whether any of them use a decorative serif for display
- Their overall density: how much is on screen at once

Then tell me, in one paragraph, what the single biggest gap is between those sites and what we have built.
```

---

## R3 — THE NEW AESTHETIC THESIS

```
Do not write code in this response.

Here is the corrected design thesis. Read it, then propose a token system against it.

THE SUBJECT'S OWN VISUAL WORLD
This company's real artifacts are shipping documents: bills of lading, phytosanitary certificates, certificates of analysis, packing lists, port manifests. Ruled tables. Stamped fields. Reference numbers. Tabular figures in fixed columns. Monospaced data. Carbon-copy blues and document greens. That is a specific, coherent, defensible aesthetic — and critically, it is not one any AI default lands on.

Build the visual identity from that world. Not literally, not skeuomorphically, no fake paper texture, no rubber-stamp graphics. Take the underlying logic: ruled structure, tabular alignment, dense factual blocks, restrained institutional colour, type that reads as documentary rather than editorial.

WHAT CHANGES
- Kill the cream ground. Move to either a cool neutral paper or a dark-dominant palette. Your call, argue for it.
- Kill the brass accent entirely. Brand green should appear as a large FIELD — full sections of it — not as a small decorative accent on buttons and chips.
- Kill the decorative serif. The display face should be a condensed or wide grotesque with real character — documentary, industrial, confident. Not editorial, not literary.
- Keep the monospace for data. It is the one thing in the current build that is doing genuine work.

WHAT "BIG COMPANY" ACTUALLY MEANS HERE
Scale is not communicated by whitespace. It is communicated by EVIDENCE DENSITY: facility photographs at scale, named ports, tonnage, certificate references, real figures in real tables, sections that are heavy with substance rather than airy with none. Our current build is minimal with nothing in it, which reads thin. Fix that by making the substantial sections genuinely dense, and letting only a few moments breathe.

DELIVER
1. Six final token values as hex, with a one-line justification each, derived from this thesis and the Westora logo. Name them using the existing token names so the swap is a one-file change.
2. A display and body type pairing, with specific named faces and free fallbacks, and why each is right for a commodity trade house specifically.
3. WCAG AA contrast checks on every foreground/background pair.
4. One paragraph on the compositional principle that will replace uniform card grids.
```

---

## R4 — SECTION WEIGHT MAP

```
Do not write code in this response.

The core structural problem is that every section has the same visual weight and the same skeleton. Real corporate sites vary treatment aggressively down the page.

Produce a section weight map for all eleven sections. For each, specify:
- WEIGHT: heavy / medium / light
- GROUND: dark field, light field, or full-bleed photograph
- COMPOSITION: asymmetric split, full-bleed, dense table, single column, edge-to-edge grid
- ALIGNMENT: left, or centred — and centred must be justified, not defaulted to
- DENSITY: dense with evidence, or deliberately sparse

Constraints:
- No more than two consecutive sections may share a ground treatment
- At most two sections in the entire page may use centred composition
- At least two sections must be full-bleed photographic
- At least one section must be genuinely dense — a wall of real data
- The catalogue grid must remain the visual centre of gravity

Present it as a table, then as an ASCII wireframe of the full page top to bottom so I can see the rhythm at a glance.
```

---

## R5 — APPLY THE PALETTE

```
Apply the approved palette from R3.

Change ONLY the six values in app/globals.css. If this requires editing any component file, stop and report it — that means the token system was implemented incorrectly and we fix the token system rather than patching components.

Then screenshot the full page at 1440 and report: what improved, what got worse, and what is now revealed as a structural problem that the old palette was hiding.
```

---

## R6 — TYPOGRAPHY REBUILD

```
Implement the type pairing from R3.

Self-host the new faces with next/font/local. Replace the display face everywhere. Rebuild the type scale so the hierarchy jump between H1, H2 and body is decisive rather than gradual — AI-generated type scales are characteristically timid.

Specific requirements:
- Display face set tight, with deliberate tracking. If it is a condensed grotesque, let it be genuinely condensed.
- Body copy line length constrained to 60–75 characters everywhere. Check About and FAQ specifically.
- Monospace retained for all specification data, registration numbers, HS codes, trade terms and eyebrows. Never for prose.
- Eyebrows must encode real information — a category, a section function, a state name — not decorate.

Then show me H1, H2, body and a spec table rendered together at 1440 so I can judge the pairing.
```

---

## R7 — REBUILD THE HERO

```
Rebuild the hero against the R4 weight map.

The headline is locked and does not change:
H1: Premium origins. Global excellence.
Sub: We export 17 high-value crops from Northeast India to buyers in the United Kingdom and United States — traceable to district, tested to spec, delivered on schedule.

Everything else is open. The current hero is a scrim over a photograph with left-aligned text — the default answer. Consider alternatives before settling: a split composition with the photograph occupying a hard-edged portion of the frame; type set at genuinely large scale against a flat field; a dense data strip integrated into the hero rather than sitting below it; the provenance line as a structural element of the hero itself.

Whatever you choose, the hero must answer within three seconds: this is a serious Northeast India export house shipping to the UK and US. Propose two directions with ASCII wireframes before building either.
```

---

## R8 — KILL THE UNIFORM GRID

```
Rebuild the catalogue section so it stops reading as a generated card grid.

Requirements:
- The two featured products (Lakadong Turmeric, King Chilli) get genuinely different treatment — larger cells, more information surfaced, not just a badge on an identical card
- Remove card containers entirely if the design works better with images sitting directly on the ground, separated by rules and alignment rather than boxes
- Product metadata should align tabularly across the grid — origin, botanical name and category reading as columns, the way a manifest does
- Hover remains scale(1.06) as briefed by the client, but the surrounding treatment should change: consider revealing the key spec figure on hover rather than a generic "View specs" affordance

The grid must still be scannable in under ten seconds by a buyer looking for one specific crop.
```

---

## R9 — DENSITY PASS ON QUALITY AND ABOUT

```
The Quality & Compliance and About sections are where "big company" is won or lost, and both currently read thin.

Rebuild both for evidence density:

QUALITY — this should feel like reading a capability statement. Registrations, test panel, document set and trade terms should sit as dense, ruled, tabular blocks. Real numbers in fixed columns. It should look like a document a procurement team would file, not a marketing section. Give it more vertical space than any section except the catalogue.

ABOUT — pair the narrative with substance. Full-bleed or large-format photography at scale. The stat row integrated into the composition rather than appended below it. If the client stat values are still empty, design the layout so their absence is invisible rather than leaving a gap.

Maintain every honesty rule in CLAUDE.md §11. Density must come from real content, never from invented figures or filler.
```

---

## R10 — MOTION AND DETAIL PASS

```
Audit every animation. AI-generated sites are characteristically over-animated: everything fades up on scroll, uniformly, with the same duration.

Requirements:
- Remove the blanket scroll-reveal. Let most of the page simply be there.
- Keep at most three deliberate motion moments across the entire site. The provenance line draw is one of them.
- Tune easing so the page feels settled and institutional rather than eager.
- Verify prefers-reduced-motion produces a fully static, fully usable page.

Then the detail pass: hairline rule weights and colours, the exact alignment of tabular data, focus ring treatment, the border treatment on interactive elements. These small decisions are most of the difference between generated and designed.
```

---

## R11 — SELF-CRITIQUE

```
Screenshot the full page at 1440 and at 375. Then answer honestly, and implement your answers:

1. If you saw this site cold, what would tell you it was AI-generated? Be specific and unsparing.
2. Would a procurement manager at a UK spice importer believe this company ships containers? What specifically creates or undermines that belief?
3. Which section is weakest, and why?
4. Where are we still decorating rather than informing?
5. Chanel's rule: which single element, removed, would most improve the page?

Implement your answers to 3 and 5.
```

---

## R12 — FINAL COMPARISON

```
Put the before and after side by side at 1440 and 375.

Report against every tell identified in R1: resolved, partially resolved, or still present. For anything still present, tell me why it survived and what it would take to fix.

Then confirm nothing in the redesign broke: content still verbatim from the content doc, no invented data anywhere, forms functional, WCAG AA maintained, Lighthouse targets held, zero raw hex values in the codebase.
```

---

## RUNNING PROMPTS — USE ANY TIME DURING THE REDESIGN

**When something still looks generated:**
```
This still reads as templated. Against the R3 thesis: name specifically what makes it generic, then propose what a designer who had actually stood on a Kolkata dock and read a phytosanitary certificate would do instead. Propose before changing.
```

**When a section feels thin:**
```
This section is minimal with nothing in it, which reads thin rather than premium. What real content — figures, documents, photography, tabular data — would make it substantial? Do not fill it with decoration or invented data.
```

**When the composition defaults to centre:**
```
Why is this centred? If the answer is not a compositional reason, make it asymmetric and justify the new alignment.
```
