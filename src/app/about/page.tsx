
import { getMultipleContentByKeys } from '@/app/utils/firebase-operations';
import { formatContentAsHtml } from '@/app/utils';

export default async function AboutPage() {
  // Fetch content server-side with fallbacks
  const content = await getMultipleContentByKeys([
    'aboutAdministration',
    'aboutBoardMembers', 
    'aboutCommittees',
    'aboutResources',
    'aboutCommunityMessage'
  ]);
  
  // Set fallbacks for any missing content
  const contentWithFallbacks = {
    aboutAdministration: content.aboutAdministration || `<h2>ADMINISTRATION</h2>
<div class="grid md:grid-cols-2 gap-4">
<p><strong>President:</strong> Marc Berkowitz</p>
<p><strong>Administrator:</strong> Susan Berkowitz</p>
<p><strong>Vice President:</strong> Dean Draznin</p>
<p><strong>Vice President:</strong> Sol Waksman</p>
<p><strong>Secretary:</strong> Lisa Cohen</p>
<p><strong>Treasurer:</strong> Fred Swartz</p>
</div>`,
    aboutBoardMembers: content.aboutBoardMembers || [
      'Marc Berkowitz',
      'Dean Draznin', 
      'Sol Waksman',
      'Lisa Cohen',
      'Fred Swartz',
      'Danella Lubar',
      'Steve Sufian',
      'Brian Teitzman',
      'Scott Terry'
    ],
    aboutCommittees: content.aboutCommittees || `<p><strong>Building:</strong> Sol Waksman, Bill Pollak</p>
<p><strong>High Holiday:</strong> Lewis Denbaum – Aliyot and Honors</p>
<p><strong>Torah Service:</strong> Lewis Denbaum and Marc Berkowitz</p>
<p><strong>Newsletter:</strong> Marc Berkowitz, Editor-In-Chief</p>
<p><strong>Religious Committee:</strong> David Matt, Bob Rabinoff</p>
<p><strong>Set-up:</strong> Lisa and David Cohen (and family)</p>
<p><strong>Volunteers:</strong> Brian Teitzman</p>`,
    aboutResources: content.aboutResources || `<p><strong>Beth Shalom Newsletter:</strong> To receive the weekly Beth Shalom Newsletter or to update your newsletter email address contact us at bethshalomfairfield@gmail.com</p>
<p><strong>The Hebrew Wink (Ben Winkler e-newsletter):</strong> reports news, on-going issues and editorials affecting our Jewish community locally, as well as regionally, nationally, internationally and from Israel. To request free subscription, contact Ben Winkler at HBWink@gmail.com</p>
<p><strong>Minyan Club:</strong> contact Dean Draznin at dean@drazninpr.com</p>
<p><strong>Yahrzeit plaque:</strong> to honor the departed, contact Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com</p>
<p><strong>Yahrzeit candles:</strong> are available at the synagogue for a small donation.</p>
<p><strong>Information:</strong> Contact Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com</p>`,
    aboutCommunityMessage: content.aboutCommunityMessage || `<p>On these special occasions, where we come together as a Jewish community, we particularly appreciate being able to have our own Synagogue, a place to pray to together, to celebrate together, and to affirm our faith. Even though we know that God is everywhere, when we come together to pray just as our ancestors have done for thousands of years, we are enlivening Abraham's covenant with God, for all Jews for all time, and enlivening our own relationship with God.</p>

<p>Having our own Synagogue makes a statement that we honor and support our tradition and will preserve it for generations to come. It dignifies our experience of our rituals in a place of holiness maintained through prayer and the Ark containing the Torahs. It also provides a place for our library, our Sunday School, adult education classes, weddings, funerals, bar and bat mitzvah's, and holiday celebrations.</p>

<p>This synagogue is maintained by volunteers who contribute their time and energy because they recognize the benefit of having our own house of worship and preserving our Jewish heritage. Our Synagogue is an important part of our Jewish community. The Board of Directors of the Synagogue encourages each of you to become a member of Congregation Beth Shalom. Even if you pay the membership dues in installments over the year, becoming a member supports our community. We are always asked by visitors, "How many members do you have?" because they know this is one measure of the strength of our group consciousness. This is one important way that you can help us continue to maintain the Synagogue, to continue our traditions which connect us to our forefathers, and help support our rare and precious Jewish community.</p>

<p>Thank you to those of you who have already become members this year, and we invite everyone else to please join us in preserving what we enjoy here on all of these special occasions.</p>`
  };
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            Congregation Beth Shalom
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            House of Peace
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center space-y-2">
            <p className="text-lg">Located at: 308 South "B" Street, Fairfield, Iowa 52556</p>
            <p className="text-lg">Mailing address: 200 W. Washington Street, Fairfield, Iowa 52556</p>
          </div>
        </div>

        {/* Administration */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.aboutAdministration as string) }}
          />
        </div>

        {/* Board Members */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">BOARD MEMBERS</h2>
          <div className="grid md:grid-cols-3 gap-4 text-gray-700">
            {(contentWithFallbacks.aboutBoardMembers as string[]).map((member: string, index: number) => (
              <p key={index}>{member}</p>
            ))}
          </div>
        </div>

        {/* Committees */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">COMMITTEES</h2>
          <div 
            className="space-y-3 text-gray-700"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.aboutCommittees as string) }}
          />
        </div>

        {/* Resources */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Beth Shalom Resources</h2>
          <div 
            className="space-y-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.aboutResources as string) }}
          />
        </div>

        {/* Community Message */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Community</h2>
          <p className="text-sm text-gray-600 mb-4">By Fred Swartz</p>
          <div 
            className="text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: formatContentAsHtml(contentWithFallbacks.aboutCommunityMessage as string) }}
          />
        </div>
      </div>
    </div>
  );
}