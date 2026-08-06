import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Rule";
import { StatCell } from "@/components/ui/StatCell";
import { company, filterEmpty } from "@/data/company";

const CELLS = [
  { value: "17", label: "Origin-locked crops" },
  { value: "6", label: "Northeast states sourced" },
  { value: "100%", label: "Lot-tested, COA with every shipment" },
  { value: "UK · US", label: "Primary export markets" },
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
    <div className="bg-brand-deep">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-10">
          {CELLS.map((cell, index) => (
            <div
              key={cell.label}
              className={index > 0 ? "border-t border-on-deep-muted pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10" : ""}
            >
              <StatCell value={cell.value} label={cell.label} tone="on-deep" />
            </div>
          ))}
        </div>

        {entries.length > 0 && (
          <>
            <Rule className="mt-10 border-t-on-deep-muted" />
            <p className="mt-6 font-mono text-[11px] tracking-mono-label uppercase text-on-deep-muted">
              {entries.map(([key, val]) => `${REGISTRATION_LABELS[key]} ${val}`).join(" · ")}
            </p>
          </>
        )}
      </Container>
    </div>
  );
}
