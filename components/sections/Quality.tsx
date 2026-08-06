import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
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

// x positions match the dots already baked into quality-background.jpg
// (measured by pixel-sampling the source image, not eyeballed). Copy is
// verbatim from the client's supplied reference layout — the same
// intentional exception to CLAUDE.md §11 as the catalogue CTA banner.
const STOPS: { x: number; icon: IconName; place: string; role: string; description: string }[] = [
  {
    x: 14.0,
    icon: "leaf",
    place: "Northeast India",
    role: "Origin",
    description: "Sourced from trusted farms across the region.",
  },
  {
    x: 37.0,
    icon: "warehouse",
    place: "Guwahati",
    role: "Consolidation",
    description: "Carefully inspected and consolidated to maintain consistency.",
  },
  {
    x: 58.8,
    icon: "ship",
    place: "Kolkata (INCCU)",
    role: "Load port",
    description: "Export documentation completed and goods loaded with care.",
  },
  {
    x: 82.4,
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
      {/* Mobile (<sm): the desktop treatment below relies on a fixed-aspect
          background image with dots pixel-baked at exact coordinates — at
          narrow widths that box gets too short for the heading, let alone
          four columns of overlaid text, so mobile gets its own normal-flow
          stacked layout instead of trying to reflow the same overlay. */}
      <Container className="py-16 sm:hidden">
        <Eyebrow tone="on-deep" as="p">
          Quality & compliance
        </Eyebrow>
        <div className="mt-3 h-[2px] w-10 bg-accent-on-deep" aria-hidden="true" />
        <Heading level={2} className="mt-4 text-on-deep">
          Built for buyers
          <br />
          <em className="text-accent-on-deep">who go further.</em>
        </Heading>
        <p className="mt-4 max-w-[42ch] text-small text-on-deep-muted">
          Every batch we source is quality-checked, lot-tested, and handled
          with the compliance global markets require.
        </p>

        <div className="mt-10">
          {STOPS.map((stop, index) => (
            <div key={stop.place} className="flex gap-4">
              <div className="flex flex-col items-center">
                <IconBadge
                  icon={stop.icon}
                  tone="on-deep"
                  size="sm"
                  className="border-accent-on-deep/40"
                />
                {index < STOPS.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-on-deep-muted/25" aria-hidden="true" />
                )}
              </div>
              <div className={index < STOPS.length - 1 ? "pb-8" : ""}>
                <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep">
                  {stop.place}
                </p>
                <p className="mt-1 font-mono text-eyebrow uppercase tracking-mono-label text-accent-on-deep">
                  {stop.role}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-on-deep-muted">
                  {stop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* sm and up: the reference layout — text positioned as a percentage
          of the image's own box (a sibling of the <Image>, not nested in
          the max-w-[1320px] Container) so it lands on the dots baked into
          the background at any viewport width, including zoomed-out /
          ultra-wide ones where the Container's centred gutters would
          otherwise pull it out of alignment with the full-bleed image. */}
      <div className="relative hidden aspect-[1721/914] w-full sm:block">
        <Image
          src="/images/quality-background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />

        <div className="absolute inset-0">
          <Container className="relative h-full">
            <div className="absolute left-0 top-[6%] w-[85%] sm:w-[48%]">
              <Eyebrow tone="on-deep" as="p">
                Quality & compliance
              </Eyebrow>
              <div className="mt-3 h-[2px] w-10 bg-accent-on-deep" aria-hidden="true" />
              <Heading level={2} className="mt-4 text-on-deep">
                Built for buyers
                <br />
                <em className="text-accent-on-deep">who go further.</em>
              </Heading>
              <p className="mt-4 max-w-[42ch] text-small text-on-deep-muted">
                Every batch we source is quality-checked, lot-tested, and handled
                with the compliance global markets require.
              </p>
            </div>
          </Container>

          {STOPS.map((stop) => (
            <div
              key={stop.place}
              className="absolute inset-y-0 w-[20%] -translate-x-1/2 text-center"
              style={{ left: `${stop.x}%` }}
            >
              <IconBadge
                icon={stop.icon}
                tone="on-deep"
                size="sm"
                className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 border-accent-on-deep/40 bg-brand-deep/70"
              />
              <p className="absolute left-1/2 top-[62%] w-full -translate-x-1/2 font-mono text-eyebrow uppercase tracking-mono-label text-on-deep">
                {stop.place}
              </p>
              <p className="absolute left-1/2 top-[79%] w-full -translate-x-1/2 font-mono text-eyebrow uppercase tracking-mono-label text-accent-on-deep">
                {stop.role}
              </p>
              <p className="absolute left-1/2 top-[85%] w-full -translate-x-1/2 px-1 text-[0.8125rem] leading-snug text-on-deep-muted">
                {stop.description}
              </p>
            </div>
          ))}
        </div>
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
