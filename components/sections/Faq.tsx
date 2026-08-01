"use client";

import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { track } from "@/lib/analytics/track";
import { faqItems } from "@/data/faq";

export function Faq() {
  if (faqItems.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="mx-auto max-w-[720px]">
          <Eyebrow as="p">FAQ</Eyebrow>
          <Heading level={2} className="mt-4">
            Questions buyers ask us
          </Heading>

          <div className="mt-10">
            <Accordion
              defaultOpenId={faqItems[0]?.id}
              items={faqItems.map((item) => ({
                id: item.id,
                title: item.question,
                content: item.answer,
              }))}
              onItemOpen={(index) => track("faq_open", { question_index: index })}
            />
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
