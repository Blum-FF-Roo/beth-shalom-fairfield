'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';

function ProgramsSection() {
  // Static programs data (like main branch)
  const programs = [
    {
      id: "1",
      title: "Shabbat Services",
      imageUrl: "/images/pexels-cottonbro-5986499.jpg",
      linkUrl: "/shabbat"
    }
  ];

  // Default program options for the toggleable second program (like main branch)
  const toggleablePrograms = {
    highHolyDays: {
      id: "2-hh",
      title: "High Holy Days",
      imageUrl: "/images/gettyimages-1869577249-612x612.jpg",
      linkUrl: "/high-holy-days"
    },
    passover: {
      id: "2-passover", 
      title: "Passover",
      imageUrl: "/images/pexels-cottonbro-5974866.jpg",
      linkUrl: "/passover"
    }
  };

  // Use TanStack Query to get the programs toggle setting directly
  const { data: toggleSection, isLoading: loading } = useQuery({
    queryKey: ['content', 'programsToggle'],
    queryFn: () => getContentSectionByKey('programsToggle'),
  });

  // Select the second program based on toggle setting (like main branch)
  const currentToggle = (toggleSection?.content as string) || 'highHolyDays';
  const secondProgram = currentToggle === 'passover' ? toggleablePrograms.passover : toggleablePrograms.highHolyDays;
  
  // Create the programs array with the toggle selection (like main branch)
  const displayPrograms = [programs[0], secondProgram];

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

  return (
    <section className="py-12 bg-gray-50" role="region" aria-labelledby="programs-heading">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programs
          </h2>
        </div>

        {/* Programs Grid - Limited to 2 programs in a centered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
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
