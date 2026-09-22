export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Verbatim from the client's own supplied FAQ copy (2026-09), not
 * authored here — CLAUDE.md §11 forbids inventing buyer-facing claims
 * like MOQ, shipping terms or licence numbers, so this only exists once
 * the client's own wording is in hand. components/sections/Faq.tsx
 * renders nothing when this array is empty.
 */
export const faqItems: FaqItem[] = [
  {
    id: "what-does-westora-export",
    question: "What does Westora Global export?",
    answer:
      "Westora Global exports spices, tea, vanilla, canned pineapple, specialty rice and chillies from Northeast India. The range includes Lakadong turmeric, King Chilli (Bhut Jolokia), Bird's Eye Chilli, Tepa Chilli, large cardamom, black pepper, star anise, cinnamon, bay leaf, Karbi Anglong ginger, black sesame, Assam tea (CTC and orthodox), green tea, white tea, Manipur black rice, Joha rice, vanilla beans (Grade A and Grade B) and canned pineapple (slices, chunks, tidbits and juice).",
  },
  {
    id: "moq",
    question: "What is your minimum order quantity (MOQ)?",
    answer:
      "Our minimum order is one 20 ft container (FCL). Mixed-product loads are accepted, so you can combine spices, tea, rice, vanilla and canned pineapple in the same container. White-label (private-label) tea starts at 18 metric tonnes.",
  },
  {
    id: "incoterms-ports",
    question: "Which Incoterms and ports do you ship on?",
    answer:
      "We quote CIF or CFR to your destination port, or FOB from any of three Indian ports: Kolkata, Mundra or Nhava Sheva (JNPT). Send your destination port with your enquiry and we will quote on the term and port that suit your route.",
  },
  {
    id: "payment-terms",
    question: "What payment terms do you offer?",
    answer:
      "Payment terms are agreed per contract. We offer flexible terms to buyers who want a long-term supply relationship — tell us your preferred terms with your enquiry.",
  },
  {
    id: "samples",
    question: "Can I get a sample before placing an order?",
    answer:
      "Yes. Samples are free — the buyer pays only the courier charge (or shares a DHL / FedEx / UPS account number). Samples are dispatched within 7 days, and every new buyer relationship starts with a sample before any contract.",
  },
  {
    id: "licences",
    question: "What licences and registrations does Westora Global hold?",
    answer:
      "Westora Global LLP holds an Import Export Code (IEC AAFFW7150E), an FSSAI food licence (10326999000184), Spices Board registration (CRES), APEDA registration (RCMC) and a Tea Board exporter licence.",
  },
  {
    id: "quality-testing",
    question: "How do you test quality?",
    answer:
      "Every lot is tested by a NABL-accredited laboratory before it ships, and the lab report goes with the shipment. Tests cover moisture, aflatoxin (B1 and total, to EU limits), pesticide residues to EU MRL, and microbiology (Salmonella, E. coli, total plate count, yeast and mould). Ethylene oxide (EtO) and Sudan dye (chillies and turmeric) tests are done on request.",
  },
  {
    id: "documents",
    question: "Which documents come with each shipment?",
    answer:
      "Commercial invoice, packing list, bill of lading, certificate of origin, phytosanitary certificate and the NABL lab test report (COA). Fumigation and health certificates are issued wherever the destination country requires them.",
  },
  {
    id: "vanilla-grades",
    question: "Which vanilla bean grades do you supply?",
    answer:
      "We supply Vanilla planifolia from Northeast India in two grades: Grade A (gourmet) — moist, oily pods at about 30–35% moisture, 15 cm and longer — for chefs, bakeries and retail packers; and Grade B (extraction) — drier pods at about 15–25% moisture — for extract and flavour manufacturers. Vanilla seeds (caviar) and extract are also available.",
  },
  {
    id: "assam-tea-grades",
    question: "Which Assam tea grades do you supply?",
    answer:
      "CTC grades BP, BOP, PD and Dust for tea bags and strong brews; orthodox leaf grades FTGFOP1, TGFOP and FOP; and broken orthodox grades BOP, GBOP and FBOP. We also supply green tea (loose leaf or tea bags) and white tea.",
  },
  {
    id: "tea-packing",
    question: "How do you pack tea for export, and do you offer white-label tea?",
    answer:
      "Bulk tea ships in paper sacks or BOPP bags with a PP liner, and can be nitrogen-flushed to keep it fresher in transit. White-label (private-label) tea is available from 18 metric tonnes in 250 g, 500 g, 1 kg or 2 kg packs, and we help with pack design and printing.",
  },
  {
    id: "other-packing",
    question: "How do you pack spices, rice, vanilla and canned pineapple?",
    answer:
      "Spices, rice, vanilla and canned pineapple are packed as per the buyer's requirement — bulk export packing or private-label retail packs, in the pack size and labelling you specify. Share your packing specification with your enquiry and we will quote on it.",
  },
  {
    id: "pineapple-formats",
    question: "What canned pineapple formats do you export?",
    answer:
      "Canned pineapple slices, chunks and tidbits, plus pineapple juice, in retail cans and bulk export packs. Can size, syrup type and carton labelling are packed to the buyer's specification, including private label.",
  },
  {
    id: "based-sourced",
    question: "Where is Westora Global based and where are the products sourced?",
    answer:
      "Westora Global LLP's head office is at Kanaklata Path, Six Mile, Guwahati, Assam 781022, India, and our UK branch is at 18 Langport Crescent, Oakhill, Milton Keynes MK5 6LZ, United Kingdom. Products are sourced from across the seven states of Northeast India — Assam, Meghalaya, Nagaland, Manipur, Mizoram, Arunachal Pradesh and Tripura — and every lot is traceable to its district of origin.",
  },
  {
    id: "uk-office",
    question: "Do you have an office in the UK?",
    answer:
      "Yes. Our UK branch is at 18 Langport Crescent, Oakhill, Milton Keynes MK5 6LZ, United Kingdom. UK and European buyers can email info@westoraglobal.com for quotations, samples and supply of spices, Assam tea, vanilla, canned pineapple and rice from India.",
  },
  {
    id: "countries",
    question: "Which countries do you export to?",
    answer:
      "Our primary markets are the UAE, Oman, Qatar, Saudi Arabia, the United Kingdom, the United States, the Netherlands, China and Vietnam. We quote for buyers in any country — send your destination port with your enquiry.",
  },
  {
    id: "who-we-supply",
    question: "Who do you supply?",
    answer:
      "Importers, distributors, wholesalers, food and beverage manufacturers, spice blenders, tea packers, private-label brands and sourcing agents. We handle bulk orders, private labelling and tailored specifications.",
  },
  {
    id: "how-to-quote",
    question: "How do I get a quotation?",
    answer:
      "Message us on WhatsApp at +91 91810 90279 or email info@westoraglobal.com with the product, grade or form, quantity, packing and destination port. We reply within 24 hours with a quotation and sample plan.",
  },
];
