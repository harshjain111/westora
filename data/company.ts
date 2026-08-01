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
  /** Per-lot test panel (Quality §5 Block B). Empty until the client
   * supplies real parameters/limits — an empty array renders nothing. */
  testPanel: TestPanelRow[];
  /** Document set issued per shipment (Quality §5 Block C). Empty until
   * the client confirms which documents they actually issue. */
  documents: string[];
}

export const company: Company = {
  registrations: {
    fssai: "", // CLIENT TO CONFIRM
    iec: "", // CLIENT TO CONFIRM
    spicesBoard: "", // CLIENT TO CONFIRM
    apeda: "", // CLIENT TO CONFIRM
    teaBoard: "", // CLIENT TO CONFIRM
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
    incoterms: "", // CLIENT TO CONFIRM
    ports: "", // CLIENT TO CONFIRM
    payment: "", // CLIENT TO CONFIRM
    transitUk: "", // CLIENT TO CONFIRM
    transitUsEast: "", // CLIENT TO CONFIRM
    transitUsWest: "", // CLIENT TO CONFIRM
    samplePolicy: "", // CLIENT TO CONFIRM
  },
  stats: {
    established: "", // CLIENT TO CONFIRM
    growerPartnerships: "", // CLIENT TO CONFIRM
    shipmentsDelivered: "", // CLIENT TO CONFIRM
  },
  testPanel: [], // CLIENT TO CONFIRM — real parameters/limits per lot
  documents: [], // CLIENT TO CONFIRM — actual document set issued
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
