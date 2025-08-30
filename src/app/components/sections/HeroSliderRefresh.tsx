'use client';

import { useQuery } from '@tanstack/react-query';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';
import { SlideItem } from '@/app/utils';
import HeroSliderClient from './HeroSliderClient';

export default function HeroSliderRefresh() {
  // Use TanStack Query to get hero slides directly
  const { data: section, isLoading: loading } = useQuery({
    queryKey: ['content', 'heroSlides'],
    queryFn: () => getContentSectionByKey('heroSlides'),
  });

  const slidesArray = (section?.content as SlideItem[]) || [];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!slidesArray || slidesArray.length === 0) {
    // Fallback hero section when no slides are configured
    return (
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Beth Shalom Fairfield</h1>
          <p className="text-xl md:text-2xl opacity-90">A Conservative Jewish Community</p>
        </div>
      </section>
    );
  }

  return <HeroSliderClient slides={slidesArray} />;
}
