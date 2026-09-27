import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';
import HoverButton from '@/app/components/ui/HoverButton';
import AddToCartButton from '@/app/components/AddToCartButton';

const highHolyDaysTickets = [
  { id: 'both-holidays', name: 'Rosh Hashanah and Yom Kippur', price: 80, category: 'ticket' },
  { id: 'rosh-hashanah', name: 'Rosh Hashanah', price: 40, category: 'ticket' },
  { id: 'yom-kippur', name: 'Yom Kippur', price: 50, category: 'ticket' },
  { id: 'college-both', name: 'College / IA — Rosh Hashanah and Yom Kippur', price: 50, category: 'ticket' },
  { id: 'college-rosh', name: 'College / IA — Rosh Hashanah', price: 25, category: 'ticket' },
  { id: 'college-yom', name: 'College / IA — Yom Kippur', price: 35, category: 'ticket' },
  { id: 'break-fast', name: 'Yom Kippur break-fast meal', price: 15, category: 'ticket' },
];

export const revalidate = 60;

export default async function HighHolyDaysPage() {
  // Fetch content server-side with fallbacks - only dynamic sections
  const content = await getMultipleContentByKeys([
    'highHolyDaysCalendar',
    'highHolyDaysInfo'
  ]);
  
  // Fall back to default text only when a section has never been set in
  // Firestore (null). An empty string means an admin deliberately cleared
  // it, which must hide the section, not silently revert to the old text.
  const highHolyDaysCalendar = content.highHolyDaysCalendar === null
    ? `<h2>Rosh Hashanah & Yom Kippur</h2>
<p>The High Holy Days, also known as the Days of Awe, are the holiest time of the Jewish year. At Beth Shalom Fairfield, we observe these sacred days with meaningful services, reflection, and community celebration.</p>`
    : (content.highHolyDaysCalendar as string);

  const highHolyDaysInfo = content.highHolyDaysInfo === null
    ? `<h3>Service Information</h3>
<p>All are welcome to join us for High Holy Day services. Please contact us for specific service times and any special arrangements.</p>`
    : (content.highHolyDaysInfo as string);

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

        {/* Calendar */}
        {highHolyDaysCalendar && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(highHolyDaysCalendar) }}
            />
          </div>
        )}

        {/* Service Information */}
        {highHolyDaysInfo && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContentAsHtml(highHolyDaysInfo) }}
            />
          </div>
        )}

        {/* Membership Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-700 mb-6">
            High Holiday seating is a benefit of membership. Non-members and visiting students are warmly welcome to join us with a ticket. Choose a ticket only, or add the catered Break-fast that follows Yom Kippur.
          </p>
          <HoverButton href="/membership" variant="primary">
            Renew or Become a member
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </HoverButton>
        </div>

        {/* Tickets for Non-Members */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8 pb-6">
            <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: '#F58C28' }}>
              Tickets for Non-Members
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-4">Reserve your seats.</h2>
            <p className="text-gray-700">
              High Holiday seating is a benefit of membership. Non-members and visiting students are warmly welcome to join us with a ticket. Choose a ticket only, or add the catered Break-fast that follows Yom Kippur.
            </p>
          </div>

          <div className="hidden sm:flex px-8 py-3 text-xs font-semibold uppercase tracking-wide text-white" style={{ backgroundColor: '#F58C28' }}>
            <span className="flex-1">Ticket Category</span>
            <span>Price</span>
          </div>

          <div className="divide-y divide-gray-100">
            {highHolyDaysTickets.map((ticket) => (
              <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-8 py-4">
                <span className="text-gray-900 font-medium">{ticket.name}</span>
                <div className="flex items-center gap-4 bg-gray-50 rounded-full pl-4 pr-2 py-2 self-start sm:self-auto">
                  <span className="font-semibold text-gray-900">${ticket.price.toFixed(2)}</span>
                  <AddToCartButton product={ticket} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 py-6 bg-gray-50 text-sm text-gray-600">
            Please include the name(s) of each ticket holder when you check out or contact us. Prefer to pay by mail? Send ticket category, name(s) of ticket holders, amount, and your mailing and email address to Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556, or email{' '}
            <a href="mailto:bethshalomfairfield@gmail.com" className="text-orange-600 hover:text-orange-700 font-medium">
              bethshalomfairfield@gmail.com
            </a>.
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
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
  );
}