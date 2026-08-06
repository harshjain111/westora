import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { CredentialStrip } from "@/components/sections/CredentialStrip";
import { Catalogue } from "@/components/sections/Catalogue";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Quality } from "@/components/sections/Quality";
import { About } from "@/components/sections/About";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { OriginMap } from "@/components/sections/OriginMap";
import { BuyerVoices } from "@/components/sections/BuyerVoices";
import { Faq } from "@/components/sections/Faq";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { Footer } from "@/components/sections/Footer";
import { CatalogueFilterProvider } from "@/lib/context/CatalogueFilterContext";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <CatalogueFilterProvider>
      <Nav />
      <Hero />
      <CredentialStrip />
      <Catalogue />
      <HowWeWork />
      <Quality />
      <About />
      <WhyChooseUs />
      <OriginMap />
      <BuyerVoices />
      <Faq />
      <EnquirySection />
      <Footer />
    </CatalogueFilterProvider>
  );
}
