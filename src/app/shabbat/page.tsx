import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';
import HoverButton from '@/app/components/ui/HoverButton';

export default async function ShabbatPage() {
  // Fetch content server-side with fallbacks
  const content = await getMultipleContentByKeys([
    'shabbatIntro',
    'shabbatServices', 
    'shabbatTimes'
  ]);
  
  // Set fallbacks for any missing content
  const contentWithFallbacks = {
    shabbatIntro: content.shabbatIntro || `<h2>Welcome to Shabbat</h2>
<p>Shabbat is the cornerstone of Jewish life, a weekly celebration that begins at sundown on Friday and continues until nightfall on Saturday. At Beth Shalom Fairfield, we welcome you to join us for this sacred time of rest, reflection, and community.</p>`,
    shabbatServices: content.shabbatServices || `<h3>Friday Evening Services</h3>
<p>Our Friday evening services welcome the Shabbat with prayers, songs, and the lighting of Shabbat candles. This intimate service creates a peaceful transition from the week's activities to the sanctity of Shabbat.</p>

<h3>Saturday Morning Services</h3>
<p>Saturday morning services include Torah reading, prayers, and often feature special celebrations such as Bar/Bat Mitzvahs, baby namings, and other lifecycle events. All are welcome to participate in this meaningful worship experience.</p>`,
    shabbatTimes: content.shabbatTimes || `<h3>Service Times & Information</h3>
<p>Service times may vary throughout the year. Please contact us for current schedule information and any special Shabbat programs or events.</p>`
  };
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

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.shabbatIntro as string) }}
          />
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.shabbatServices as string) }}
          />
        </div>

        {/* Times */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.shabbatTimes as string) }} />

            {/* Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
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
    </div>
  );
}