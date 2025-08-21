'use client';

import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function HighHolyDaysPage() {
  const { content: highHolyDaysContent, loading } = useContent('highHolyDaysPageContent', '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#F58C28'}}></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#F58C28'}}>
            High Holy Days
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for the most sacred days in the Jewish calendar
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: highHolyDaysContent as string }} />

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/high-holy-days-sermons"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors duration-200"
                  style={{ backgroundColor: '#F58C28' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
                >
                  View Sermons
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 text-base font-medium rounded-md transition-colors duration-200"
                  style={{ 
                    borderColor: '#F58C28', 
                    color: '#F58C28' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F58C28';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#F58C28';
                  }}
                >
                  Contact Us
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}