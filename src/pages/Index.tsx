
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import TrustBadges from "@/components/TrustBadges";
import InteractiveSection from "@/components/InteractiveSection";
import FeaturesGrid from "@/components/FeaturesGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <FeaturesGrid />
        <InteractiveSection />
      </main>
    </div>
  );
};

export default Index;
