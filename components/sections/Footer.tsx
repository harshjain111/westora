import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CatalogueDownloadTrigger } from "@/components/form/CatalogueDownloadModal";
import { getCategoryCounts, type Category } from "@/data/products";
import { company, filterEmpty } from "@/data/company";

const CATEGORY_LINKS: { key: Category; label: string }[] = [
  { key: "spices", label: "Spices" },
  { key: "chillies", label: "Chillies" },
  { key: "tea", label: "Tea" },
  { key: "rice", label: "Rice" },
  { key: "other", label: "Other" },
];

// #faq is deliberately not linked here — the FAQ section only renders once
// data/faq.ts has real question/answer copy (CLAUDE.md §11: never invent
// buyer-facing claims), and it's empty right now, so the section doesn't
// exist on the page. Add it back once real FAQ content lands.
const EXPLORE_LINKS = [
  { href: "#about", label: "About" },
  { href: "#quality", label: "Quality & Compliance" },
  { href: "#how-we-work", label: "How we work" },
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

export async function Footer() {
  const categoryCounts = await getCategoryCounts();
  const registrations = filterEmpty(company.registrations);
  const registrationEntries = Object.entries(registrations) as [
    keyof typeof company.registrations,
    string,
  ][];
  const address = filterEmpty(company.address);
  const hasAddress = Object.keys(address).length > 0;

  return (
    <footer className="bg-ink text-on-deep">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Image src="/images/logo-full.png" alt="Westora Global" width={140} height={102} className="h-14 w-auto" />
            <p className="mt-4 font-display text-lead text-on-deep">
              Premium origins. Global excellence.
            </p>
            <p className="mt-2 text-small text-on-deep-muted">
              Exporting high-value crops from Northeast India to markets across the Middle East,
              Europe, Asia and North America.
            </p>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
              Catalogue
            </p>
            <ul className="mt-2 flex flex-col">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href="#catalogue"
                    className="inline-flex min-h-11 items-center text-small text-on-deep-muted hover:text-on-deep"
                  >
                    {link.label} ({categoryCounts[link.key]})
                  </a>
                </li>
              ))}
              <li>
                <CatalogueDownloadTrigger
                  href="/westora-global-catalogue.pdf"
                  className="inline-flex min-h-11 items-center text-small text-accent hover:text-on-deep"
                >
                  Download catalogue (PDF)
                </CatalogueDownloadTrigger>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-on-deep-muted">
              Explore
            </p>
            <ul className="mt-2 flex flex-col">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-small text-on-deep-muted hover:text-on-deep"
                  >
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
            <ul className="mt-2 flex flex-col text-small text-on-deep-muted">
              <li>
                <a
                  href={`mailto:${company.contact.email}`}
                  className="inline-flex min-h-11 items-center hover:text-on-deep"
                >
                  {company.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex min-h-11 items-center hover:text-on-deep"
                >
                  {company.contact.phone}
                </a>
              </li>
              <li>
                <TrackedLink
                  event="whatsapp_click"
                  eventProps={{ location: "footer" }}
                  href={waLink(company.contact.whatsapp)}
                  className="inline-flex min-h-11 items-center hover:text-on-deep"
                >
                  WhatsApp: {company.contact.whatsapp}
                </TrackedLink>
              </li>
              {hasAddress && (
                <li className="pt-2">
                  <p className="font-mono text-[11px] uppercase tracking-mono-label text-on-deep-muted/70">
                    Head office
                  </p>
                  <p className="mt-1">
                    {[address.line1, address.line2, address.city, address.state, address.pincode, address.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </li>
              )}
              {company.branches.map((branch) => (
                <li key={branch.label} className="pt-2">
                  <p className="font-mono text-[11px] uppercase tracking-mono-label text-on-deep-muted/70">
                    {branch.label}
                  </p>
                  <p className="mt-1">
                    {[
                      branch.address.line1,
                      branch.address.line2,
                      branch.address.city,
                      branch.address.state,
                      branch.address.pincode,
                      branch.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <a
                    href={`mailto:${branch.email}`}
                    className="mt-1 inline-flex min-h-11 items-center hover:text-on-deep"
                  >
                    {branch.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {registrationEntries.length > 0 && (
          <p className="mt-12 border-t border-on-deep-muted pt-6 font-mono text-[11px] tracking-mono-label uppercase text-on-deep-muted/50">
            {registrationEntries.map(([key, val]) => `${REGISTRATION_LABELS[key]} ${val}`).join(" · ")}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-on-deep-muted pt-6 text-small text-on-deep-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-1.5">
            <span>© 2026 Westora Global. All rights reserved. · Designed and built by</span>
            <a
              href="https://www.vibrnd.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vibrnd — opens in a new tab"
              className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100"
            >
              <Image src="/images/vibrnd-logo.png" alt="Vibrnd" width={2806} height={1098} className="h-4 w-auto" />
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
