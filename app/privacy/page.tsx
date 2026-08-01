import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { CatalogueFilterProvider } from "@/lib/context/CatalogueFilterContext";
import { company } from "@/data/company";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <CatalogueFilterProvider>
      <Nav />
      <main className="bg-surface pt-32 pb-24">
        <Container className="max-w-[720px]">
          <Heading level={1}>Privacy Policy</Heading>
          <div className="mt-6">
            <DraftNotice />
          </div>

          <div className="mt-10 flex flex-col gap-8 text-body text-ink">
            <section>
              <h2 className="font-display text-h3 text-ink">What we collect</h2>
              <p className="mt-3 text-ink-muted">
                When you submit an enquiry through this site, we collect the information you
                provide directly: full name, company name, work email, phone or WhatsApp number,
                country, the products you&apos;re enquiring about, and any optional details you
                add (estimated volume, destination port, message). We also record which section
                of the site the enquiry came from, and, where present in the URL, campaign
                tracking parameters (UTM values). We do not collect payment information — this
                site does not process payments.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Why we collect it</h2>
              <p className="mt-3 text-ink-muted">
                We use this information to respond to your enquiry, prepare a quote or sample
                shipment, and — if you become a customer — to manage that relationship. We do not
                use it for advertising or sell it to third parties.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Lawful basis</h2>
              <p className="mt-3 text-ink-muted">
                We process enquiry data on the basis of your consent, given when you tick the
                consent checkbox on the enquiry form, and our legitimate interest in responding
                to a business enquiry you initiated.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Retention</h2>
              <p className="mt-3 text-ink-muted">
                We retain enquiry records for as long as needed to respond to you and, if a trade
                relationship follows, for the duration of that relationship plus a reasonable
                period afterwards for accounting and legal purposes. [CLIENT/LEGAL TO CONFIRM
                exact retention period.]
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Third-party processors</h2>
              <p className="mt-3 text-ink-muted">
                We use the following processors to operate this site and respond to enquiries:
                Supabase (database hosting), Resend (transactional email delivery), Vercel
                (website hosting), Cloudflare (spam/bot protection on the enquiry form), and
                Plausible (cookieless website analytics). Each processes data only as needed to
                provide their service to us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Your rights</h2>
              <p className="mt-3 text-ink-muted">
                You can ask us what data we hold about you, ask us to correct or delete it, or
                withdraw consent at any time. Contact us at{" "}
                <a href={`mailto:${company.contact.email}`} className="text-accent underline underline-offset-2">
                  {company.contact.email}
                </a>{" "}
                to make a request.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </CatalogueFilterProvider>
  );
}
