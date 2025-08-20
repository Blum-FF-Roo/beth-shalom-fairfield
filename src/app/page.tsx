import HeroSlider from "@/components/sections/HeroSlider";
import AboutSection from "@/components/sections/AboutSection";
import ProgramsSection from "@/components/sections/ProgramsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Programs Section */}
      <ProgramsSection />
    </div>
  );
}
