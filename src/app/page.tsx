import HeroSliderRefresh from "@/app/components/sections/HeroSliderRefresh";
import AboutSectionRefresh from "@/app/components/sections/AboutSectionRefresh";
import ProgramsSection from "@/app/components/sections/ProgramsSection";

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
