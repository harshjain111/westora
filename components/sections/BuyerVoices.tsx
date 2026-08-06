"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { Motif } from "@/components/ui/Motif";

export interface Testimonial {
  quote: string;
  attribution: string;
  company: string;
}

export interface BuyerVoicesProps {
  /**
   * Only renders the testimonial layout when a real, attributed array is
   * supplied. CLAUDE.md §11 rule 1 — never invent, sample, or lorem
   * testimonials, including during development. Leave undefined until
   * Westora supplies real ones.
   */
  testimonials?: Testimonial[];
}

// Step titles are verbatim from the build playbook (Prompt 22 / content
// doc §8, option B). The one-line description under each step is not
// available in the source material currently in hand — see the same note
// on HowWeWork.tsx.
const STEPS: { number: string; title: string; icon: IconName; image: string; alt: string }[] = [
  {
    number: "01",
    title: "Tell us what you need",
    icon: "message",
    image: "/images/working-requirements.jpg",
    alt: "A black notebook embossed 'Your Requirements' with a pen resting on it",
  },
  {
    number: "02",
    title: "Sample first, always",
    icon: "package",
    image: "/images/working-sample-pack.jpg",
    alt: "A dark green sample pack box beside bowls of cardamom and black pepper",
  },
  {
    number: "03",
    title: "Then we contract",
    icon: "document",
    image: "/images/working-contract.jpg",
    alt: "A signed contract document with a pen and wax seal",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function BuyerVoices({ testimonials }: BuyerVoicesProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  if (testimonials && testimonials.length > 0) {
    return (
      <section className="bg-surface py-24 lg:py-40">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.attribution} className="border-t border-rule pt-6">
                <blockquote className="text-lead text-ink">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 font-mono text-small text-ink-muted">
                  {testimonial.attribution} · {testimonial.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-surface py-24 lg:py-40">
      <Motif
        variant="a"
        className="pointer-events-none absolute -right-16 -top-16 -z-10 hidden w-[55%] max-w-[820px] opacity-[0.16] lg:block"
      />

      <Container className="relative">
        <div className="max-w-[640px]">
          <Eyebrow as="p">Working with us</Eyebrow>
          <Heading level={2} className="mt-4">
            What working with us looks like
          </Heading>
          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-6 bg-rule" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-accent"
            >
              <path d="M6 19c8 0 12-4 12-12V5h-2C8 5 6 11 6 15v4z" />
              <path d="M6 19c2-3 5-6 10-8" />
            </svg>
            <span className="h-px w-6 bg-rule" />
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10"
        >
          {STEPS.map((step, index) => (
            <motion.div key={step.number} variants={childVariants}>
              <div className="flex items-center gap-4">
                <p className="font-mono text-h3 text-accent">{step.number}</p>
                {index < STEPS.length - 1 && (
                  <span
                    className="h-px flex-1 border-t border-dashed border-accent/40"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="mt-4 font-display text-h3 text-ink">{step.title}</p>

              <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-photo">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <IconBadge
                  icon={step.icon}
                  className="absolute -bottom-4 -left-4 border-surface-raised bg-surface-raised text-accent shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
