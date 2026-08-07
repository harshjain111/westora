-- Westora Global — one-time seed migrating the 17 SKUs that previously
-- lived in data/products.ts (now a Supabase-backed read layer) into the
-- products table, verbatim, field for field, so no copy or spec changes
-- on go-live (CLAUDE.md §11 — never invent, never silently change data).
-- sort_order matches the original array order exactly.

insert into products
  (slug, name, category, origin, origin_district, botanical, has_gi, gi_number, hero_line, description, specs, forms, packaging, provenance, images, featured, sort_order)
values
  (
    'lakadong-turmeric', 'Lakadong Turmeric', 'spices', 'Meghalaya', 'Jaintia Hills', 'Curcuma longa', false, null,
    'Premium Lakadong Turmeric from Meghalaya, prized for its high curcumin content (7–12%), vibrant colour, and rich aroma.',
    'Premium Lakadong Turmeric from Meghalaya, prized for its high curcumin content (7–12%), vibrant colour, and rich aroma. Naturally grown and highly valued in global food, wellness, and culinary markets.',
    $json$[{"label":"Curcumin content","value":"7–12%"}]$json$::jsonb,
    ARRAY['Fresh','Dry','Whole','Powdered'], ARRAY[]::text[],
    ARRAY['Jaintia Hills','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/lakadong-turmeric.jpg","alt":"Whole and halved Lakadong turmeric fingers showing vibrant orange flesh"}]$json$::jsonb,
    true, 0
  ),
  (
    'king-chilli-bhut-jolokia', 'King Chilli', 'chillies', 'Nagaland', null, 'Capsicum chinense', false, null,
    'Premium Naga King Chilli from Nagaland, renowned for its intense heat, smoky aroma, and rich flavour.',
    'Premium Naga King Chilli from Nagaland, renowned for its intense heat, smoky aroma, and rich flavour. Highly valued in global markets for sauces, seasonings, pickles, and spice blends.',
    $json$[{"label":"Also known as","value":"Bhut Jolokia · Ghost Chilli · Raja Mircha"}]$json$::jsonb,
    ARRAY['Fresh','Dry','Smoke-Oven Processed'], ARRAY[]::text[],
    ARRAY['Nagaland','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/king-chilli-bhut-jolokia.jpg","alt":"Fresh King Chilli (Bhut Jolokia) pods on a wooden board"}]$json$::jsonb,
    true, 1
  ),
  (
    'karbi-anglong-ginger', 'Karbi Anglong Ginger', 'spices', 'Assam', 'Karbi Anglong', 'Zingiber officinale', false, null,
    'Premium ginger prized for its rich aroma, high oil content, and superior quality.',
    'Premium ginger prized for its rich aroma, high oil content, and superior quality. Naturally cultivated for global markets.',
    $json$[{"label":"Varieties available","value":"Aizol · Nadia"}]$json$::jsonb,
    ARRAY['Fresh','Dry','Whole','Powder'], ARRAY[]::text[],
    ARRAY['Karbi Anglong','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/karbi-anglong-ginger.jpg","alt":"Fresh Karbi Anglong ginger rhizomes"}]$json$::jsonb,
    false, 2
  ),
  (
    'large-cardamom', 'Large Cardamom', 'spices', 'Northeast India', null, 'Amomum subulatum', false, null,
    'Premium large cardamom from Northeast India, known for its bold aroma, smoky flavour, and high oil content.',
    'Premium large cardamom from Northeast India, known for its bold aroma, smoky flavour, and high oil content. Ideal for culinary, beverage and spice applications.',
    $json$[]$json$::jsonb,
    ARRAY['Fresh','Dry','Smoke-Oven Processed'], ARRAY[]::text[],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/large-cardamom.jpg","alt":"Dried large cardamom pods from Northeast India"}]$json$::jsonb,
    false, 3
  ),
  (
    'cinnamon', 'Cinnamon', 'spices', 'Northeast India', null, '', false, null,
    'Premium cinnamon from Northeast India, known for its rich aroma, natural sweetness, and high oil content.',
    'Premium cinnamon from Northeast India, known for its rich aroma, natural sweetness, and high oil content. Carefully harvested and naturally processed for food, beverage, spice blend, and wellness applications.',
    $json$[{"label":"Species","value":"Cassia or Ceylon cinnamon — pending client confirmation","unverified":true}]$json$::jsonb,
    ARRAY['Whole','Powdered','Fresh','Dry'], ARRAY[]::text[],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/cinnamon.jpg","alt":"Rolled cinnamon quills stacked together"}]$json$::jsonb,
    false, 4
  ),
  (
    'birds-eye-chilli', E'Bird\'s Eye Chilli', 'chillies', 'Mizoram', null, 'Capsicum frutescens', false, null,
    E'Premium Mizo Chilli from Mizoram, prized for its vibrant colour, intense heat, and rich flavour.',
    E'Premium Mizo Chilli from Mizoram, prized for its vibrant colour, intense heat, and rich flavour. Ideal for sauces, pickles, seasonings, and spice blends.',
    $json$[{"label":"Heat level","value":"50,000–100,000 SHU"}]$json$::jsonb,
    ARRAY['Fresh','Dry','Smoke-Oven Processed'], ARRAY[]::text[],
    ARRAY['Mizoram','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/birds-eye-chilli.jpg","alt":"Fresh red and green bird's eye chillies"}]$json$::jsonb,
    false, 5
  ),
  (
    'tepa-chilli', 'Tepa Chilli', 'chillies', 'Assam', null, '', false, null,
    'Premium Tepa Chilli from Assam, prized for its vibrant red colour, intense heat, and rich flavour.',
    'Premium Tepa Chilli from Assam, prized for its vibrant red colour, intense heat, and rich flavour. Widely used in traditional cuisines, spice blends, pickles, and sauces for its distinctive pungency and aroma.',
    $json$[{"label":"Heat level","value":"~75,000 SHU"}]$json$::jsonb,
    ARRAY['Fresh','Dry','Powdered'], ARRAY[]::text[],
    ARRAY['Assam','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/tepa-chilli.jpg","alt":"Dried Tepa chillies from Assam"}]$json$::jsonb,
    false, 6
  ),
  (
    'star-anise', 'Star Anise', 'spices', 'Arunachal Pradesh', null, 'Illicium verum', false, null,
    'Premium Star Anise from Arunachal Pradesh, prized for its rich aroma, strong flavour, and high oil content.',
    'Premium Star Anise from Arunachal Pradesh, prized for its rich aroma, strong flavour, and high oil content.',
    $json$[]$json$::jsonb,
    ARRAY['Whole','Dry'], ARRAY[]::text[],
    ARRAY['Arunachal Pradesh','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/star-anise.jpg","alt":"Whole dried star anise pods"}]$json$::jsonb,
    false, 7
  ),
  (
    'bay-leaf', 'Bay Leaf', 'spices', 'Northeast India', null, '', false, null,
    'Premium Bay Leaves from Northeast India, carefully selected for their bold aroma, deep olive-green colour, and high essential oil content.',
    'Premium Bay Leaves from Northeast India, carefully selected for their bold aroma, deep olive-green colour, and high essential oil content.',
    $json$[{"label":"Botanical note","value":"Likely Cinnamomum tamala (Indian bay / tejpat), commonly conflated with the Mediterranean Laurus nobilis — species confirmation pending","unverified":true}]$json$::jsonb,
    ARRAY['Whole Leaves','Dried'], ARRAY['Bulk Export Packs'],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/bay-leaf.jpg","alt":"Dried whole bay leaves"}]$json$::jsonb,
    false, 8
  ),
  (
    'black-pepper', 'Black Pepper', 'spices', 'Meghalaya', null, 'Piper nigrum', false, null,
    'Premium Black Pepper from Meghalaya, renowned for its bold flavour, rich aroma, and high piperine content.',
    'Premium Black Pepper from Meghalaya, renowned for its bold flavour, rich aroma, and high piperine content.',
    $json$[]$json$::jsonb,
    ARRAY['Whole','Powdered','Dry'], ARRAY[]::text[],
    ARRAY['Meghalaya','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/black-pepper.jpg","alt":"Whole dried black peppercorns"}]$json$::jsonb,
    false, 9
  ),
  (
    'black-sesame', 'Black Sesame', 'other', 'Northeast India', null, 'Sesamum indicum', false, null,
    'Premium Black Sesame Seeds from Northeast India, known for their rich aroma, high oil content, and superior quality.',
    'Premium Black Sesame Seeds from Northeast India, known for their rich aroma, high oil content, and superior quality.',
    $json$[]$json$::jsonb,
    ARRAY['Whole','Hulled','Roasted','Powdered'], ARRAY[]::text[],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/black-sesame.jpg","alt":"Whole black sesame seeds"}]$json$::jsonb,
    false, 10
  ),
  (
    'assam-tea', 'Assam Tea', 'tea', 'Assam', null, 'Camellia sinensis var. assamica', false, null,
    'Premium Assam Tea from the lush tea gardens of Northeast India, renowned for its rich aroma, bold flavour, and deep amber liquor.',
    'Premium Assam Tea from the lush tea gardens of Northeast India, renowned for its rich aroma, bold flavour, and deep amber liquor. A globally cherished tea prized for its strength and superior quality.',
    $json$[{"label":"Tea type","value":"Black tea"}]$json$::jsonb,
    ARRAY['CTC','Orthodox'], ARRAY['Bulk Export Packs'],
    ARRAY['Assam','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/assam-tea.jpg","alt":"Loose leaf Assam black tea"}]$json$::jsonb,
    false, 11
  ),
  (
    'green-tea', 'Green Tea', 'tea', 'Northeast India', null, 'Camellia sinensis', false, null,
    'Premium Green Tea from Northeast India, celebrated for its refreshing taste, delicate aroma, and natural antioxidant properties.',
    'Premium Green Tea from Northeast India, celebrated for its refreshing taste, delicate aroma, and natural antioxidant properties. Carefully processed to preserve purity, flavour, and nutritional benefits.',
    $json$[]$json$::jsonb,
    ARRAY['Loose Leaf','Tea Bags'], ARRAY['Bulk Export Packs'],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/green-tea.jpg","alt":"Fresh green tea leaves and processed leaf"}]$json$::jsonb,
    false, 12
  ),
  (
    'black-rice', 'Black Rice', 'rice', 'Manipur', null, 'Oryza sativa', false, null,
    'Premium Chak-Hao Black Rice from Manipur, renowned for its natural aroma, rich taste, and striking dark colour.',
    'Premium Chak-Hao Black Rice from Manipur, renowned for its natural aroma, rich taste, and striking dark colour. Rich in antioxidants and highly valued as a nutritious specialty rice in global markets.',
    $json$[]$json$::jsonb,
    ARRAY['Raw','Whole Grain'], ARRAY['Processed Packs'],
    ARRAY['Manipur','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/black-rice.jpg","alt":"Chak-Hao black rice grains"}]$json$::jsonb,
    false, 13
  ),
  (
    'joha-rice', 'Joha Rice', 'rice', 'Assam', null, 'Oryza sativa', false, null,
    'Premium Joha Rice from Assam, prized for its delicate aroma, soft texture, and superior flavour.',
    'Premium Joha Rice from Assam, prized for its delicate aroma, soft texture, and superior flavour. A traditional aromatic rice variety ideal for premium cuisines and everyday delicacies.',
    $json$[]$json$::jsonb,
    ARRAY['Raw','Whole Grain'], ARRAY['Processed Packs'],
    ARRAY['Assam','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/joha-rice.jpg","alt":"Joha rice grains with rice stalks"}]$json$::jsonb,
    false, 14
  ),
  (
    'vanilla', 'Vanilla', 'other', 'Northeast India', null, 'Vanilla planifolia', false, null,
    'Premium Vanilla from Northeast India, prized for its rich aroma, natural sweetness, and superior quality.',
    'Premium Vanilla from Northeast India, prized for its rich aroma, natural sweetness, and superior quality. Carefully harvested and naturally cured for global culinary and food applications.',
    $json$[]$json$::jsonb,
    ARRAY['Fresh Vanilla Pods','Dried Whole Pods','Vanilla Seeds (Caviar)','Extract'], ARRAY[]::text[],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/vanilla.jpg","alt":"Fresh vanilla pods, orchid flower and vanilla seed paste"}]$json$::jsonb,
    false, 15
  ),
  (
    'canned-pineapple', 'Canned Pineapple', 'other', 'Northeast India', null, 'Ananas comosus', false, null,
    'Premium canned pineapple crafted from farm-fresh Northeast Indian pineapples, known for their vibrant flavour, natural sweetness, and juicy texture.',
    'Premium canned pineapple crafted from farm-fresh Northeast Indian pineapples, known for their vibrant flavour, natural sweetness, and juicy texture. Hygienically processed for global food and beverage applications.',
    $json$[]$json$::jsonb,
    ARRAY['Slices','Chunks','Tidbits','Juice'], ARRAY['Retail Cans','Bulk Export Packs'],
    ARRAY['Northeast India','Guwahati','Kolkata (INCCU)','Felixstowe / New York'],
    $json$[{"src":"/images/products/canned-pineapple.jpg","alt":"Canned pineapple chunks and rings with fresh pineapple"}]$json$::jsonb,
    false, 16
  )
on conflict (slug) do nothing;
