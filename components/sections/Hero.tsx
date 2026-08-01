"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { track } from "@/lib/analytics/track";
import heroImage from "@/public/images/hero-tea-garden.jpg";

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
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden bg-brand-deep">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover blur-[1px]"
      />
      <div className="absolute inset-0 bg-brand-deep/55" aria-hidden="true" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="flex flex-col items-center text-center md:items-start md:text-left md:max-w-[720px] md:pt-32"
        >
          <motion.div variants={childVariants}>
            <Eyebrow as="p" tone="on-deep" className="text-on-deep">
              Northeast India · Exporting to UK & USA
            </Eyebrow>
          </motion.div>

          <motion.h1
            variants={childVariants}
            className="mt-6 font-display text-h1 text-on-deep"
          >
            Premium origins. Global excellence.
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-6 max-w-[560px] text-lead text-on-deep-muted"
          >
            We export 17 high-value crops from Northeast India to buyers in the
            United Kingdom and United States — traceable to district, tested to
            spec, delivered on schedule.
          </motion.p>

          <motion.div variants={childVariants} className="mt-10 flex flex-wrap gap-4">
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
              as="a"
              href="#enquiry"
              variant="ghost-on-deep"
              size="lg"
              onClick={() => track("hero_cta_click", { target: "quote" })}
            >
              Request a quote
            </Button>
          </motion.div>

          <motion.p
            variants={childVariants}
            className="mt-8 font-mono text-small tracking-mono-label text-on-deep-muted"
          >
            FOB Kolkata · CIF · DDP · Samples in 7 days · MOQ from 500 kg
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
