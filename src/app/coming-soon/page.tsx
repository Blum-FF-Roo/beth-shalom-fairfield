'use client';

import Link from 'next/link';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6" style={{backgroundColor: '#F58C28'}}>
            <span className="text-white font-bold text-3xl">BS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-gray-600 mb-8">
            We're working hard to bring you this page. Check back soon for updates from Beth Shalom Fairfield.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            style={{backgroundColor: '#F58C28'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
          >
            Return Home
          </Link>
          
          <div className="pt-4">
            <Link 
              href="/contact" 
              className="text-gray-600 hover:underline"
            >
              Have questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}