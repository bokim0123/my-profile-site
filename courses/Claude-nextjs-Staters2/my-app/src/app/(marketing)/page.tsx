import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";

// 랜딩 페이지: sections 블록 조합만 담당
export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
