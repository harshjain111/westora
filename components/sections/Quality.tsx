"use client";

import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { QualityJourney } from "@/components/sections/QualityJourney";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { company, filterEmpty } from "@/data/company";

const REGISTRATION_LABELS: Record<keyof typeof company.registrations, string> = {
  fssai: "FSSAI",
  iec: "IEC",
  spicesBoard: "Spices Board",
  apeda: "APEDA",
  teaBoard: "Tea Board",
  gstin: "GSTIN",
  cin: "CIN",
  fdaFfr: "FDA FFR",
};

const TRADE_TERM_LABELS: Record<keyof typeof company.tradeTerms, string> = {
  minimumOrder: "Minimum order",
  incoterms: "Incoterms",
  ports: "FOB ports",
  payment: "Payment",
  transitUk: "Transit — UK",
  transitUsEast: "Transit — US East",
  transitUsWest: "Transit — US West",
  samplePolicy: "Sample policy",
};

// Copy is verbatim from the client's supplied reference layout — the
// same intentional exception to CLAUDE.md §11 as the catalogue CTA
// banner. The per-stop `x` percentages that used to live here pinned
// each stop to a dot baked into quality-background.jpg; the journey is
// laid out on a grid now, so they are gone.
const STOPS: { icon: IconName; place: string; role: string; description: string }[] = [
  {
    icon: "leaf",
    place: "Northeast India",
    role: "Origin",
    description: "Sourced from trusted farms across the region.",
  },
  {
    icon: "warehouse",
    place: "Guwahati",
    role: "Consolidation",
    description: "Carefully inspected and consolidated to maintain consistency.",
  },
  {
    icon: "ship",
    place: "Kolkata (INCCU)",
    role: "Load port",
    description: "Export documentation completed and goods loaded with care.",
  },
  {
    icon: "globe",
    place: "Felixstowe / New York",
    role: "Discharge",
    description: "Delivered and cleared, ready for your market.",
  },
];

/** A registration chip reads oddly as "Tea Board Tea Board" when the
 * value doesn't add anything beyond the label (e.g. a board membership
 * with no separate certificate number) — show the value alone then. */
function registrationChipText(label: string, value: string) {
  return value.toLowerCase() === label.toLowerCase() ? value : `${label} ${value}`;
}

