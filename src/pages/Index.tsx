
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import TrustBadges from "@/components/TrustBadges";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has selected their audience type
    const audienceType = localStorage.getItem('audienceType');
    
    // If no audience type is selected, redirect to audience selection
    if (!audienceType) {
      navigate('/audience');
    }
  }, [navigate]);

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
