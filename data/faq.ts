export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * PRD FR-11 / content doc §9 specifies eight verbatim questions and
 * answers for this section. That content doc was not supplied — the
 * catalogue PDF used elsewhere in this build has no FAQ copy, and
 * questions about MOQ, shipping terms, samples, etc. are exactly the
 * kind of buyer-facing claim CLAUDE.md §11 forbids inventing.
 *
 * Left empty; components/sections/Faq.tsx omits the section entirely
 * until real Q&A pairs are supplied.
 */
export const faqItems: FaqItem[] = [];
