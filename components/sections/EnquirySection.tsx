import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { EnquiryFormLazy as EnquiryForm } from "@/components/form/EnquiryFormLazy";
import { company } from "@/data/company";

// Reused from already-approved locked copy (Hero micro-trust line / the
// enquiry success panel) rather than invented — no content-doc source for
// this section's own body copy or "three commitment lines" exists.
const COMMITMENTS = ["Samples in 7 days", "MOQ from 500 kg", "Reply within one working day"];

export function EnquirySection() {
  return (
    <section id="enquiry" className="grid grid-cols-1 lg:grid-cols-2">
      <div className="relative flex flex-col justify-center overflow-hidden bg-brand-deep py-24 lg:py-40">
        <Image
          src="/images/products/king-chilli-bhut-jolokia.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/95 to-brand-deep/70" />

        <Container className="relative lg:pr-0">
          <Eyebrow tone="on-deep" as="p">
            Start here
          </Eyebrow>
          <Heading level={2} className="mt-4 text-on-deep">
            Tell us what you need.
          </Heading>
          <p className="mt-4 max-w-[46ch] text-lead text-on-deep-muted">
            One form reaches the same team that sources, tests and ships every lot — no call
            centre in between.
          </p>

          <ul className="mt-12 flex flex-col gap-3 border-t border-rule pt-8">
            {COMMITMENTS.map((line) => (
              <li
                key={line}
                className="font-mono text-small tracking-mono-label text-on-deep-muted"
              >
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-8 text-small text-on-deep-muted">
            <a href={`mailto:${company.contact.email}`} className="hover:text-on-deep">
              {company.contact.email}
            </a>
            <a href={`tel:${company.contact.phone.replace(/\s/g, "")}`} className="hover:text-on-deep">
              {company.contact.phone}
            </a>
          </div>
        </Container>
      </div>

      <div className="bg-surface py-24 lg:py-40">
        <Container className="lg:pl-0">
          <EnquiryForm variant="full" sourceSection="main_form" />
        </Container>
      </div>
    </section>
  );
}
