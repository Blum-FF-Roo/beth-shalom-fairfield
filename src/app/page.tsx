import HeroSliderRefresh from "@/components/sections/HeroSliderRefresh";
import AboutSectionRefresh from "@/components/sections/AboutSectionRefresh";
import ProgramsSectionServer from "@/components/sections/ProgramsSectionServer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSliderRefresh />
      
      {/* About Section */}
      <AboutSectionRefresh />
      
      {/* Programs Section */}
      <ProgramsSectionServer />
    </div>
  );
}
