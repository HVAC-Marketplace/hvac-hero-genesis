
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import TrustBadges from "@/components/TrustBadges";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
      </main>
    </div>
  );
};

export default Index;
