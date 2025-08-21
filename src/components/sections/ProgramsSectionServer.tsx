import Link from 'next/link';
import Image from 'next/image';
import { getContentByKey } from '@/lib/content-server';
import { programs, toggleablePrograms } from '@/data/site-data';

export default async function ProgramsSectionServer() {
  // Fetch toggle setting server-side with fallback
  const toggleSetting = await getContentByKey('programsToggle') as string || 'highHolyDays';
  
  // Select the second program based on toggle setting
  const secondProgram = toggleSetting === 'passover' ? toggleablePrograms.passover : toggleablePrograms.highHolyDays;
  
  // Create the programs array with the toggle selection
  const displayPrograms = [programs[0], secondProgram];

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
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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