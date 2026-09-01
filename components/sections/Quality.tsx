import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { type IconName } from "@/components/ui/IconBadge";
import { QualityJourney } from "@/components/sections/QualityJourney";
import { Reveal } from "@/components/ui/Reveal";
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
  incoterms: "Incoterms",
  ports: "Ports",
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

export function Quality() {
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

      {hasDataBlocks && (
        <Container className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {registrationEntries.length > 0 && (
              <div>
                <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
                  Registrations
                </p>
                <dl className="mt-4 divide-y divide-on-deep-muted border-t border-on-deep-muted">
                  {registrationEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-3">
                      <dt className="font-mono text-small text-on-deep-muted">
                        {REGISTRATION_LABELS[key]}
                      </dt>
                      <dd className="font-mono text-small text-on-deep">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {company.testPanel.length > 0 && (
              <div>
                <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
                  Per-lot test panel
                </p>
                <table className="mt-4 w-full border-collapse font-mono text-small">
                  <tbody>
                    {company.testPanel.map((row) => (
                      <tr key={row.parameter} className="border-t border-on-deep-muted">
                        <td className="py-3 pr-4 text-on-deep-muted">{row.parameter}</td>
                        <td className="py-3 text-on-deep">{row.standard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {company.documents.length > 0 && (
              <div>
                <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
                  Documents issued
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {company.documents.map((doc) => (
                    <Chip key={doc} variant="neutral" className="border-on-deep-muted text-on-deep">
                      {doc}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {tradeTermEntries.length > 0 && (
              <div>
                <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
                  Trade terms
                </p>
                <dl className="mt-4 divide-y divide-on-deep-muted border-t border-on-deep-muted">
                  {tradeTermEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-3">
                      <dt className="font-mono text-small text-on-deep-muted">
                        {TRADE_TERM_LABELS[key]}
                      </dt>
                      <dd className="font-mono text-small text-on-deep">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </Container>
      )}
    </section>
  );
}
