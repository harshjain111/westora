"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureSteps, type FeatureStep } from "@/components/ui/feature-steps";
import sourcedImage from "@/public/images/how-we-work-sourced.jpg";
import processedImage from "@/public/images/how-we-work-processed.jpg";
import testedImage from "@/public/images/how-we-work-tested.jpg";
import shippedImage from "@/public/images/how-we-work-shipped.jpg";

/**
 * Source to port, presented with the FeatureSteps stepper.
 *
 * Media is the site's own process photography and the three looping clips
 * already in /public/video — not stock. Four of the eight stages have
 * real footage or photography; the rest reuse the nearest stage's still
 * rather than inventing imagery for a step we have none for
 * (CLAUDE.md §11, empty-means-omit, applied to pictures).
 */

const SOURCED = {
  image: sourcedImage,
  video: "/video/work-sourced.mp4",
  imageAlt: "A picker harvesting tea leaves by hand on a Northeast India estate",
};
const PROCESSED = {
  image: processedImage,
  video: "/video/work-processed.mp4",
  imageAlt: "Gloved hands sorting green cardamom pods on a steel drying screen",
};
const TESTED = {
  image: testedImage,
  video: "/video/work-tested.mp4",
  imageAlt: "A technician examining black peppercorns with tweezers in a laboratory",
};
const SHIPPED = {
  image: shippedImage,
  imageAlt: "Export cartons prepared for shipment",
};

const STEPS: FeatureStep[] = [
  {
    step: "Step 01",
    title: "Sourced",
    content:
      "Direct from grower partnerships across all seven Northeast states, traceable to district.",
    ...SOURCED,
  },
  {
    step: "Step 02",
    title: "Processed",
    content: "Cleaned, graded and dried to the moisture spec your market requires.",
    ...PROCESSED,
  },
  {
    step: "Step 03",
    title: "Verified",
    content: "Every lot checked against the agreed specification before it moves.",
    ...TESTED,
  },
  {
    step: "Step 04",
    title: "Packaged and labelled",
    content: "Packed to your format and labelled to your destination market's rules.",
    ...PROCESSED,
  },
  {
    step: "Step 05",
    title: "Lab tested",
    content:
      "Lab tested to match your needs, with a certificate of analysis on every shipment.",
    ...TESTED,
  },
  {
    step: "Step 06",
    title: "Documented",
    content: "Full export documentation prepared and issued with the consignment.",
    ...SHIPPED,
  },
  {
    step: "Step 07",
    title: "Shipped to you",
    content: "Consolidated at Guwahati, loaded at Kolkata, delivered to your port.",
    ...SHIPPED,
  },
  {
    step: "Step 08",
    title: "Prepare for next order",
    content: "We hold your spec on file so the next lot matches the last one.",
    ...SOURCED,
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-surface py-24 lg:py-32">
      <Container>
        <Reveal className="max-w-[640px]">
          <Heading level={2}>Source to port, in eight steps</Heading>
          <div className="mt-4 h-[3px] w-16 bg-accent" aria-hidden="true" />
        </Reveal>

        {/* 5s a step: eight stages at the component's 3s default is a
            24s loop, and each step's copy needs longer than 3s to read. */}
        <FeatureSteps features={STEPS} autoPlayInterval={5000} className="mt-14" />
      </Container>
    </section>
  );
}
