import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';
import HoverButton from '@/app/components/ui/HoverButton';
import HighHolyDaysCartSimple from '@/app/components/HighHolyDaysCartSimple';
import AddToCartButton from '@/app/components/AddToCartButton';

export default async function HighHolyDaysPage() {
  // Fetch content server-side with fallbacks - only dynamic sections
  const content = await getMultipleContentByKeys([
    'highHolyDaysCalendar',
    'highHolyDaysInfo'
  ]);
  
  // Set fallbacks for any missing content
  const contentWithFallbacks = {
    highHolyDaysCalendar: content.highHolyDaysCalendar || `<h2>Rosh Hashanah & Yom Kippur</h2>
<p>The High Holy Days, also known as the Days of Awe, are the holiest time of the Jewish year. At Beth Shalom Fairfield, we observe these sacred days with meaningful services, reflection, and community celebration.</p>`,
    highHolyDaysInfo: content.highHolyDaysInfo || `<h3>Service Information</h3>
<p>All are welcome to join us for High Holy Day services. Please contact us for specific service times and any special arrangements.</p>`
  };

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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.highHolyDaysCalendar as string) }}
          />
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.highHolyDaysInfo as string) }}
          />
        </div>

        {/* Static Membership Section with Embedded PayPal */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">RENEW or BECOME A MEMBER</h2>
          <p className="text-gray-700 mb-4"><strong>E-MAIL or MAIL YOUR MEMBERSHIP INFORMATION TO:</strong></p>
          
          <p className="text-gray-700 mb-6">
            <strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.<br/>
            <strong>E-Mail:</strong> <a href="mailto:bethshalomfairfield@gmail.com" className="text-orange-600 hover:text-orange-700">bethshalomfairfield@gmail.com</a>
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 space-y-1">
              <strong>MEMBERSHIP CATEGORY:</strong><br/>
              <strong>NAME OF MEMBER(s):</strong><br/>
              <strong>AMOUNT PAID:</strong><br/>
              <strong>YOUR MAILING ADDRESS:</strong><br/>
              <strong>YOUR E-MAIL ADDRESS:</strong>
            </p>
          </div>

          <p className="text-gray-700 mb-6 font-semibold">INCLUDE PAYMENT or USE PAYPAL BELOW</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Membership Category</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Sustaining Membership</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$1000</td>
                  <td className="p-3"><AddToCartButton productId="sustaining" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Sponsoring Membership</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$500</td>
                  <td className="p-3"><AddToCartButton productId="sponsoring" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Family Membership</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$295</td>
                  <td className="p-3"><AddToCartButton productId="family" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Single Membership</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$165</td>
                  <td className="p-3"><AddToCartButton productId="single" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">College Faculty, Staff Family</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$145</td>
                  <td className="p-3"><AddToCartButton productId="faculty-family" /></td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-gray-300">College Faculty, Staff Single</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$95</td>
                  <td className="p-3"><AddToCartButton productId="faculty-single" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Static Tickets Section with Embedded PayPal */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">TICKETS for NON-MEMBERS</h2>
          <p className="text-gray-700 mb-4"><strong>E-MAIL or MAIL YOUR HIGH HOLY DAY TICKET INFORMATION TO:</strong></p>
          
          <p className="text-gray-700 mb-6">
            <strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.<br/>
            <strong>E-Mail:</strong> <a href="mailto:bethshalomfairfield@gmail.com" className="text-orange-600 hover:text-orange-700">bethshalomfairfield@gmail.com</a>
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 space-y-1">
              <strong>TICKET CATEGORY:</strong><br/>
              <strong>NAME(S) of Ticket Holders:</strong><br/>
              <strong>AMOUNT PAID:</strong><br/>
              <strong>YOUR MAILING ADDRESS:</strong><br/>
              <strong>YOUR E-MAIL ADDRESS:</strong>
            </p>
          </div>

          <p className="text-gray-700 mb-6 font-semibold">INCLUDE PAYMENT or USE PAYPAL BELOW</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ticket Category</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Rosh Hashanah and Yom Kippur</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$72</td>
                  <td className="p-3"><AddToCartButton productId="both-holidays" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Rosh Hashanah</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$36</td>
                  <td className="p-3"><AddToCartButton productId="rosh-hashanah" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">Yom Kippur</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$42</td>
                  <td className="p-3"><AddToCartButton productId="yom-kippur" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">College/IA-Rosh Hashanah and Yom Kippur</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$42</td>
                  <td className="p-3"><AddToCartButton productId="college-both" /></td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300">College/IA-Rosh Hashanah</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$19</td>
                  <td className="p-3"><AddToCartButton productId="college-rosh" /></td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-gray-300">College/IA-Yom Kippur</td>
                  <td className="p-3 border-r border-gray-300 font-bold">$25</td>
                  <td className="p-3"><AddToCartButton productId="college-yom" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PayPal Cart Integration */}
        <HighHolyDaysCartSimple />

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