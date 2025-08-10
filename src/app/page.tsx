import HeroSlider from "@/components/sections/HeroSlider";
import AboutSection from "@/components/sections/AboutSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import ActionItemsSection from "@/components/sections/ActionItemsSection";
import PhotoGallery from "@/components/sections/PhotoGallery";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Programs Section */}
      <ProgramsSection />
      
      {/* Action Items Section */}
      <ActionItemsSection />
      
      {/* Photo Gallery Section */}
      <PhotoGallery />
    </div>
  );
}
