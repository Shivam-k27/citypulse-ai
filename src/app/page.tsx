import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LiveStatsSection from "@/components/landing/LiveStatsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <LiveStatsSection />
    </main>
  );
}