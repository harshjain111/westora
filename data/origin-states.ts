import type { StaticImageData } from "next/image";
import turmericImg from "@/public/images/spices/lakadong-turmeric.webp";
import chilliImg from "@/public/images/spices/king-chilli.webp";
import teaImg from "@/public/images/spices/assam-tea.webp";
import staraniseImg from "@/public/images/spices/star-anise.webp";
import blackRiceImg from "@/public/images/spices/black-rice.webp";
import birdsEyeImg from "@/public/images/spices/birds-eye-chilli.webp";
import pineappleImg from "@/public/images/spices/queen-pineapple.webp";

/**
 * The seven Northeast states and the one crop that represents each.
 *
 * Single source of truth for both the hero's origin spread and the
 * origin map, so a state can never appear in one and not the other, and
 * the two can never disagree about which crop stands for it.
 *
 * PROVENANCE — read before editing:
 *
 * Six entries carry a `slug`. Their state, district, botanical name and
 * note are copied verbatim from the matching row in
 * supabase/migrations/0009_products_seed.sql. Those are Westora's own
 * catalogued origins.
 *
 * Only Tripura has NO `slug`, because no row in the catalogue lists it
 * as an origin. Its crop is the state's genuine signature crop and the
 * botanical name is a fact about the species — but neither is a claim
 * that Westora currently sources it. That is why it carries no product
 * link and no spec: `slug` being absent is what stops the UI asserting
 * anything unverified (CLAUDE.md §11). Give Tripura a real catalogue row
 * and add the slug.
 *
 * No entry claims GI status: every seeded row has has_gi = false.
 *
 * `x`/`y` are percentages within public/images/origin-map.png, measured
 * by pixel-probing the landmass rather than eyeballed. The map artwork
 * itself labels only six states — Tripura's lobe is unlabelled — so its
 * name reaches the reader through the pin's hover card, not the image.
 */

export interface OriginState {
  /** State name, as printed. */
  name: string;
  /** Catalogue slug — absent when no SKU lists this state as its origin. */
  slug?: string;
  crop: string;
  district?: string;
  /** Botanical name of the crop. */
  botanical: string;
  /** One buyer-relevant fact. Only set alongside a slug. */
  note?: string;
  image: StaticImageData;
  /** Pin position as a percentage of the map image. */
  x: number;
  y: number;
}

export const ORIGIN_STATES: OriginState[] = [
  {
    name: "Arunachal Pradesh",
    slug: "star-anise",
    crop: "Star Anise",
    botanical: "Illicium verum",
    note: "High volatile oil content",
    image: staraniseImg,
    x: 64.9,
    y: 20.1,
  },
  {
    name: "Assam",
    slug: "assam-tea",
    crop: "Assam Tea",
    botanical: "Camellia sinensis var. assamica",
    note: "Black tea · orthodox and CTC",
    image: teaImg,
    x: 36.8,
    y: 41.2,
  },
  {
    name: "Nagaland",
    slug: "king-chilli-bhut-jolokia",
    crop: "King Chilli",
    botanical: "Capsicum chinense",
    note: "Bhut Jolokia · Ghost Chilli · Raja Mircha",
    image: chilliImg,
    x: 63.1,
    y: 44.2,
  },
  {
    name: "Meghalaya",
    slug: "lakadong-turmeric",
    crop: "Lakadong Turmeric",
    district: "Jaintia Hills",
    botanical: "Curcuma longa",
    note: "Curcumin 7–12%",
    image: turmericImg,
    x: 16.4,
    y: 57.3,
  },
  {
    name: "Manipur",
    slug: "black-rice",
    crop: "Black Rice",
    botanical: "Oryza sativa",
    note: "Chak-Hao · aromatic specialty rice",
    image: blackRiceImg,
    x: 56.6,
    y: 60.4,
  },
  {
    name: "Tripura",
    crop: "Queen Pineapple",
    botanical: "Ananas comosus",
    image: pineappleImg,
    x: 28.5,
    y: 76.0,
  },
  {
    name: "Mizoram",
    slug: "birds-eye-chilli",
    crop: "Bird's Eye Chilli",
    botanical: "Capsicum frutescens",
    note: "Mizo Chilli · 50,000–100,000 SHU",
    image: birdsEyeImg,
    x: 40.7,
    y: 80.9,
  },
];

/** Every state name, in map order. */
export const ORIGIN_STATE_NAMES = ORIGIN_STATES.map((s) => s.name);
