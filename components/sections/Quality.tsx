import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { ProvenanceLine } from "@/components/product/ProvenanceLine";
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

  return (
    <section id="quality" className="bg-brand-deep py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow tone="on-deep" as="p">
            Quality & compliance
          </Eyebrow>
          <Heading level={2} className="mt-4 text-on-deep">
            Built for buyers who get audited.
          </Heading>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {registrationEntries.length > 0 && (
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
                Registrations
              </p>
              <dl className="mt-4 divide-y divide-rule border-t border-rule">
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
                    <tr key={row.parameter} className="border-t border-rule">
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
              <dl className="mt-4 divide-y divide-rule border-t border-rule">
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

        <div className="mt-20 text-on-deep">
          <ProvenanceLine
            nodes={["Northeast India", "Guwahati", "Kolkata (INCCU)", "Felixstowe / New York"]}
            size="feature"
            onDeep
          />
        </div>
      </Container>
    </section>
  );
}
