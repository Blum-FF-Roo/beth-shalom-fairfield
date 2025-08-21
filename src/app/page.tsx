import HeroSliderServer from "@/components/sections/HeroSliderServer";
import AboutSectionServer from "@/components/sections/AboutSectionServer";
import ProgramsSectionServer from "@/components/sections/ProgramsSectionServer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSliderServer />
      
      {/* About Section */}
      <AboutSectionServer />
      
      {/* Programs Section */}
      <ProgramsSectionServer />
    </div>
  );
}
