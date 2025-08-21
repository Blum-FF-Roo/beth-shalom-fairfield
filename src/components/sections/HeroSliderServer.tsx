'use client';

import { heroSlides } from '@/data/site-data';
import { SlideItem } from '@/types/content';
import { useContent } from '@/hooks/useContent';
import HeroSliderClient from './HeroSliderClient';

export default function HeroSliderServer() {
  const { content: dynamicSlides, loading } = useContent('heroSlides', heroSlides);
  const slides = dynamicSlides as SlideItem[];

  // Show static slides immediately, then update with dynamic slides once loaded
  // This prevents the 3-second loading screen

  if (!slides || slides.length === 0) {
    return null;
  }

  // Pass the slides to the client component for interactivity
  return <HeroSliderClient slides={slides} />;
}