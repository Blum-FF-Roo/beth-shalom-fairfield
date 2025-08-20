'use client';

import Link from 'next/link';

export default function ShabbatPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#F58C28'}}>
            Shabbat Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for weekly Shabbat celebration and worship
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#F58C28'}}>Welcome to Shabbat</h2>
            
            <p className="mb-6">
              Shabbat is the cornerstone of Jewish life, a weekly celebration that begins at sundown on Friday 
              and continues until nightfall on Saturday. At Beth Shalom Fairfield, we welcome you to join us 
              for this sacred time of rest, reflection, and community.
            </p>

            <h3 className="text-xl font-semibold mb-3">Friday Evening Services</h3>
            <p className="mb-4">
              Our Friday evening services welcome the Shabbat with prayers, songs, and the lighting of 
              Shabbat candles. This intimate service creates a peaceful transition from the week's activities 
              to the sanctity of Shabbat.
            </p>

            <h3 className="text-xl font-semibold mb-3">Saturday Morning Services</h3>
            <p className="mb-6">
              Saturday morning services include Torah reading, prayers, and often feature special celebrations 
              such as Bar/Bat Mitzvahs, baby namings, and other lifecycle events. All are welcome to participate 
              in this meaningful worship experience.
            </p>

            <h3 className="text-xl font-semibold mb-3">Service Times & Information</h3>
            <p className="mb-4">
              Service times may vary throughout the year. Please contact us for current schedule information 
              and any special Shabbat programs or events.
            </p>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    <strong>All are welcome!</strong> Whether you're new to Jewish practice or a regular participant, 
                    we invite you to experience the joy and peace of Shabbat with our community.
                  </p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors duration-200"
                  style={{ backgroundColor: '#F58C28' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
                >
                  About Our Community
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