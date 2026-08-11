"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";

// Step titles are client-confirmed (feedback round, 2026-08) — replaces
// the earlier four-step version with the full eight-step process.
const STEPS: { number: string; title: string; icon: IconName }[] = [
  { number: "01", title: "Sourced", icon: "leaf" },
  { number: "02", title: "Processed", icon: "warehouse" },
  { number: "03", title: "Verified", icon: "shield" },
  { number: "04", title: "Packaged and labelled", icon: "package" },
  { number: "05", title: "Lab tested", icon: "quality" },
  { number: "06", title: "Documented", icon: "document" },
  { number: "07", title: "Shipped to you", icon: "truck" },
  { number: "08", title: "Prepare for next order", icon: "handshake" },
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
            Source to port, in eight steps
          </Heading>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="relative mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:gap-x-8"
        >
          {STEPS.map((step, index) => (
            <motion.div key={step.number} className="relative" variants={childVariants}>
              {index > 0 && index % 4 !== 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-5 top-4 hidden font-display text-lead text-ink-muted lg:block"
                >
                  ›
                </span>
              )}

              <div className="flex items-center gap-3">
                <p className="font-mono text-small text-accent">{step.number}</p>
                <IconBadge icon={step.icon} size="sm" />
              </div>
              <p className="mt-4 font-display text-lead text-ink">{step.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
