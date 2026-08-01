import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";

export interface Testimonial {
  quote: string;
  attribution: string;
  company: string;
}

export interface BuyerVoicesProps {
  /**
   * Only renders the testimonial layout when a real, attributed array is
   * supplied. CLAUDE.md §11 rule 1 — never invent, sample, or lorem
   * testimonials, including during development. Leave undefined until
   * Westora supplies real ones.
   */
  testimonials?: Testimonial[];
}

// Step titles are verbatim from the build playbook (Prompt 22 / content
// doc §8, option B). The one-line description under each step is not
// available in the source material currently in hand — see the same note
// on HowWeWork.tsx.
const STEPS = [
  { number: "01", title: "Tell us what you need" },
  { number: "02", title: "Sample first, always" },
  { number: "03", title: "Then we contract" },
] as const;

export function BuyerVoices({ testimonials }: BuyerVoicesProps) {
  if (testimonials && testimonials.length > 0) {
    return (
      <section className="bg-surface py-24 lg:py-40">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.attribution} className="border-t border-rule pt-6">
                <blockquote className="text-lead text-ink">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 font-mono text-small text-ink-muted">
                  {testimonial.attribution} · {testimonial.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface py-24 lg:py-40">
      <Container>
        <div className="max-w-[640px]">
          <Eyebrow as="p">Working with us</Eyebrow>
          <Heading level={2} className="mt-4">
            What working with us looks like
          </Heading>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number}>
              <p className="font-mono text-lead text-accent">{step.number}</p>
              <p className="mt-4 font-display text-h3 text-ink">{step.title}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
