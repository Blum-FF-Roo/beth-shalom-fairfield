import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';
import HoverButton from '@/app/components/ui/HoverButton';
import PassoverCart from '@/app/components/PassoverCart';

export const revalidate = 60;

export default async function PassoverPage() {
  // Fetch content server-side with fallbacks
  const content = await getMultipleContentByKeys([
    'passoverIntro',
    'passoverDetails',
    'passoverReservation',
    'join_us',
    'passoverCartHeading',
    'passoverCartSubheading'
  ]);
  
  // Fall back to default text only when a section has never been set in
  // Firestore (null). An admin can also deliberately clear a section to an
  // empty string to remove it from the page entirely -- that must not be
  // treated the same as "missing" or their edit would silently revert to
  // the old default text.
  const passoverIntro = content.passoverIntro === null
    ? `<h2>Chag Pesach Sameach</h2>
<p>Passover (Pesach) is one of the most significant holidays in the Jewish calendar, commemorating the liberation of the Israelites from slavery in Egypt. At Beth Shalom Fairfield, we celebrate this festival of freedom with community Seders and meaningful observances.</p>`
    : (content.passoverIntro as string);

  const passoverDetails = content.passoverDetails === null
    ? `<h3>Community Seder</h3>
<p>Join us for our annual community Seder, where we gather to retell the Passover story, enjoy traditional foods, and celebrate together as one family. Our Seder welcomes people of all backgrounds and levels of Jewish knowledge.</p>`
    : (content.passoverDetails as string);

  const passoverReservation = content.passoverReservation === null
    ? `<h3>Reservations Required</h3>
<p>Please make your reservation in advance to ensure we have adequate seating and food for everyone.</p>`
    : (content.passoverReservation as string);

  const joinUsContent = typeof content.join_us === 'string' ? content.join_us : null;

  // undefined (not null) when the key was never set, so PassoverCart's own
  // default prop text is used; an empty string is passed through as-is so
  // a deliberate clear correctly hides that line instead of reverting.
  const passoverCartHeading = content.passoverCartHeading === null ? undefined : (content.passoverCartHeading as string);
  const passoverCartSubheading = content.passoverCartSubheading === null ? undefined : (content.passoverCartSubheading as string);

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
        {passoverIntro && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(passoverIntro) }}
            />
          </div>
        )}

        {/* Event Details */}
        {passoverDetails && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(passoverDetails) }}
            />
          </div>
        )}

        {/* PayPal Cart Integration */}
        <PassoverCart heading={passoverCartHeading} subheading={passoverCartSubheading} />

        {/* Reservation Information */}
        {passoverReservation && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(passoverReservation) }}
            />
          </div>
        )}

        {/* Join Us */}
        {joinUsContent && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(joinUsContent) }}
            />
          </div>
        )}

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