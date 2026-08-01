import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { DraftNotice } from "@/components/ui/DraftNotice";
import { CatalogueFilterProvider } from "@/lib/context/CatalogueFilterContext";
import { company } from "@/data/company";

export const metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <CatalogueFilterProvider>
      <Nav />
      <main className="bg-surface pt-32 pb-24">
        <Container className="max-w-[720px]">
          <Heading level={1}>Terms of Use</Heading>
          <div className="mt-6">
            <DraftNotice />
          </div>

          <div className="mt-10 flex flex-col gap-8 text-body text-ink">
            <section>
              <h2 className="font-display text-h3 text-ink">Scope</h2>
              <p className="mt-3 text-ink-muted">
                These terms govern your use of this website. They do not constitute a contract of
                sale — product specifications, samples, pricing, minimum order quantities and
                shipping terms for any actual transaction are agreed separately in writing between
                Westora Global and the buyer.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Site content</h2>
              <p className="mt-3 text-ink-muted">
                Product specifications shown on this site (origin, botanical name, forms,
                packaging) reflect our typical supply and are provided for guidance. Any figure
                marked as unverified in our internal records is withheld from this site until
                confirmed, rather than published as a placeholder — see a current Certificate of
                Analysis for lot-specific figures on any given shipment.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">No online ordering</h2>
              <p className="mt-3 text-ink-muted">
                This site does not process orders or payments. Submitting the enquiry form starts
                a conversation with our team; it is not a binding order.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Intellectual property</h2>
              <p className="mt-3 text-ink-muted">
                Text, photography and design on this site belong to Westora Global or its
                licensors and may not be reused without permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Governing law</h2>
              <p className="mt-3 text-ink-muted">
                [CLIENT/LEGAL TO CONFIRM governing law and jurisdiction.]
              </p>
            </section>

            <section>
              <h2 className="font-display text-h3 text-ink">Contact</h2>
              <p className="mt-3 text-ink-muted">
                Questions about these terms:{" "}
                <a href={`mailto:${company.contact.email}`} className="text-accent underline underline-offset-2">
                  {company.contact.email}
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </CatalogueFilterProvider>
  );
}
