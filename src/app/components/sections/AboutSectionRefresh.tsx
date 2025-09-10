'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils/content-formatter';

function AboutSectionRefresh() {
  // Use TanStack Query to get about text directly
  const { data: section, isLoading: loading } = useQuery({
    queryKey: ['content', 'aboutText'],
    queryFn: () => getContentSectionByKey('aboutText'),
  });

  const aboutText = (section?.content as string) || '';

  return (
    <section className="py-12 bg-white" role="region" aria-labelledby="about-heading">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About
            </h2>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {loading ? (
              <div 
                className="flex items-center justify-center py-8"
                role="status"
                aria-label="Loading about section"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : aboutText ? (
              <div
                className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContentAsHtml(aboutText) }}
              />
            ) : (
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p className="mb-4">
                  Welcome to Beth Shalom Fairfield, a warm and welcoming Conservative Jewish community located in the heart of Fairfield, Iowa. Our congregation has been serving the spiritual, educational, and social needs of Jewish families in southeastern Iowa for many years.
                </p>
                <p className="mb-4">
                  We offer traditional Conservative services, educational programs for all ages, and numerous opportunities for community involvement and social action. Whether you're looking for a spiritual home, educational opportunities, or simply want to connect with the Jewish community, we invite you to join us.
                </p>
                <p className="text-sm text-gray-600 italic">
                  (This content can be customized through the admin panel)
                </p>
              </div>
            )}
            
            {/* Read More Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/about"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Learn more about Beth Shalom Fairfield"
              >
                Learn More
                <svg 
                  className="ml-2 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

export default memo(AboutSectionRefresh);
