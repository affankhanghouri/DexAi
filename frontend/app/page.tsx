import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { CampaignGallerySection } from "@/components/landing/campaign-gallery-section"
import { RevealTextSection } from "@/components/landing/reveal-text-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { CreativeLabShowcaseSection } from "@/components/landing/creative-lab-showcase-section"
import { TrustStatsSection } from "@/components/landing/trust-stats-section"
import { CampaignIntelligenceSection } from "@/components/landing/campaign-intelligence-section"
import RevealObserver from "@/components/revealObserver"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <RevealObserver />
      <HeroSection />
      <TrustStatsSection />
      <CampaignIntelligenceSection />
      <CreativeLabShowcaseSection />
      <CampaignGallerySection />
      <RevealTextSection />
      <FinalCtaSection />
    </main>
  )
}
