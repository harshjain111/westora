-- Westora Global — QA seed data
--
-- NOT a migration — run manually against a dev/staging Supabase project
-- to exercise the admin dashboard, leads table, filters and charts.
-- Every reference is prefixed TEST- so it's unmistakable in the UI and
-- trivially found again. Do not run this against production.
--
-- The reference trigger (0003_reference_generator.sql) only fires when
-- `reference` is null/empty, so providing TEST-… values here bypasses it
-- cleanly — no collision with real WG-YYYY-NNNN references.
--
-- To remove before launch, run:
--   delete from leads where reference like 'TEST-%';

insert into leads
  (reference, full_name, company_name, email, phone, country, products, volume, destination_port, message, source_section, status, consent_given, created_at)
values
  ('TEST-0001', 'Alice Norton', 'Norton Fine Foods', 'alice@nortonfinefoods.co.uk', '+447700900001', 'United Kingdom', array['lakadong-turmeric','black-pepper'], '2 tonnes / quarter', 'Felixstowe', 'Interested in a sample of the turmeric first.', 'main_form', 'new', true, now() - interval '1 day'),
  ('TEST-0002', 'Ben Ortiz', 'Ortiz Spice Co', 'ben@ortizspice.com', '+14155550002', 'United States', array['king-chilli-bhut-jolokia'], '500 kg', 'New York', null, 'modal', 'contacted', true, now() - interval '2 days'),
  ('TEST-0003', 'Priya Shah', 'Shah Imports Ltd', 'priya@shahimports.co.uk', '+447700900003', 'United Kingdom', array['assam-tea','green-tea'], '1 tonne', 'Felixstowe', 'Please send COA with the sample.', 'main_form', 'quoted', true, now() - interval '3 days'),
  ('TEST-0004', 'Carlos Mendes', 'Mendes Trading', 'carlos@mendestrading.com', '+14155550004', 'United States', array['black-rice'], '250 kg', 'Los Angeles', null, 'product_page', 'new', true, now() - interval '4 days'),
  ('TEST-0005', 'Diana Wolfe', 'Wolfe & Sons', 'diana@wolfeandsons.co.uk', '+447700900005', 'United Kingdom', array['star-anise','cinnamon'], null, null, 'Small trial order to start.', 'main_form', 'sampled', true, now() - interval '5 days'),
  ('TEST-0006', 'Ethan Cole', 'Cole Gourmet', 'ethan@colegourmet.com', '+14155550006', 'United States', array['vanilla'], '50 kg', 'Miami', null, 'modal', 'new', true, now() - interval '6 days'),
  ('TEST-0007', 'Fatima Iqbal', 'Iqbal Foods', 'fatima@iqbalfoods.co.uk', '+447700900007', 'United Kingdom', array['bay-leaf','black-pepper','star-anise'], '3 pallets', 'Southampton', null, 'main_form', 'won', true, now() - interval '7 days'),
  ('TEST-0008', 'George Papas', 'Papas Import Export', 'george@papasie.com', '+14155550008', 'United States', array['birds-eye-chilli'], null, null, 'What is your MOQ for this?', 'product_page', 'new', true, now() - interval '8 days'),
  ('TEST-0009', 'Hannah Frost', 'Frost Culinary', 'hannah@frostculinary.co.uk', '+447700900009', 'United Kingdom', array['karbi-anglong-ginger'], '1 tonne', 'Felixstowe', null, 'main_form', 'contacted', true, now() - interval '9 days'),
  ('TEST-0010', 'Ivan Petrov', 'Petrov Distribution', 'ivan@petrovdist.com', '+14155550010', 'United States', array['joha-rice','black-rice'], '2 tonnes', 'Houston', null, 'modal', 'new', true, now() - interval '10 days'),
  ('TEST-0011', 'Julia Kwan', 'Kwan Specialty Foods', 'julia@kwanfoods.co.uk', '+447700900011', 'United Kingdom', array['large-cardamom'], '400 kg', null, null, 'main_form', 'lost', true, now() - interval '12 days'),
  ('TEST-0012', 'Kevin Ruiz', 'Ruiz Brothers Import', 'kevin@ruizbrothers.com', '+14155550012', 'United States', array['tepa-chilli'], null, 'Newark', 'Curious about heat consistency between lots.', 'product_page', 'new', true, now() - interval '13 days'),
  ('TEST-0013', 'Laura Bianchi', 'Bianchi & Co', 'laura@bianchico.co.uk', '+447700900013', 'United Kingdom', array['canned-pineapple'], '5 pallets', 'Tilbury', null, 'main_form', 'quoted', true, now() - interval '15 days'),
  ('TEST-0014', 'Marcus Webb', 'Webb Wholesale', 'marcus@webbwholesale.com', '+14155550014', 'United States', array['black-sesame'], '300 kg', null, null, 'modal', 'new', true, now() - interval '16 days'),
  ('TEST-0015', 'Nina Popescu', 'Popescu Trading House', 'nina@popescuth.co.uk', '+447700900015', 'United Kingdom', array['lakadong-turmeric'], '2 tonnes', 'Felixstowe', 'Long-term supply relationship interest.', 'main_form', 'sampled', true, now() - interval '18 days'),
  ('TEST-0016', 'Oscar Lindqvist', 'Lindqvist Foods', 'oscar@lindqvistfoods.com', '+14155550016', 'United States', array['king-chilli-bhut-jolokia','birds-eye-chilli'], '600 kg', 'Seattle', null, 'product_page', 'new', true, now() - interval '20 days'),
  ('TEST-0017', 'Patricia Nyong', 'Nyong Global Trade', 'patricia@nyongtrade.co.uk', '+447700900017', 'United Kingdom', array['assam-tea'], '1.5 tonnes', null, null, 'main_form', 'contacted', true, now() - interval '22 days'),
  ('TEST-0018', 'Quentin Dubois', 'Dubois Importation', 'quentin@duboisimport.com', '+14155550018', 'United States', array['green-tea','black-rice'], null, 'Boston', 'Requesting pricing for both lines.', 'modal', 'new', true, now() - interval '25 days'),
  ('TEST-0019', 'Rosa Fernandez', 'Fernandez Specialty', 'rosa@fernandezspecialty.co.uk', '+447700900019', 'United Kingdom', array['black-pepper','bay-leaf'], '2 tonnes', 'Felixstowe', null, 'main_form', 'won', true, now() - interval '27 days'),
  ('TEST-0020', 'Samuel Okafor', 'Okafor Foods International', 'samuel@okaforfoods.com', '+14155550020', 'United States', array['vanilla','canned-pineapple'], '400 kg', 'New York', null, 'product_page', 'new', true, now() - interval '29 days');
