"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import type { StaticImageData } from "next/image";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { cn } from "@/lib/utils/cn";

/**
 * Stepper with a pinned media panel.
 *
 * Two distinct behaviours, because the two layouts have different amounts
 * of room and different things to do:
 *
 *  lg and up — the media card is sticky and the step list scrolls past
 *    it. Whichever step crosses the reading line drives the card. Nothing
 *    moves on a timer, so there is no autoplay to pause and the visitor
 *    is always the one in control.
 *
 *  below lg — the list is dropped entirely and only the card remains,
 *    carrying the step, its title and its copy at a larger size. With no
 *    list to scroll there is nothing for a reading line to track, so the
 *    card advances on a timer instead; dots below it give direct control
 *    and touching the card pauses it (WCAG 2.2.2). Under
 *    prefers-reduced-motion it never advances on its own at all.
 *
 * Adapted from a shadcn-flavoured source component. It assumed
 * `@/lib/utils` and shadcn colour tokens (bg-primary, text-muted-
 * foreground, from-background), none of which exist here — this repo is
 * not a shadcn project and its palette is six locked tokens
 * (CLAUDE.md §4), so every one of those was remapped. Its `imageHeight`
 * prop was declared and never used, and its `progress` state was
 * computed every tick and never rendered; both are wired up now.
 */

export interface FeatureStep {
  step: string;
  title?: string;
  content: string;
  image: StaticImageData;
  /** Optional looping footage for this step; falls back to the image. */
  video?: string;
  imageAlt: string;
}

export interface FeatureStepsProps {
  features: FeatureStep[];
  className?: string;
  /** ms per step. Small screens only — lg and up is scroll-driven. */
  autoPlayInterval?: number;
  /** Height utility for the media panel. */
  imageHeight?: string;
}

const TICK = 50;

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 5000,
  imageHeight = "h-[440px] sm:h-[520px] lg:h-[560px]",
}: FeatureStepsProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLarge, setIsLarge] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(rootRef, { margin: "-15% 0px" });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLarge(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // lg and up: a band across the middle of the viewport acts as a reading
  // line — whichever step sits in it drives the pinned card.
  useEffect(() => {
    if (!isLarge) return;
    const nodes = stepRefs.current.filter((n): n is HTMLLIElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setCurrent(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isLarge, features.length]);

  // Below lg only: nothing to scroll through, so the card cycles itself.
  const autoplay = !isLarge && !prefersReducedMotion && inView && !paused;

  useEffect(() => {
    if (!autoplay) {
      setProgress(0);
      return;
    }
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / autoPlayInterval) * 100;
        if (next < 100) return next;
        // Functional update: the interval closes over `current` once, so
        // reading it directly here would stick on the same step.
        setCurrent((c) => (c + 1) % features.length);
        return 0;
      });
    }, TICK);
    return () => clearInterval(timer);
  }, [autoplay, autoPlayInterval, features.length]);

  const select = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
  }, []);

  const active = features[current]!;

  return (
    <div ref={rootRef} className={cn("w-full", className)}>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* Step list — lg and up only. Below that the card carries
            everything, so rendering this too would just duplicate it. */}
        <ol className="order-2 hidden lg:order-1 lg:block">
          {features.map((feature, index) => {
            const isActive = index === current;

            return (
              <li
                key={feature.step}
                data-index={index}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className="border-t border-rule last:border-b"
              >
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-current={isActive ? "step" : undefined}
                  // Generous vertical rhythm is load-bearing, not taste:
                  // the pinned card only travels for as long as the list
                  // is taller than it. At py-5 eight steps came to 971px
                  // against a 560px card, leaving ~400px of stick — the
                  // steps flicked past almost together. This gives the
                  // sequence room to actually read as a sequence.
                  className="group flex w-full items-start gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:py-10"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] transition-all duration-300",
                      isActive
                        ? "border-accent bg-accent text-surface-raised"
                        : "border-rule text-ink-muted group-hover:border-ink-muted",
                    )}
                  >
                    {index + 1}
                  </span>

                  <span
                    className={cn(
                      "flex-1 transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-45 group-hover:opacity-75",
                    )}
                  >
                    <span className="block font-display text-lead font-semibold leading-tight text-ink">
                      {feature.title ?? feature.step}
                    </span>
                    <span className="mt-1 block max-w-[46ch] text-small leading-relaxed text-ink-muted">
                      {feature.content}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Media card */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-[152px]">
          <div
            className={cn(
              "relative overflow-hidden rounded-card bg-brand-deep shadow-[0_30px_60px_rgba(43,32,21,0.18)]",
              imageHeight,
            )}
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <AmbientVideo
                  src={active.video}
                  poster={active.image}
                  alt={active.imageAlt}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="absolute inset-0"
                />
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-brand-deep via-brand-deep/55 to-transparent"
            />

            {/* Autoplay progress — only meaningful where it autoplays. */}
            {autoplay && (
              <div className="absolute inset-x-0 top-0 h-[3px] bg-on-deep-muted/25 lg:hidden" aria-hidden="true">
                <div
                  className="h-full bg-accent-on-deep"
                  style={{ width: `${progress}%`, transition: `width ${TICK}ms linear` }}
                />
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="font-mono text-eyebrow tracking-mono-label uppercase text-accent-on-deep lg:text-[11px]">
                {active.step}
              </p>
              {/* Larger below lg: with the list gone the card is the only
                  place this content appears. */}
              <p className="mt-2 font-display text-[2rem] font-bold leading-[1.1] text-on-deep lg:text-h3 lg:font-semibold">
                {active.title ?? active.step}
              </p>
              <p className="mt-3 max-w-[44ch] text-body leading-relaxed text-on-deep-muted lg:hidden">
                {active.content}
              </p>
            </div>
          </div>

          {/* Direct control below lg, where the card moves on its own. */}
          <div className="mt-5 flex flex-wrap items-center gap-2 lg:hidden">
            {features.map((feature, index) => (
              <button
                key={feature.step}
                type="button"
                onClick={() => select(index)}
                aria-label={`Show ${feature.title ?? feature.step}`}
                aria-current={index === current ? "step" : undefined}
                className="group flex h-8 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    index === current
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-ink-muted/35 group-hover:bg-ink-muted/70",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
