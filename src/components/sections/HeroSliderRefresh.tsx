'use client';

import { SlideItem } from '@/types/content';
import { useContentRefresh } from '@/hooks/useContentRefresh';
import HeroSliderClient from './HeroSliderClient';

export default function HeroSliderRefresh() {
  // Use the universal content refresh hook for hero slides
  const [dynamicSlides, loading] = useContentRefresh<SlideItem[]>('heroSlides');
  
  // Use database content only
  const slides = dynamicSlides;

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  return <HeroSliderClient slides={slides} />;
}
