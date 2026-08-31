/**
 * GENERATED — do not edit by hand.
 * Run: python3 scripts/gen-product-fallback.py
 *
 * Build-time snapshot of supabase/migrations/0009_products_seed.sql.
 * Supabase remains the source of truth; this is used ONLY when the
 * product fetch throws, so an outage cannot ship an empty catalogue.
 * It is deliberately NOT used when Supabase returns zero rows — that is
 * a real answer (someone deleted them) and must not be overridden.
 *
 * 17 products.
 */
import type { Product } from "@/data/products";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    "slug": "lakadong-turmeric",
    "name": "Lakadong Turmeric",
    "category": "spices",
    "origin": "Meghalaya",
    "botanical": "Curcuma longa",
    "hasGI": false,
    "heroLine": "Premium Lakadong Turmeric from Meghalaya, prized for its high curcumin content (7–12%), vibrant colour, and rich aroma.",
    "description": "Premium Lakadong Turmeric from Meghalaya, prized for its high curcumin content (7–12%), vibrant colour, and rich aroma. Naturally grown and highly valued in global food, wellness, and culinary markets.",
    "specs": [
      {
        "label": "Curcumin content",
        "value": "7–12%"
      }
    ],
    "forms": [
      "Fresh",
      "Dry",
      "Whole",
      "Powdered"
    ],
    "packaging": [],
    "provenance": [
      "Jaintia Hills",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/lakadong-turmeric.jpg",
        "alt": "Whole and halved Lakadong turmeric fingers showing vibrant orange flesh"
      }
    ],
    "featured": true,
    "customFields": [],
    "packingSizes": [],
    "originDistrict": "Jaintia Hills"
  },
  {
    "slug": "king-chilli-bhut-jolokia",
    "name": "King Chilli",
    "category": "chillies",
    "origin": "Nagaland",
    "botanical": "Capsicum chinense",
    "hasGI": false,
    "heroLine": "Premium Naga King Chilli from Nagaland, renowned for its intense heat, smoky aroma, and rich flavour.",
    "description": "Premium Naga King Chilli from Nagaland, renowned for its intense heat, smoky aroma, and rich flavour. Highly valued in global markets for sauces, seasonings, pickles, and spice blends.",
    "specs": [
      {
        "label": "Also known as",
        "value": "Bhut Jolokia · Ghost Chilli · Raja Mircha"
      }
    ],
    "forms": [
      "Fresh",
      "Dry",
      "Smoke-Oven Processed"
    ],
    "packaging": [],
    "provenance": [
      "Nagaland",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/king-chilli-bhut-jolokia.jpg",
        "alt": "Fresh King Chilli (Bhut Jolokia) pods on a wooden board"
      }
    ],
    "featured": true,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "karbi-anglong-ginger",
    "name": "Karbi Anglong Ginger",
    "category": "spices",
    "origin": "Assam",
    "botanical": "Zingiber officinale",
    "hasGI": false,
    "heroLine": "Premium ginger prized for its rich aroma, high oil content, and superior quality.",
    "description": "Premium ginger prized for its rich aroma, high oil content, and superior quality. Naturally cultivated for global markets.",
    "specs": [
      {
        "label": "Varieties available",
        "value": "Aizol · Nadia"
      }
    ],
    "forms": [
      "Fresh",
      "Dry",
      "Whole",
      "Powder"
    ],
    "packaging": [],
    "provenance": [
      "Karbi Anglong",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/karbi-anglong-ginger.jpg",
        "alt": "Fresh Karbi Anglong ginger rhizomes"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": [],
    "originDistrict": "Karbi Anglong"
  },
  {
    "slug": "large-cardamom",
    "name": "Large Cardamom",
    "category": "spices",
    "origin": "Northeast India",
    "botanical": "Amomum subulatum",
    "hasGI": false,
    "heroLine": "Premium large cardamom from Northeast India, known for its bold aroma, smoky flavour, and high oil content.",
    "description": "Premium large cardamom from Northeast India, known for its bold aroma, smoky flavour, and high oil content. Ideal for culinary, beverage and spice applications.",
    "specs": [],
    "forms": [
      "Fresh",
      "Dry",
      "Smoke-Oven Processed"
    ],
    "packaging": [],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/large-cardamom.jpg",
        "alt": "Dried large cardamom pods from Northeast India"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "cinnamon",
    "name": "Cinnamon",
    "category": "spices",
    "origin": "Northeast India",
    "botanical": "",
    "hasGI": false,
    "heroLine": "Premium cinnamon from Northeast India, known for its rich aroma, natural sweetness, and high oil content.",
    "description": "Premium cinnamon from Northeast India, known for its rich aroma, natural sweetness, and high oil content. Carefully harvested and naturally processed for food, beverage, spice blend, and wellness applications.",
    "specs": [
      {
        "label": "Species",
        "value": "Cassia or Ceylon cinnamon — pending client confirmation",
        "unverified": true
      }
    ],
    "forms": [
      "Whole",
      "Powdered",
      "Fresh",
      "Dry"
    ],
    "packaging": [],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/cinnamon.jpg",
        "alt": "Rolled cinnamon quills stacked together"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "birds-eye-chilli",
    "name": "Bird's Eye Chilli",
    "category": "chillies",
    "origin": "Mizoram",
    "botanical": "Capsicum frutescens",
    "hasGI": false,
    "heroLine": "Premium Mizo Chilli from Mizoram, prized for its vibrant colour, intense heat, and rich flavour.",
    "description": "Premium Mizo Chilli from Mizoram, prized for its vibrant colour, intense heat, and rich flavour. Ideal for sauces, pickles, seasonings, and spice blends.",
    "specs": [
      {
        "label": "Heat level",
        "value": "50,000–100,000 SHU"
      }
    ],
    "forms": [
      "Fresh",
      "Dry",
      "Smoke-Oven Processed"
    ],
    "packaging": [],
    "provenance": [
      "Mizoram",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/birds-eye-chilli.jpg",
        "alt": "Fresh red and green bird's eye chillies"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "tepa-chilli",
    "name": "Tepa Chilli",
    "category": "chillies",
    "origin": "Assam",
    "botanical": "",
    "hasGI": false,
    "heroLine": "Premium Tepa Chilli from Assam, prized for its vibrant red colour, intense heat, and rich flavour.",
    "description": "Premium Tepa Chilli from Assam, prized for its vibrant red colour, intense heat, and rich flavour. Widely used in traditional cuisines, spice blends, pickles, and sauces for its distinctive pungency and aroma.",
    "specs": [
      {
        "label": "Heat level",
        "value": "~75,000 SHU"
      }
    ],
    "forms": [
      "Fresh",
      "Dry",
      "Powdered"
    ],
    "packaging": [],
    "provenance": [
      "Assam",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/tepa-chilli.jpg",
        "alt": "Dried Tepa chillies from Assam"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "star-anise",
    "name": "Star Anise",
    "category": "spices",
    "origin": "Arunachal Pradesh",
    "botanical": "Illicium verum",
    "hasGI": false,
    "heroLine": "Premium Star Anise from Arunachal Pradesh, prized for its rich aroma, strong flavour, and high oil content.",
    "description": "Premium Star Anise from Arunachal Pradesh, prized for its rich aroma, strong flavour, and high oil content.",
    "specs": [],
    "forms": [
      "Whole",
      "Dry"
    ],
    "packaging": [],
    "provenance": [
      "Arunachal Pradesh",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/star-anise.jpg",
        "alt": "Whole dried star anise pods"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "bay-leaf",
    "name": "Bay Leaf",
    "category": "spices",
    "origin": "Northeast India",
    "botanical": "",
    "hasGI": false,
    "heroLine": "Premium Bay Leaves from Northeast India, carefully selected for their bold aroma, deep olive-green colour, and high essential oil content.",
    "description": "Premium Bay Leaves from Northeast India, carefully selected for their bold aroma, deep olive-green colour, and high essential oil content.",
    "specs": [
      {
        "label": "Botanical note",
        "value": "Likely Cinnamomum tamala (Indian bay / tejpat), commonly conflated with the Mediterranean Laurus nobilis — species confirmation pending",
        "unverified": true
      }
    ],
    "forms": [
      "Whole Leaves",
      "Dried"
    ],
    "packaging": [
      "Bulk Export Packs"
    ],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/bay-leaf.jpg",
        "alt": "Dried whole bay leaves"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "black-pepper",
    "name": "Black Pepper",
    "category": "spices",
    "origin": "Meghalaya",
    "botanical": "Piper nigrum",
    "hasGI": false,
    "heroLine": "Premium Black Pepper from Meghalaya, renowned for its bold flavour, rich aroma, and high piperine content.",
    "description": "Premium Black Pepper from Meghalaya, renowned for its bold flavour, rich aroma, and high piperine content.",
    "specs": [],
    "forms": [
      "Whole",
      "Powdered",
      "Dry"
    ],
    "packaging": [],
    "provenance": [
      "Meghalaya",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/black-pepper.jpg",
        "alt": "Whole dried black peppercorns"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "black-sesame",
    "name": "Black Sesame",
    "category": "other",
    "origin": "Northeast India",
    "botanical": "Sesamum indicum",
    "hasGI": false,
    "heroLine": "Premium Black Sesame Seeds from Northeast India, known for their rich aroma, high oil content, and superior quality.",
    "description": "Premium Black Sesame Seeds from Northeast India, known for their rich aroma, high oil content, and superior quality.",
    "specs": [],
    "forms": [
      "Whole",
      "Hulled",
      "Roasted",
      "Powdered"
    ],
    "packaging": [],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/black-sesame.jpg",
        "alt": "Whole black sesame seeds"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "assam-tea",
    "name": "Assam Tea",
    "category": "tea",
    "origin": "Assam",
    "botanical": "Camellia sinensis var. assamica",
    "hasGI": false,
    "heroLine": "Premium Assam Tea from the lush tea gardens of Northeast India, renowned for its rich aroma, bold flavour, and deep amber liquor.",
    "description": "Premium Assam Tea from the lush tea gardens of Northeast India, renowned for its rich aroma, bold flavour, and deep amber liquor. A globally cherished tea prized for its strength and superior quality.",
    "specs": [
      {
        "label": "Tea type",
        "value": "Black tea"
      }
    ],
    "forms": [
      "CTC",
      "Orthodox"
    ],
    "packaging": [
      "Bulk Export Packs"
    ],
    "provenance": [
      "Assam",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/assam-tea.jpg",
        "alt": "Loose leaf Assam black tea"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "green-tea",
    "name": "Green Tea",
    "category": "tea",
    "origin": "Northeast India",
    "botanical": "Camellia sinensis",
    "hasGI": false,
    "heroLine": "Premium Green Tea from Northeast India, celebrated for its refreshing taste, delicate aroma, and natural antioxidant properties.",
    "description": "Premium Green Tea from Northeast India, celebrated for its refreshing taste, delicate aroma, and natural antioxidant properties. Carefully processed to preserve purity, flavour, and nutritional benefits.",
    "specs": [],
    "forms": [
      "Loose Leaf",
      "Tea Bags"
    ],
    "packaging": [
      "Bulk Export Packs"
    ],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/green-tea.jpg",
        "alt": "Fresh green tea leaves and processed leaf"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "black-rice",
    "name": "Black Rice",
    "category": "rice",
    "origin": "Manipur",
    "botanical": "Oryza sativa",
    "hasGI": false,
    "heroLine": "Premium Chak-Hao Black Rice from Manipur, renowned for its natural aroma, rich taste, and striking dark colour.",
    "description": "Premium Chak-Hao Black Rice from Manipur, renowned for its natural aroma, rich taste, and striking dark colour. Rich in antioxidants and highly valued as a nutritious specialty rice in global markets.",
    "specs": [],
    "forms": [
      "Raw",
      "Whole Grain"
    ],
    "packaging": [
      "Processed Packs"
    ],
    "provenance": [
      "Manipur",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/black-rice.jpg",
        "alt": "Chak-Hao black rice grains"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "joha-rice",
    "name": "Joha Rice",
    "category": "rice",
    "origin": "Assam",
    "botanical": "Oryza sativa",
    "hasGI": false,
    "heroLine": "Premium Joha Rice from Assam, prized for its delicate aroma, soft texture, and superior flavour.",
    "description": "Premium Joha Rice from Assam, prized for its delicate aroma, soft texture, and superior flavour. A traditional aromatic rice variety ideal for premium cuisines and everyday delicacies.",
    "specs": [],
    "forms": [
      "Raw",
      "Whole Grain"
    ],
    "packaging": [
      "Processed Packs"
    ],
    "provenance": [
      "Assam",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/joha-rice.jpg",
        "alt": "Joha rice grains with rice stalks"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "vanilla",
    "name": "Vanilla",
    "category": "other",
    "origin": "Northeast India",
    "botanical": "Vanilla planifolia",
    "hasGI": false,
    "heroLine": "Premium Vanilla from Northeast India, prized for its rich aroma, natural sweetness, and superior quality.",
    "description": "Premium Vanilla from Northeast India, prized for its rich aroma, natural sweetness, and superior quality. Carefully harvested and naturally cured for global culinary and food applications.",
    "specs": [],
    "forms": [
      "Fresh Vanilla Pods",
      "Dried Whole Pods",
      "Vanilla Seeds (Caviar)",
      "Extract"
    ],
    "packaging": [],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/vanilla.jpg",
        "alt": "Fresh vanilla pods, orchid flower and vanilla seed paste"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  },
  {
    "slug": "canned-pineapple",
    "name": "Canned Pineapple",
    "category": "other",
    "origin": "Northeast India",
    "botanical": "Ananas comosus",
    "hasGI": false,
    "heroLine": "Premium canned pineapple crafted from farm-fresh Northeast Indian pineapples, known for their vibrant flavour, natural sweetness, and juicy texture.",
    "description": "Premium canned pineapple crafted from farm-fresh Northeast Indian pineapples, known for their vibrant flavour, natural sweetness, and juicy texture. Hygienically processed for global food and beverage applications.",
    "specs": [],
    "forms": [
      "Slices",
      "Chunks",
      "Tidbits",
      "Juice"
    ],
    "packaging": [
      "Retail Cans",
      "Bulk Export Packs"
    ],
    "provenance": [
      "Northeast India",
      "Guwahati",
      "Kolkata (INCCU)",
      "Felixstowe / New York"
    ],
    "images": [
      {
        "src": "/images/products/canned-pineapple.jpg",
        "alt": "Canned pineapple chunks and rings with fresh pineapple"
      }
    ],
    "featured": false,
    "customFields": [],
    "packingSizes": []
  }
];
