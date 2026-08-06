"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";

// Step titles are verbatim from the build playbook (Prompt 18 / PRD FR-6,
// content doc §4). The one-sentence description for each step is NOT
// available anywhere in the source material currently in hand — the
// content doc referenced throughout the PRD was not supplied, and the
// catalogue PDF doesn't describe Westora's process. Per CLAUDE.md §10/§17
// ("do not add filler sentences to balance a layout — change the layout
// instead"; "unsure about copy → use the content doc, never write
// filler"), this renders titles only, not the descriptive sentences shown
// in the reference layout — those assert specific operational claims
// ("we partner with trusted farmers"...) that aren't verified.
const STEPS: { number: string; title: string; icon: IconName; image: string; alt: string }[] = [
  {
    number: "01",
    title: "Sourced at origin",
    icon: "leaf",
    image: "/images/how-we-work-sourced.jpg",
    alt: "Tea garden worker harvesting leaves at sunrise in Northeast India",
  },
  {
    number: "02",
    title: "Processed to spec",
    icon: "quality",
    image: "/images/how-we-work-processed.jpg",
    alt: "Gloved hands sorting cardamom pods on a processing line",
  },
  {
    number: "03",
    title: "Tested before it moves",
    icon: "shield",
    image: "/images/how-we-work-tested.jpg",
    alt: "Lab technician examining a sample under a microscope",
  },
  {
    number: "04",
    title: "Shipped and documented",
    icon: "truck",
    image: "/images/how-we-work-shipped.jpg",
    alt: "Container ship and truck at port during loading",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function HowWeWork() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  return (
    <section id="how-we-work" className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow as="p">How we work</Eyebrow>
          <Heading level={2} className="mt-4">
            Source to port, in four steps
          </Heading>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {STEPS.map((step, index) => (
            <motion.div key={step.number} className="relative" variants={childVariants}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-5 top-6 hidden font-display text-lead text-ink-muted lg:block"
                >
                  ›
                </span>
              )}

              <div className="flex items-center gap-3">
                <p className="font-mono text-lead text-accent">{step.number}</p>
                <IconBadge icon={step.icon} size="sm" />
              </div>
              {/* min-h reserves room for a two-line title (e.g. "Shipped and
                  documented") so every column's image starts at the same
                  height regardless of how many lines its own title wraps to. */}
              <p className="mt-4 min-h-[4.5rem] font-display text-h3 text-ink lg:min-h-[4.7rem]">
                {step.title}
              </p>

              <div className="relative mt-2 aspect-square w-full overflow-hidden rounded-photo lg:mt-0">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
