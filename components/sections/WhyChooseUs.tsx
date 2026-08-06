"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { Motif } from "@/components/ui/Motif";

// Each point restates something substantiated elsewhere on the site
// (provenance line, credential strip, buyer-voices process, enquiry
// commitments) rather than a fresh unverifiable claim — CLAUDE.md §11:
// one number beats one adjective.
const POINTS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "globe",
    title: "Origin-traceable",
    body: "Every lot carries a documented route from district of origin through to discharge port.",
  },
  {
    icon: "shield",
    title: "Tested before it ships",
    body: "Lot-tested with a certificate of analysis on every shipment, not on request.",
  },
  {
    icon: "leaf",
    title: "Sample first",
    body: "Samples move in 7 days, before any contract discussion begins.",
  },
  {
    icon: "handshake",
    title: "A team that replies",
    body: "One working day, usually sooner — from the people who source and ship, not a call centre.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  return (
    <section className="relative overflow-hidden border-t border-rule bg-surface pt-16 pb-24 lg:pt-20 lg:pb-40">
      <Motif
        variant="full"
        fill
        className="pointer-events-none absolute -z-10 hidden !inset-x-0 !bottom-0 !top-auto !h-[70%] !w-full object-bottom opacity-[0.09] lg:block"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="mx-auto max-w-[640px] text-center"
        >
          <motion.div variants={childVariants}>
            <Eyebrow as="p" className="text-center">Why Westora</Eyebrow>
          </motion.div>
          <motion.div variants={childVariants}>
            <Heading level={2} className="mt-4">
              Why importers choose us
            </Heading>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POINTS.map((point) => (
            <motion.div
              key={point.title}
              variants={childVariants}
              className="flex flex-col items-center text-center"
            >
              <IconBadge icon={point.icon} />
              <p className="mt-4 font-display text-lead text-ink">{point.title}</p>
              <p className="mt-2 text-small text-ink-muted">{point.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
