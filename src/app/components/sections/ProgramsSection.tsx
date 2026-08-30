'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';

// All possible programs. Which ones actually show (and in what order) is
// controlled independently from the admin panel (Home tab -> Programs Toggle).
const ALL_PROGRAMS = [
  {
    id: 'shabbat',
    title: 'Shabbat Services',
    imageUrl: '/images/pexels-cottonbro-5986499.jpg',
    linkUrl: '/shabbat'
  },
  {
    id: 'highHolyDays',
    title: 'High Holy Days',
    imageUrl: '/images/gettyimages-1869577249-612x612.jpg',
    linkUrl: '/high-holy-days'
  },
  {
    id: 'passover',
    title: 'Passover',
    imageUrl: '/images/pexels-cottonbro-5974866.jpg',
    linkUrl: '/passover'
  },
  {
    id: 'temp',
    title: 'Temp',
    imageUrl: '/images/pexels-cottonbro-5985982.jpg',
    linkUrl: '/'
  }
] as const;

// Matches the site's current default appearance (Shabbat + High Holy Days
// shown, Passover off) so nothing changes visually until an admin opts in.
const DEFAULT_ENABLED_IDS = ['shabbat', 'highHolyDays'];

const GRID_CLASS_BY_COUNT: Record<number, string> = {
  1: 'grid-cols-1 max-w-sm',
  2: 'grid-cols-1 md:grid-cols-2 max-w-2xl',
  3: 'grid-cols-1 md:grid-cols-3 max-w-4xl',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl'
};

function ProgramsSection() {
  // Use TanStack Query to get the programs toggle setting directly
  const { data: toggleSection, isLoading: loading } = useQuery({
    queryKey: ['content', 'programsToggle'],
    queryFn: () => getContentSectionByKey('programsToggle'),
  });

  const enabledIds = Array.isArray(toggleSection?.content)
    ? (toggleSection.content as string[])
    : DEFAULT_ENABLED_IDS;

  const displayPrograms = ALL_PROGRAMS.filter(program => enabledIds.includes(program.id));

  if (loading) {
    return (
      <section className="py-12 bg-gray-50" role="region" aria-labelledby="programs-heading">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Programs
            </h2>
          </div>
          <div
            className="flex items-center justify-center py-8"
            role="status"
            aria-label="Loading programs"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (displayPrograms.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50" role="region" aria-labelledby="programs-heading">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programs
          </h2>
        </div>

        {/* Programs Grid - adapts to however many are enabled (1-3) */}
        <div className={`grid ${GRID_CLASS_BY_COUNT[displayPrograms.length]} gap-8 mx-auto`}>
          {displayPrograms.map((program) => (
            <div key={program.id} className="group">
              <Link
                href={program.linkUrl}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label={`Learn more about ${program.title}`}
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={program.imageUrl}
                    alt={`${program.title} program image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                    {program.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ProgramsSection);