export function Quality() {
  const { open: openEnquiry } = useEnquiryModal();

  const registrations = filterEmpty(company.registrations);
  const registrationEntries = Object.entries(registrations) as [
    keyof typeof company.registrations,
    string,
  ][];

  const tradeTerms = filterEmpty(company.tradeTerms);
  const tradeTermEntries = Object.entries(tradeTerms) as [
    keyof typeof company.tradeTerms,
    string,
  ][];

  const hasDataBlocks =
    registrationEntries.length > 0 ||
    company.testPanel.length > 0 ||
    company.documents.length > 0 ||
    tradeTermEntries.length > 0;

  return (
    <section id="quality" className="bg-brand-deep">
      {/* One layout at every width. The heading, intro and journey now
          sit in normal flow over a scrimmed background rather than being
          pinned to coordinates measured off the artwork — see
          QualityJourney.tsx for why the old overlay could not hold. */}
      <div className="relative overflow-hidden">
        <Image
          src="/images/quality-background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        {/* The artwork is from the earlier forest-green palette. Rather
            than discard it — the gold trade routes are the section's best
            asset — a brand-deep wash pulls it into the espresso range so
            it reads as part of this palette, and guarantees contrast for
            everything above it regardless of where the copy lands. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--color-brand-deep) 94%, transparent) 0%, color-mix(in srgb, var(--color-brand-deep) 88%, transparent) 42%, color-mix(in srgb, var(--color-brand-deep) 62%, transparent) 100%)",
          }}
        />
        {/* The artwork has its own timeline — a gold rule with four dots —
            baked into its lower third. The stops are no longer pinned to
            it, so it now reads as a stray line running through the
            descriptions, competing with the real rail. This wash buries
            the bottom of the image while leaving the map and trade routes
            legible up top. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[62%]"
          style={{
            background:
              "linear-gradient(to top, var(--color-brand-deep) 0%, var(--color-brand-deep) 34%, color-mix(in srgb, var(--color-brand-deep) 82%, transparent) 68%, transparent 100%)",
          }}
        />

        <Container className="relative py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,540px)_minmax(0,400px)] lg:items-end lg:justify-between">
            <Reveal>
              <div className="h-[2px] w-10 bg-accent-on-deep" aria-hidden="true" />
              <Heading level={2} className="mt-6 text-on-deep">
                Built for buyers
                <br />
                <em className="text-accent-on-deep">who go further.</em>
              </Heading>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-[42ch] text-body text-on-deep-muted lg:pb-2">
                Every batch we source is quality-checked, lab tested to match
                your needs, and handled with the compliance global markets
                require.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 lg:mt-24">
            <QualityJourney stops={STOPS} />
          </div>
        </Container>
      </div>

      {/* The licences/tests/documents/terms data used to run as plain
          label-value lists straight on the dark journey background — flat
          and easy to skim past. Cream cards with an icon and a short
          intro per block give each one enough visual weight to register
          as its own claim rather than four rows in the same list. */}
      {hasDataBlocks && (
        <div className="bg-surface py-20 lg:py-28">
          <Container>
            <Reveal className="max-w-[560px]">
              <div className="h-[2px] w-10 bg-accent" aria-hidden="true" />
              <p className="mt-4 font-mono text-eyebrow uppercase tracking-mono-label text-accent">
                Quality &amp; compliance
              </p>
              <Heading level={2} className="mt-2">
                Trusted quality.
                <br />
                <em className="text-accent">Global reach.</em>
              </Heading>
              <p className="mt-4 text-body text-ink-muted">
                Fully compliant, transparently documented, and tested to meet global standards —
                so you can source with confidence.
              </p>
            </Reveal>

            <RevealGroup className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {registrationEntries.length > 0 && (
                <RevealItem className="rounded-card border border-rule bg-surface-raised p-8">
                  <div className="flex items-start gap-4">
                    <IconBadge icon="certificate" />
                    <div>
                      <p className="font-display text-lead font-semibold text-ink">
                        Licences &amp; Registrations
                      </p>
                      <p className="mt-1 text-small text-ink-muted">
                        We are registered and compliant with all major regulatory bodies.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {registrationEntries.map(([key, value]) => (
                      <Chip key={key} variant="accent">
                        {registrationChipText(REGISTRATION_LABELS[key], value)}
                      </Chip>
                    ))}
                  </div>
                </RevealItem>
              )}

              {company.testPanel.length > 0 && (
                <RevealItem className="rounded-card border border-rule bg-surface-raised p-8">
                  <div className="flex items-start gap-4">
                    <IconBadge icon="flask" />
                    <div>
                      <p className="font-display text-lead font-semibold text-ink">
                        Per-lot Test Panel
                      </p>
                      <p className="mt-1 text-small text-ink-muted">
                        Every batch is quality-checked, lab tested and handled as per global
                        standards.
                      </p>
                    </div>
                  </div>
                  <dl className="mt-6 divide-y divide-rule border-t border-rule">
                    {company.testPanel.map((row) => (
                      <div
                        key={row.parameter}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 py-3 text-small"
                      >
                        <dt className="text-ink-muted">{row.parameter}</dt>
                        <dd className="text-ink">{row.standard}</dd>
                      </div>
                    ))}
                  </dl>
                </RevealItem>
              )}

              {company.documents.length > 0 && (
                <RevealItem className="rounded-card border border-rule bg-surface-raised p-8">
                  <div className="flex items-start gap-4">
                    <IconBadge icon="document" />
                    <div>
                      <p className="font-display text-lead font-semibold text-ink">
                        Documents Issued
                      </p>
                      <p className="mt-1 text-small text-ink-muted">
                        We provide complete documentation for smooth and compliant imports.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {company.documents.map((doc) => (
                      <Chip key={doc} variant="accent">
                        {doc}
                      </Chip>
                    ))}
                  </div>
                </RevealItem>
              )}

              {tradeTermEntries.length > 0 && (
                <RevealItem className="rounded-card border border-rule bg-surface-raised p-8">
                  <div className="flex items-start gap-4">
                    <IconBadge icon="handshake" />
                    <div>
                      <p className="font-display text-lead font-semibold text-ink">Trade Terms</p>
                      <p className="mt-1 text-small text-ink-muted">
                        Flexible and buyer-friendly terms to support long-term partnerships.
                      </p>
                    </div>
                  </div>
                  <dl className="mt-6 divide-y divide-rule border-t border-rule">
                    {tradeTermEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 py-3 text-small"
                      >
                        <dt className="text-ink-muted">{TRADE_TERM_LABELS[key]}</dt>
                        <dd className="text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </RevealItem>
              )}
            </RevealGroup>

            <Reveal
              delay={0.1}
              className="mt-10 flex flex-col items-center gap-4 border-t border-rule pt-8 sm:flex-row sm:justify-between"
            >
              <p className="flex items-center gap-2.5 font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                <IconBadge icon="leaf" size="sm" className="border-none text-accent" />
                Natural products. Global opportunities.
              </p>
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="inline-flex items-center gap-2 font-mono text-small uppercase tracking-mono-label text-accent underline-offset-4 hover:underline"
              >
                Request a quote
                <IconBadge icon="arrowRight" size="sm" className="border-none" />
              </button>
            </Reveal>
          </Container>
        </div>
      )}
    </section>
  );
}
