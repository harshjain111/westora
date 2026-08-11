"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { track } from "@/lib/analytics/track";
import heroImage from "@/public/images/hero-background.jpg";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Hero() {
  const { open: openEnquiry } = useEnquiryModal();
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  return (
    // pt-[140px] is a hard floor (nav height 88px + breathing room) so the
    // heading can never render underneath the fixed nav — items-end/pb-20
    // bottom-align the content within whatever space remains below that
    // floor, but on a short viewport the floor wins over the alignment.
    <section
      id="hero"
      className="relative flex min-h-[90svh] items-center overflow-hidden bg-brand-deep pb-20 pt-[140px] md:items-end"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-deep/55" aria-hidden="true" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center text-center md:items-start md:text-left md:max-w-[720px]"
        >
          <motion.div variants={childVariants}>
            <Eyebrow as="p" tone="on-deep" className="text-on-deep">
              Northeast India · Exporting to 9 global markets
            </Eyebrow>
          </motion.div>

          <motion.h1 variants={childVariants} className="mt-6 font-display text-h1 text-on-deep">
            Premium origins. Global excellence.
          </motion.h1>

          <motion.p variants={childVariants} className="mt-6 max-w-[52ch] text-lead text-on-deep-muted">
            We export 17 high-value crops from Northeast India to buyers
            across the Middle East, Europe, Asia and North America —
            traceable to district, tested to spec, delivered on schedule.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button
              as="a"
              href="#catalogue"
              variant="primary"
              size="lg"
              onClick={() => track("hero_cta_click", { target: "catalogue" })}
            >
              View the catalogue
            </Button>
            <Button
              variant="ghost-on-deep"
              size="lg"
              onClick={() => {
                track("hero_cta_click", { target: "quote" });
                openEnquiry();
              }}
            >
              Request a quote
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
