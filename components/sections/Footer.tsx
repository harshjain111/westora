import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { categoryCounts } from "@/data/products";
import { company, filterEmpty } from "@/data/company";

const CATEGORY_LINKS: { key: keyof typeof categoryCounts; label: string }[] = [
  { key: "spices", label: "Spices" },
  { key: "chillies", label: "Chillies" },
  { key: "tea", label: "Tea" },
  { key: "rice", label: "Rice" },
  { key: "other", label: "Other" },
];

const EXPLORE_LINKS = [
  { href: "#about", label: "About" },
  { href: "#quality", label: "Quality & Compliance" },
  { href: "#how-we-work", label: "How we work" },
  { href: "#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

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

function waLink(number: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
}

export function Footer() {
  const registrations = filterEmpty(company.registrations);
  const registrationEntries = Object.entries(registrations) as [
    keyof typeof company.registrations,
    string,
  ][];
  const address = filterEmpty(company.address);
  const hasAddress = Object.keys(address).length > 0;

  return (
    <footer className="bg-brand-deep text-on-deep">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Logo className="text-on-deep" />
            <p className="mt-4 font-display text-lead text-on-deep">
              Premium origins. Global excellence.
            </p>
            <p className="mt-2 text-small text-on-deep-muted">
              Exporting 17 high-value crops from Northeast India to the UK and US.
            </p>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
              Catalogue
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.key}>
                  <a href="#catalogue" className="text-small text-on-deep-muted hover:text-on-deep">
                    {link.label} ({categoryCounts[link.key]})
                  </a>
                </li>
              ))}
              <li>
                <TrackedLink
                  event="catalogue_pdf_download"
                  href="/westora-global-catalogue.pdf"
                  className="text-small text-accent hover:text-on-deep"
                >
                  Download catalogue (PDF)
                </TrackedLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-small text-on-deep-muted hover:text-on-deep">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-small text-on-deep-muted">
              <li>
                <a href={`mailto:${company.contact.email}`} className="hover:text-on-deep">
                  {company.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${company.contact.phone.replace(/\s/g, "")}`} className="hover:text-on-deep">
                  {company.contact.phone}
                </a>
              </li>
              <li>
                <TrackedLink
                  event="whatsapp_click"
                  eventProps={{ location: "footer" }}
                  href={waLink(company.contact.whatsapp)}
                  className="hover:text-on-deep"
                >
                  WhatsApp: {company.contact.whatsapp}
                </TrackedLink>
              </li>
              {hasAddress && (
                <li className="pt-2">
                  {[address.line1, address.line2, address.city, address.state, address.pincode, address.country]
                    .filter(Boolean)
                    .join(", ")}
                </li>
              )}
            </ul>
          </div>
        </div>

        {registrationEntries.length > 0 && (
          <p className="mt-12 border-t border-rule pt-6 font-mono text-[11px] tracking-mono-label uppercase text-on-deep-muted/50">
            {registrationEntries.map(([key, val]) => `${REGISTRATION_LABELS[key]} ${val}`).join(" · ")}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-rule pt-6 text-small text-on-deep-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Westora Global. All rights reserved. · Designed and built by Vibrnd</p>
        </div>
      </Container>
    </footer>
  );
}
