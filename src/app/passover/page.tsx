import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';
import HoverButton from '@/app/components/ui/HoverButton';
import PassoverCart from '@/app/components/PassoverCart';

export default async function PassoverPage() {
  // Fetch content server-side with fallbacks
  const content = await getMultipleContentByKeys([
    'passoverIntro',
    'passoverDetails',
    'passoverReservation'
  ]);
  
  // Set fallbacks for any missing content
  const contentWithFallbacks = {
    passoverIntro: content.passoverIntro || `<h2>Chag Pesach Sameach</h2>
<p>Passover (Pesach) is one of the most significant holidays in the Jewish calendar, commemorating the liberation of the Israelites from slavery in Egypt. At Beth Shalom Fairfield, we celebrate this festival of freedom with community Seders and meaningful observances.</p>`,
    passoverDetails: content.passoverDetails || `<h3>Community Seder</h3>
<p>Join us for our annual community Seder, where we gather to retell the Passover story, enjoy traditional foods, and celebrate together as one family. Our Seder welcomes people of all backgrounds and levels of Jewish knowledge.</p>`,
    passoverReservation: content.passoverReservation || `<h3>Reservations Required</h3>
<p>Please make your reservation in advance to ensure we have adequate seating and food for everyone.</p>`
  };

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

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.passoverIntro as string) }}
          />
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.passoverDetails as string) }}
          />
        </div>

        {/* PayPal Cart Integration */}
        <PassoverCart />

        {/* Reservation Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.passoverReservation as string) }}
          />
        </div>

        {/* Links */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <div className="flex flex-col sm:flex-row gap-4">
              <HoverButton href="/about" variant="primary">
                About Our Community
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </HoverButton>
              
              <HoverButton href="/contact" variant="secondary">
                Contact Us
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </HoverButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}