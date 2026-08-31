"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { track } from "@/lib/analytics/track";

export function EnquirySection() {
  const { open } = useEnquiryModal();

  const handleClick = () => {
    track("hero_cta_click", { target: "quote" });
    open();
  };

  return (
    <section id="enquiry" className="relative overflow-hidden bg-brand-deep">
      {/* A very slow, very small scale drift. The closing section is a
          full-bleed still at the foot of a page that is otherwise alive,
          and it read as flat next to the rest. 24s and 1.06x is below the
          threshold at which it registers as an animation — it just stops
          the image feeling frozen. CSS-only, so no extra request, and it
          is disabled outright under prefers-reduced-motion by the
          `motion-reduce` variants. */}
      <Image
        src="/images/start-sourcing.jpg"
        alt="A jute sack spilling green cardamom beside bowls of black pepper, dried chillies and a bundle of cinnamon on dark slate"
        fill
        sizes="100vw"
        className="animate-slow-drift object-cover object-[68%_center] motion-reduce:animate-none sm:object-[60%_center] lg:object-center"
      />
      {/* Guarantees text contrast regardless of how much of the product
          photo's darker left zone survives the responsive crop above. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/90 via-brand-deep/55 to-transparent sm:via-brand-deep/35 sm:to-transparent lg:from-brand-deep/80 lg:via-brand-deep/25 lg:to-transparent" />

      <Container className="relative flex min-h-[520px] flex-col items-center justify-center gap-8 py-20 text-center sm:min-h-[560px] sm:items-start sm:justify-center sm:text-left lg:min-h-[640px] lg:py-28">
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent-on-deep/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-accent-on-deep"
            >
              <path d="M6 19c8 0 12-4 12-12V5h-2C8 5 6 11 6 15v4z" />
              <path d="M6 19c2-3 5-6 10-8" />
            </svg>
          </span>
          <p className="font-mono text-small uppercase tracking-mono-label text-accent-on-deep">
            Start your sourcing journey
          </p>
          <span className="hidden h-px w-16 bg-accent-on-deep/40 sm:block" />
        </div>

        <Heading level={2} className="max-w-[16ch] text-on-deep">
          Source <em className="text-accent-on-deep">premium</em> ingredients.
          <br />
          Build <em className="text-accent-on-deep">lasting partnerships</em>.
        </Heading>

        <p className="max-w-[42ch] text-lead text-on-deep-muted">
          From Northeast India to the world — quality you can trust, delivered with care.
        </p>

        <Button
          variant="primary"
          size="lg"
          className="bg-accent-on-deep text-brand-deep hover:brightness-95"
          onClick={handleClick}
        >
          Request a quote
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Button>
      </Container>
    </section>
  );
}
