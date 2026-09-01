"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
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
    body: "Lab tested to match your needs, with a certificate of analysis on every shipment, not on request.",
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
    <section
      id="why-choose-us"
      className="relative overflow-hidden border-t border-rule bg-surface pt-16 pb-24 lg:pt-20 lg:pb-40"
    >
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
          className="max-w-[640px]"
        >
          <motion.div variants={childVariants}>
            <Heading level={2}>Why importers choose us</Heading>
            <div className="mt-4 h-[3px] w-16 bg-accent" aria-hidden="true" />
          </motion.div>
        </motion.div>

        {/* Was four centred icons floating on open cream — accurate, but it
            read as a placeholder. Each point is now a real card with a
            rule, an index and a hover state, so the four claims sit in a
            structure a buyer can scan rather than in dead space. */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={variants}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POINTS.map((point, index) => (
            <motion.li
              key={point.title}
              variants={childVariants}
              className="group relative flex flex-col overflow-hidden rounded-card border border-rule bg-surface-raised p-6 transition-all duration-[400ms] ease-out hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_20px_45px_rgba(43,32,21,0.10)]"
            >
              {/* Accent rail that draws itself in on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-[400ms] ease-out group-hover:scale-x-100"
              />

              <div className="flex items-start justify-between gap-4">
                <IconBadge icon={point.icon} />
                <span className="font-mono text-[11px] tracking-mono-label text-ink-muted/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-6 font-display text-lead font-semibold leading-tight text-ink">
                {point.title}
              </p>
              <p className="mt-2.5 text-small leading-relaxed text-ink-muted">{point.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
