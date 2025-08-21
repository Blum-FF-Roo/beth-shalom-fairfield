import { getContentByKey } from '@/lib/content-server';
import { heroSlides } from '@/data/site-data';
import { SlideItem } from '@/types/content';
import HeroSliderClient from './HeroSliderClient';

export default async function HeroSliderServer() {
  // Fetch slides server-side with fallback
  const dynamicSlides = await getContentByKey('heroSlides') as SlideItem[] || heroSlides;

  if (!dynamicSlides || dynamicSlides.length === 0) {
    return null;
  }

  // Pass the slides to the client component for interactivity
  return <HeroSliderClient slides={dynamicSlides} />;
}