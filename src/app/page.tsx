import { SectionErrorBoundary } from "@/app/components/ui/ErrorBoundary";
import { 
  HeroSliderWithSuspense, 
  AboutSectionWithSuspense, 
  ProgramsSectionWithSuspense 
} from "@/app/components/lazy/LazyComponents";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SectionErrorBoundary>
        <HeroSliderWithSuspense />
      </SectionErrorBoundary>
      
      {/* About Section */}
      <SectionErrorBoundary title="About">
        <AboutSectionWithSuspense />
      </SectionErrorBoundary>
      
      {/* Programs Section */}
      <SectionErrorBoundary title="Programs">
        <ProgramsSectionWithSuspense />
      </SectionErrorBoundary>
    </div>
  );
}
