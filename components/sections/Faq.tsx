"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { IconBadge } from "@/components/ui/IconBadge";
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
        <Reveal className="max-w-[640px]">
          <Heading level={2}>Questions buyers ask us</Heading>
          <div className="mt-4 h-[3px] w-16 bg-accent" aria-hidden="true" />
        </Reveal>

        {/* Two columns, filled in reading order (row-major), instead of one
            long single-file list — same content, roughly half the scroll,
            and it reads as a reference sheet rather than an interrogation. */}
        <Reveal delay={0.08} className="mt-12 grid grid-cols-1 gap-x-10 border-t border-rule lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <details
              key={item.id}
              open={index === 0}
              className="group border-b border-rule py-4"
              onToggle={(event) => {
                if (event.currentTarget.open) track("faq_open", { question_index: index });
              }}
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
                <IconBadge icon="question" size="sm" className="mt-0.5 shrink-0" />
                <span className="flex-1 pt-1.5 font-display text-body font-medium leading-snug text-ink">
                  {item.question}
                </span>
                <IconBadge
                  icon="chevronDown"
                  size="sm"
                  className="mt-0.5 shrink-0 border-none text-ink-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="ml-[52px] mt-3 max-w-[60ch] text-small leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </Container>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
