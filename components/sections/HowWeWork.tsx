"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";

// Step titles are verbatim from the build playbook (Prompt 18 / PRD FR-6,
// content doc §4). The one-sentence description for each step is NOT
// available anywhere in the source material currently in hand — the
// content doc referenced throughout the PRD was not supplied, and the
// catalogue PDF doesn't describe Westora's process. Per CLAUDE.md §10/§17
// ("do not add filler sentences to balance a layout — change the layout
// instead"; "unsure about copy → use the content doc, never write
// filler"), this renders titles only until that copy is supplied.
const STEPS = [
  { number: "01", title: "Sourced at origin" },
  { number: "02", title: "Processed to spec" },
  { number: "03", title: "Tested before it moves" },
  { number: "04", title: "Shipped and documented" },
] as const;

export function HowWeWork() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="how-we-work" className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow as="p">How we work</Eyebrow>
          <Heading level={2} className="mt-4">
            Source to port, in four steps
          </Heading>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            >
              <p className="font-mono text-lead text-accent">{step.number}</p>
              <p className="mt-4 font-display text-h3 text-ink">{step.title}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
