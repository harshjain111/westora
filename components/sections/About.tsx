import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { StatCell } from "@/components/ui/StatCell";
import { company, filterEmpty } from "@/data/company";

// Three-paragraph narrative is specified as verbatim content-doc copy
// (PRD FR-8.2 / content doc §6), which was not supplied — the catalogue
// PDF used elsewhere in this build has no company narrative. Left empty
// rather than invented; CLAUDE.md §17: "unsure about copy → use the
// content doc, never write filler."
const NARRATIVE: string[] = [];

const STAT_LABELS: Record<keyof typeof company.stats, string> = {
  established: "Established",
  growerPartnerships: "Grower partnerships",
  shipmentsDelivered: "Shipments delivered",
};

export function About() {
  const stats = filterEmpty(company.stats);
  const statEntries = Object.entries(stats) as [keyof typeof company.stats, string][];

  return (
    <section id="about" className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <Heading level={2}>We only sell what our region grows.</Heading>
            {NARRATIVE.length > 0 && (
              <div className="mt-6 flex flex-col gap-4">
                {NARRATIVE.map((paragraph) => (
                  <p key={paragraph} className="max-w-[65ch] text-body text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="relative order-1 aspect-[4/5] w-full overflow-hidden lg:order-2">
            <Image
              src="/images/products/black-pepper.jpg"
              alt="Whole dried black peppercorns, close detail"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {statEntries.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-8 divide-y divide-rule border-t border-rule pt-10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:pt-0 sm:border-t-0">
            {statEntries.map(([key, value]) => (
              <div key={key} className="pt-8 first:pt-0 sm:pt-0 sm:pl-8 sm:first:pl-0">
                <StatCell value={value} label={STAT_LABELS[key]} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
