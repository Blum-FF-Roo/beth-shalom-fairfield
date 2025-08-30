import HeroSliderRefresh from "@/components/sections/HeroSliderRefresh";
import AboutSectionRefresh from "@/components/sections/AboutSectionRefresh";
import ProgramsSection from "@/components/sections/ProgramsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSliderRefresh />
      
      {/* About Section */}
      <AboutSectionRefresh />
      
      {/* Programs Section */}
      <ProgramsSection />
    </div>
  );
}
