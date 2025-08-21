'use client';

import { heroSlides } from '@/data/site-data';
import { SlideItem } from '@/types/content';
import { useContent } from '@/hooks/useContent';
import HeroSliderClient from './HeroSliderClient';

export default function HeroSliderServer() {
  const { content: dynamicSlides, loading } = useContent('heroSlides', heroSlides);
  const slides = dynamicSlides as SlideItem[];

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#F58C28'}}></div>
        </div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  // Pass the slides to the client component for interactivity
  return <HeroSliderClient slides={slides} />;
}