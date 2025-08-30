'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContentRefresh } from '@/hooks/useContentRefresh';
import { programs, toggleablePrograms } from '@/data/site-data';

export default function ProgramsSection() {
  
  // Use the universal content refresh hook for programs toggle
  const [toggleSetting, loading] = useContentRefresh<string>('programsToggle');
  
  
  // Select the second program based on toggle setting
  const currentToggle = toggleSetting || 'highHolyDays';
  const secondProgram = currentToggle === 'passover' ? toggleablePrograms.passover : toggleablePrograms.highHolyDays;
  
  // Create the programs array with the toggle selection
  const displayPrograms = [programs[0], secondProgram];

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Programs
            </h2>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" role="status" aria-label="loading"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programs
          </h2>
        </div>

        {/* Programs Grid - Limited to 2 programs in a centered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {displayPrograms.map((program) => (
            <div key={program.id} className="group">
              <Link
                href={program.linkUrl}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={program.imageUrl}
                    alt={program.title}
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
