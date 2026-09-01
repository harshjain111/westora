"use client";

import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
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
          <Reveal>
            <Heading level={2}>
              Questions buyers ask us
            </Heading>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <Accordion
              defaultOpenId={faqItems[0]?.id}
              items={faqItems.map((item) => ({
                id: item.id,
                title: item.question,
                content: item.answer,
              }))}
              onItemOpen={(index) => track("faq_open", { question_index: index })}
            />
          </Reveal>
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
