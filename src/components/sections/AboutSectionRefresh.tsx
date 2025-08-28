'use client';

import Link from 'next/link';
import { useContentRefresh } from '@/hooks/useContentRefresh';

export default function AboutSectionRefresh() {
  // Use the universal content refresh hook for about text
  const [dynamicAboutText, loading] = useContentRefresh<string>('aboutText');
  
  // Use database content only
  const content = dynamicAboutText;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About
            </h2>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : content ? (
              <div className="text-gray-700 leading-relaxed space-y-4">
                {content.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No content available</p>
              </div>
            )}
            
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
