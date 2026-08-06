import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Motif } from "@/components/ui/Motif";
import { StatCell } from "@/components/ui/StatCell";
import { company, filterEmpty } from "@/data/company";

// Copy below the heading is verbatim from the client's supplied reference
// layout for this section, at their explicit direction to replicate it
// exactly — the same intentional exception to CLAUDE.md §11 as the
// catalogue CTA banner and quality-section stops. Spelling is normalised
// to the site's locked en-GB convention (CLAUDE.md §10: "flavour").
const STAT_LABELS: Record<keyof typeof company.stats, string> = {
  established: "Established",
  growerPartnerships: "Grower partnerships",
  shipmentsDelivered: "Shipments delivered",
};

export function About() {
  const stats = filterEmpty(company.stats);
  const statEntries = Object.entries(stats) as [keyof typeof company.stats, string][];

  return (
    <section id="about" className="bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] lg:min-h-[560px]">
        <div className="relative order-2 flex flex-col justify-center overflow-hidden px-6 py-16 sm:px-10 md:px-16 lg:order-1 lg:justify-start lg:px-16 lg:py-20 xl:pl-24">
          <Motif
            variant="b"
            className="pointer-events-none absolute -bottom-10 -right-10 -z-10 hidden w-[60%] max-w-[340px] opacity-[0.12] lg:block"
          />

          <Eyebrow as="p">Why Northeast India</Eyebrow>
          <div className="mt-3 h-[2px] w-6 bg-accent" aria-hidden="true" />

          <Heading level={2} className="mt-6 max-w-[16ch]">
            Premium ingredients, grown where{" "}
            <em className="text-accent">nature intended</em>.
          </Heading>

          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-6 bg-rule" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-accent"
            >
              <path d="M6 19c8 0 12-4 12-12V5h-2C8 5 6 11 6 15v4z" />
              <path d="M6 19c2-3 5-6 10-8" />
            </svg>
            <span className="h-px w-6 bg-rule" />
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <p className="max-w-[46ch] text-body text-ink-muted">
              The fertile lands and unique climate of Northeast India create
              the perfect conditions for bold flavour, rich aroma and
              unmatched quality.
            </p>
            <p className="max-w-[46ch] text-body text-ink-muted">
              We source directly from local farmers, ensuring traceability,
              sustainability and excellence in every batch.
            </p>
          </div>

          <div className="mt-8">
            <Button
              as="a"
              href="#catalogue"
              variant="primary"
              className="font-mono text-small uppercase tracking-mono-label text-surface-raised"
            >
              Learn more →
            </Button>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/3] w-full lg:order-2 lg:aspect-auto lg:min-h-[420px]">
          <Image
            src="/images/about-northeast-india.jpg"
            alt="Mist rising over terraced tea gardens in Northeast India at sunrise"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          {/* Feathers the photo's left edge into the ivory ground instead of
              a hard vertical cut, matching the reference — desktop only,
              since the split becomes a plain stacked layout below lg. */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-surface via-surface/60 to-transparent lg:block"
            aria-hidden="true"
          />
        </div>
      </div>

      {statEntries.length > 0 && (
        <Container className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-8 divide-y divide-rule border-t border-rule pt-10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:pt-0 sm:border-t-0">
            {statEntries.map(([key, value]) => (
              <div key={key} className="pt-8 first:pt-0 sm:pt-0 sm:pl-8 sm:first:pl-0">
                <StatCell value={value} label={STAT_LABELS[key]} />
              </div>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}
