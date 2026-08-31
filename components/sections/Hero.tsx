"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { HeroSpices } from "@/components/sections/HeroSpices";
import { useEnquiryModal } from "@/lib/context/EnquiryModalContext";
import { track } from "@/lib/analytics/track";
import teaWideImage from "@/public/images/hero-tea-wide.jpg";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { open: openEnquiry } = useEnquiryModal();
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? undefined : containerVariants;
  const childVariants = prefersReducedMotion ? undefined : itemVariants;

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-surface">
      {/* Upper region: the footage and the copy share it, and it flexes to
          whatever is left after the origin band below has taken its
          height. The band therefore always sits on flat ground no matter
          how many rows it wraps to. */}
      <div className="relative flex flex-1 flex-col">
      {/* ================================================================
          FULL-BLEED BACKGROUND
          Runs edge to edge and to y=0, so it sits behind the transparent
          nav rather than starting below it, and stops where the origin
          band begins — the cut-outs never sit on a photograph.
          ================================================================ */}
      <div className="absolute inset-0 z-0">
        <AmbientVideo
          src="/video/hero-tea-wide.mp4"
          poster={teaWideImage}
          alt="A tea picker working the plantation rows of a Northeast India estate"
          sizes="100vw"
          priority
          minWidth={768}
          className="absolute inset-0"
          objectPosition="object-[62%_center]"
        />

        {/* Desktop: ground sweeps in from the left so the headline column
            sits on flat cream while the estate stays open on the right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, var(--color-surface) 0%, var(--color-surface) 33%, color-mix(in srgb, var(--color-surface) 84%, transparent) 46%, color-mix(in srgb, var(--color-surface) 34%, transparent) 62%, transparent 80%)",
          }}
        />
        {/* Below lg there is no side-by-side to protect, so the same idea
            runs vertically: flat cream behind the copy, the estate opening
            up beneath it. A horizontal fade here would leave the headline
            sitting on bright foliage. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-surface) 0%, var(--color-surface) 44%, color-mix(in srgb, var(--color-surface) 76%, transparent) 60%, color-mix(in srgb, var(--color-surface) 28%, transparent) 78%, transparent 94%)",
          }}
        />
        {/* Dissolves the footage into the origin spread's ground so the
            two meet on a soft edge instead of a hard horizontal seam. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[34%]"
          style={{
            background:
              "linear-gradient(to top, var(--color-surface) 0%, color-mix(in srgb, var(--color-surface) 72%, transparent) 46%, transparent 100%)",
          }}
        />
      </div>

      {/* ================================================================
          COPY
          ================================================================ */}
      <Container className="relative z-10 flex flex-1 items-center pt-[132px] lg:pt-[140px]">
        <motion.div initial="hidden" animate="visible" variants={variants} className="max-w-[620px]">
          <motion.h1
            variants={childVariants}
            className="font-display text-h1 font-extrabold leading-[0.98] tracking-display text-ink"
          >
            <span className="block">Premium origins.</span>
            {/* Manrope has no italic, so the second line is set apart by
                weight and colour instead of slope — see app/fonts.ts. */}
            <span className="block font-light text-brand-mid">Global excellence.</span>
          </motion.h1>

          <motion.p variants={childVariants} className="mt-7 max-w-[46ch] text-body text-ink-muted">
            We export 17 high-value crops from Northeast India to buyers
            across the Middle East, Europe, Asia and North America —
            traceable to district, tested to spec, delivered on schedule.
          </motion.p>

          <motion.div variants={childVariants} className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              as="a"
              href="#catalogue"
              variant="primary"
              className="gap-4 rounded-full bg-brand-deep pl-8 pr-2 text-on-deep hover:brightness-125"
              onClick={() => track("hero_cta_click", { target: "catalogue" })}
            >
              View the Catalogue
              <IconBadge icon="arrowRight" size="sm" filled className="h-9 w-9 bg-surface-raised text-ink" />
            </Button>
            <Button
              variant="secondary"
              className="rounded-full px-8"
              onClick={() => {
                track("hero_cta_click", { target: "quote" });
                openEnquiry();
              }}
            >
              Request a Quote
            </Button>
          </motion.div>
        </motion.div>
      </Container>
      </div>

      {/* ================================================================
          ORIGIN SPREAD
          Its own flat band at the foot of the hero. Giving it a real
          ground — rather than letting it float over the footage — is what
          makes seven cut-outs read as objects on a page instead of
          stickers on a photograph.
          ================================================================ */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="relative z-10 bg-surface pb-5 pt-2"
      >
        <Container>
          <div className="mb-3 flex items-center gap-4 lg:justify-center">
            <span className="hidden h-px w-8 shrink-0 bg-rule sm:block" aria-hidden="true" />
            <p className="font-mono text-[11px] leading-snug tracking-mono-label uppercase text-ink-muted">
              One crop from each of the seven Northeast states
            </p>
            <span className="hidden h-px w-8 shrink-0 bg-rule sm:block" aria-hidden="true" />
          </div>
          <HeroSpices />
        </Container>
      </motion.div>
    </section>
  );
}
