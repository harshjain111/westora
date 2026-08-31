import { Container } from "@/components/ui/Container";
import { Motif } from "@/components/ui/Motif";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { company, filterEmpty } from "@/data/company";
import { cn } from "@/lib/utils/cn";

/**
 * The credibility block directly under the hero.
 *
 * This is the first hard evidence a buyer meets, so it earns more than a
 * flat row of numerals: each figure counts up on entry under its own
 * accent rule, separated by hairlines. Depth comes from the existing
 * brand motif and token-based washes rather than a new image — nothing
 * here adds a request or a colour outside the locked palette
 * (CLAUDE.md §4).
 */

const CELLS = [
  { value: "17", label: "Origin-locked crops" },
  { value: "7", label: "Northeast states sourced" },
  { value: "100%", label: "Lab tested to match your needs, COA with every shipment" },
  { value: String(company.markets.length), label: "Primary export markets" },
] as const;

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

export function CredentialStrip() {
  const registrations = filterEmpty(company.registrations);
  const entries = Object.entries(registrations) as [keyof typeof company.registrations, string][];

  return (
    <div id="credentials" className="relative overflow-hidden bg-brand-deep">
      {/* Texture layer — all token-derived, no new assets. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Warm pool bleeding down from the hero above, so the join reads
            as one continuous surface rather than a hard band. */}
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 0%, color-mix(in srgb, var(--color-brand-mid) 40%, transparent) 0%, transparent 70%)",
          }}
        />
        {/* Hairline rule grid — the same measured, technical register as
            the spec tables further down the page. */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-surface) 22%, transparent) 1px, transparent 1px)",
            backgroundSize: "88px 100%",
          }}
        />
        {/* on-deep tone: the default variant is recoloured with
            --color-accent, which goes muddy against brand-deep. */}
        <Motif
          variant="a"
          tone="on-deep"
          className="absolute -right-20 -top-12 w-[44%] max-w-[520px] opacity-[0.09]"
        />
      </div>

      <Container className="relative py-16 lg:py-20">
        <RevealGroup className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {CELLS.map((cell) => (
            <RevealItem
              key={cell.label}
              // Vertical hairlines, but only ever between columns — never
              // down the left edge of a first column. Keying off the item
              // index alone broke in the two-column layout: the third cell
              // starts a new row yet is still index > 0, so it picked up a
              // border and an indent that made "100%" look misaligned.
              // odd/even tracks actual column position at each breakpoint.
              className={cn(
                "sm:border-l sm:border-on-deep-muted/25 sm:pl-10",
                "sm:odd:border-l-0 sm:odd:pl-0",
                "lg:odd:border-l lg:odd:pl-8 lg:pl-8 lg:first:border-l-0 lg:first:pl-0",
              )}
            >
              <StatCounter value={cell.value} label={cell.label} />
            </RevealItem>
          ))}
        </RevealGroup>

        {(company.markets.length > 0 || entries.length > 0) && (
          <div className="mt-14 border-t border-on-deep-muted/30 pt-8">
            {company.markets.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {company.markets.map((market) => (
                  <li
                    key={market}
                    className="rounded-westora border border-on-deep-muted/30 px-3.5 py-1.5 font-mono text-[11px] tracking-mono-label uppercase text-on-deep-muted transition-colors duration-300 hover:border-accent-on-deep hover:text-on-deep"
                  >
                    {market}
                  </li>
                ))}
              </ul>
            )}
            {entries.length > 0 && (
              <p className="mt-6 font-mono text-[11px] tracking-mono-label uppercase text-on-deep-muted">
                {entries.map(([key, val]) => `${REGISTRATION_LABELS[key]} ${val}`).join(" · ")}
              </p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
