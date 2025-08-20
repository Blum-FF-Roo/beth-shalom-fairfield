'use client';

import Link from 'next/link';

export default function PassoverPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#F58C28'}}>
            Passover
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating freedom and the Exodus from Egypt
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#F58C28'}}>Chag Pesach Sameach</h2>
            
            <p className="mb-6">
              Passover (Pesach) is one of the most significant holidays in the Jewish calendar, commemorating 
              the liberation of the Israelites from slavery in Egypt. At Beth Shalom Fairfield, we celebrate 
              this festival of freedom with community Seders and meaningful observances.
            </p>

            <h3 className="text-xl font-semibold mb-3">The Passover Story</h3>
            <p className="mb-4">
              The story of Passover tells of Moses leading the Hebrew people out of bondage in Egypt, 
              guided by God through miraculous signs and wonders. This narrative of liberation continues 
              to inspire people around the world in their own struggles for freedom and justice.
            </p>

            <h3 className="text-xl font-semibold mb-3">Community Seder</h3>
            <p className="mb-6">
              Join us for our annual community Seder, where we gather to retell the Passover story, 
              enjoy traditional foods, and celebrate together as one family. Our Seder welcomes people 
              of all backgrounds and levels of Jewish knowledge.
            </p>

            <h3 className="text-xl font-semibold mb-3">Passover Observance</h3>
            <p className="mb-4">
              During the eight days of Passover, we remember our ancestors' journey from slavery to 
              freedom by avoiding chametz (leavened products) and eating matzah (unleavened bread), 
              among other traditions that connect us to this pivotal moment in Jewish history.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Join Us!</strong> Our Passover celebrations are open to all. Contact us for 
                    information about Seder reservations and other Passover events.
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