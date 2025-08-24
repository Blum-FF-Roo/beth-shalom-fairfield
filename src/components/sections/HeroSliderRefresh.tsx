'use client';

import { heroSlides } from '@/data/site-data';
import { SlideItem } from '@/types/content';
import { useContentRefresh } from '@/hooks/useContentRefresh';
import HeroSliderClient from './HeroSliderClient';

export default function HeroSliderRefresh() {
  // Use the universal content refresh hook for hero slides
  const [dynamicSlides, loading] = useContentRefresh<SlideItem[]>('heroSlides');
  
  // Use default slides if no dynamic slides or still loading
  const slides = (dynamicSlides && dynamicSlides.length > 0) ? dynamicSlides : heroSlides;

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