import Link from 'next/link';
import { getContentByKey } from '@/lib/content-server';
import { aboutText } from '@/data/site-data';

export default async function AboutSectionServer() {
  // Fetch content server-side with fallback
  const dynamicAboutText = await getContentByKey('aboutText') as string || aboutText;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              About
            </h2>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {dynamicAboutText.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
            
            {/* Read More Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/about"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Learn More
                <svg 
                  className="ml-2 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}