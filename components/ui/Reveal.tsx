"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Scroll-reveal primitive used across every marketing section.
 *
 * Deliberately restrained: an 18px rise and a 0.55s ease-out, once only.
 * PRD §1's anti-brief rules out anything that reads as "effect" — the
 * motion should register as the page settling into place, not as an
 * animation the visitor is meant to notice. Anything springier or
 * longer starts to feel like a template.
 *
 * Under prefers-reduced-motion the wrapper renders a plain div, so no
 * transform or opacity is ever applied — not merely a faster animation.
 */

export type RevealDirection = "up" | "left" | "right" | "none";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Seconds to delay this element's reveal. Use for manual sequencing. */
  delay?: number;
  direction?: RevealDirection;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
}

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 18 },
  left: { x: -18, y: 0 },
  right: { x: 18, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  direction = "up",
  amount = 0.25,
  children,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <Tag {...props}>{children}</Tag>;

  const MotionTag = motion.create(Tag);
  const offset = OFFSET[direction];

  return (
    <MotionTag
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parent that staggers its Reveal-less children. Pair with RevealItem —
 * mixing Reveal inside RevealGroup double-animates and looks broken.
 */
export function RevealGroup({
  as: Tag = "div",
  delay = 0,
  amount = 0.2,
  children,
  ...props
}: Omit<RevealProps, "direction">) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <Tag {...props}>{children}</Tag>;

  const MotionTag = motion.create(Tag);
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  };

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function RevealItem({
  as: Tag = "div",
  children,
  ...props
}: Omit<RevealProps, "direction" | "delay" | "amount">) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <Tag {...props}>{children}</Tag>;

  const MotionTag = motion.create(Tag);
  return (
    <MotionTag variants={itemVariants} {...props}>
      {children}
    </MotionTag>
  );
}
