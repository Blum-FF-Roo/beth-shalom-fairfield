import { heroSlides } from '@/data/site-data';
import { SlideItem } from '@/types/content';
import { getContentByKey } from '@/lib/content-server';
import HeroSliderClient from './HeroSliderClient';

export default async function HeroSliderServer() {
  // Load slides server-side
  const dynamicSlides = await getContentByKey('heroSlides');
  const slides = (dynamicSlides || heroSlides) as SlideItem[];

  if (!slides || slides.length === 0) {
    return null;
  }

  // Pass the slides to the client component for interactivity
  return <HeroSliderClient slides={slides} />;
}