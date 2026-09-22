/**
 * Single source of truth for every company fact rendered on the site:
 * registrations, address, contact, trade terms, stats.
 *
 * Empty-means-omit (CLAUDE.md §11 / §17): every field defaults to an
 * empty string. `filterEmpty` strips empty entries before render so a
 * missing value is simply absent, never "N/A" or a placeholder. Do not
 * invent a value to fill a gap — leave it empty and it will not render.
 */

export interface Registrations {
  fssai: string;
  iec: string;
  spicesBoard: string;
  apeda: string;
  teaBoard: string;
  gstin: string;
  cin: string;
  fdaFfr: string;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Contact {
  email: string;
  phone: string;
  whatsapp: string;
}

export interface TradeTerms {
  minimumOrder: string;
  incoterms: string;
  ports: string;
  payment: string;
  transitUk: string;
  transitUsEast: string;
  transitUsWest: string;
  samplePolicy: string;
}

export interface Stats {
  established: string;
  growerPartnerships: string;
  shipmentsDelivered: string;
}

export interface TestPanelRow {
  parameter: string;
  standard: string;
}

export interface Company {
  registrations: Registrations;
  address: Address;
  contact: Contact;
  tradeTerms: TradeTerms;
  stats: Stats;
  /** Primary export markets, client-confirmed (feedback round, 2026-08). */
  markets: string[];
  /** Per-lot test panel (Quality §5 Block B). Empty until the client
   * supplies real parameters/limits — an empty array renders nothing. */
  testPanel: TestPanelRow[];
  /** Document set issued per shipment (Quality §5 Block C). Empty until
   * the client confirms which documents they actually issue. */
  documents: string[];
}

export const company: Company = {
  registrations: {
    // Supplied by the client (screenshot of the licences & registrations
    // card, 2026-09).
    iec: "AAFFW7150E",
    fssai: "10326999000184",
    spicesBoard: "CRES",
    apeda: "RCMC",
    teaBoard: "Tea Board", // no distinct registration number in the source — client to confirm if one exists
    gstin: "", // CLIENT TO CONFIRM
    cin: "", // CLIENT TO CONFIRM
    fdaFfr: "", // CLIENT TO CONFIRM
  },
  address: {
    line1: "", // CLIENT TO CONFIRM
    line2: "", // CLIENT TO CONFIRM
    city: "", // CLIENT TO CONFIRM
    state: "", // CLIENT TO CONFIRM
    country: "", // CLIENT TO CONFIRM
    pincode: "", // CLIENT TO CONFIRM
  },
  contact: {
    // Sourced verbatim from Westora Global Catalogue.pdf footer.
    email: "info@westoraglobal.com",
    phone: "+91 91810 90279",
    whatsapp: "+91 91810 90279",
  },
  tradeTerms: {
    // Supplied by the client (screenshot of the trade terms card, 2026-09).
    minimumOrder: "One 20 ft container (FCL) · mixed-product loads accepted · white-label tea from 18 MT",
    incoterms: "CIF · CFR · FOB",
    ports: "Kolkata · Mundra · Nhava Sheva (JNPT)",
    payment: "Flexible terms for long-term buyers, agreed per contract",
    transitUk: "", // CLIENT TO CONFIRM
    transitUsEast: "", // CLIENT TO CONFIRM
    transitUsWest: "", // CLIENT TO CONFIRM
    samplePolicy: "Free samples · buyer pays courier · dispatched within 7 days",
  },
  stats: {
    established: "", // CLIENT TO CONFIRM
    growerPartnerships: "", // CLIENT TO CONFIRM
    shipmentsDelivered: "", // CLIENT TO CONFIRM
  },
  markets: ["UAE", "Oman", "Qatar", "Saudi Arabia", "China", "UK", "USA", "Netherlands", "Vietnam"],
  // Supplied by the client (screenshot of the per-lot test panel card,
  // 2026-09).
  testPanel: [
    { parameter: "Testing laboratory", standard: "NABL-accredited, report with every lot" },
    { parameter: "Moisture", standard: "Per lot, to the agreed product spec" },
    { parameter: "Aflatoxin B1 & total", standard: "EU limits — Reg. (EU) 2023/915" },
    { parameter: "Pesticide residues", standard: "EU MRL — Reg. (EC) 396/2005" },
    { parameter: "Ethylene oxide (EtO)", standard: "Tested on request" },
    { parameter: "Sudan dyes I–IV", standard: "Chillies & turmeric, on request" },
    { parameter: "Microbiology", standard: "Salmonella · E. coli · TPC · yeast & mould" },
  ],
  // Supplied by the client (screenshot of the documents issued card,
  // 2026-09).
  documents: [
    "Commercial Invoice",
    "Packing List",
    "Bill of Lading",
    "Certificate of Origin",
    "Phytosanitary Certificate",
    "NABL Lab Test Report (COA)",
    "Fumigation Certificate (where required)",
    "Health Certificate (where required)",
  ],
};

/**
 * Strips empty-string entries from a flat key/value record so a section
 * driven by config can render only the fields the client has verified.
 */
export function filterEmpty<T extends { [K in keyof T]: string }>(record: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in record) {
    if (record[key] !== "") {
      result[key] = record[key];
    }
  }
  return result;
}
