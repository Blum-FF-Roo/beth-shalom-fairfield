'use client';

import Link from 'next/link';
import LazyImage from '@/components/ui/LazyImage';
import { programs } from '@/data/site-data';

export default function ProgramsSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programs
          </h2>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className={`group ${index >= 3 ? 'lg:mt-8' : ''}`}
            >
              <Link
                href={program.linkUrl}
                target={program.linkTarget || '_self'}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <LazyImage 
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover z-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-center">
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