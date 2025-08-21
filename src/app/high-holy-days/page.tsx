import { getContentByKey } from '@/lib/content-server';
import HoverButton from '@/components/ui/HoverButton';

export default async function HighHolyDaysPage() {
  // Fetch content server-side with fallback
  const highHolyDaysContent = await getContentByKey('highHolyDaysPageContent') as string ||
    `<h2>Rosh Hashanah & Yom Kippur</h2>
<p>The High Holy Days, also known as the Days of Awe, are the holiest time of the Jewish year. At Beth Shalom Fairfield, we observe these sacred days with meaningful services, reflection, and community celebration.</p>

<h3>Rosh Hashanah - The Jewish New Year</h3>
<p>Rosh Hashanah marks the beginning of the Jewish year and is a time for reflection, repentance, and renewal. We gather to hear the sound of the shofar and celebrate the start of a new year with hope and intention.</p>

<h3>Yom Kippur - The Day of Atonement</h3>
<p>Yom Kippur is the holiest day of the Jewish year, a day of fasting, prayer, and atonement. We come together to seek forgiveness and make amends as we prepare for the year ahead.</p>

<h3>Service Information</h3>
<p>All are welcome to join us for High Holy Day services. Please contact us for specific service times and any special arrangements.</p>`;
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
                <HoverButton href="/high-holy-days-sermons" variant="primary">
                  View Sermons
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
    </div>
  );
}