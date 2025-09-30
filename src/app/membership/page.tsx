'use client';

import MembershipCart from '@/app/components/MembershipCart';

export default function MembershipPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            Become a Member
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Become a member of Congregation Beth Shalom and support the Synagogue with your dues.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>One way to contribute to Congregation Beth Shalom is to pay dues and become a member. As a member you are entitled to High Holiday tickets, the catered Break-fast, and discounts on many other activities throughout the year.</p>
            
            <p>By becoming a member you are basically saying "I want the synagogue to be here for those who wish to participate and for me if I ever need it for any reason." And YES dues can be paid in installments.</p>
          </div>
        </div>

        {/* Membership Cart */}
        <MembershipCart />

        {/* Membership Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Information</h2>
          <p className="text-gray-700 mb-4">E-MAIL OR MAIL YOUR MEMBERSHIP INFORMATION TO:</p>
          <div className="text-gray-700 space-y-2 mb-6">
            <p><strong>Address:</strong> Congregation Beth Shalom, c/o 200 W. Washington, Fairfield, Iowa 52556.</p>
            <p><strong>E-Mail:</strong> bethshalomfairfield@gmail.com</p>
          </div>

          <div className="space-y-2 text-gray-700">
            <p>MEMBERSHIP CATEGORY:</p>
            <p>NAME OF MEMBER(s):</p>
            <p>AMOUNT PAID:</p>
            <p>YOUR MAILING ADDRESS:</p>
            <p>YOUR E-MAIL ADDRESS:</p>
          </div>
        </div>


        {/* Community Message */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Community</h2>
          <p className="text-sm text-gray-600 mb-4">By Fred Swartz</p>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>On these special occasions, where we come together as a Jewish community, we particularly appreciate being able to have our own Synagogue, a place to pray to together, to celebrate together, and to affirm our faith. Even though we know that God is everywhere, when we come together to pray just as our ancestors have done for thousands of years, we are enlivening Abraham's covenant with God, for all Jews for all time, and enlivening our own relationship with God.</p>
            
            <p>Having our own Synagogue makes a statement that we honor and support our tradition and will preserve it for generations to come. It dignifies our experience of our rituals in a place of holiness maintained through prayer and the Ark containing the Torahs. It also provides a place for our library, our Sunday School, adult education classes, weddings, funerals, bar and bat mitzvah's, and holiday celebrations.</p>
            
            <p>This synagogue is maintained by volunteers who contribute their time and energy because they recognize the benefit of having our own house of worship and preserving our Jewish heritage. Our Synagogue is an important part of our Jewish community. The Board of Directors of the Synagogue encourages each of you to become a member of Congregation Beth Shalom. Even if you pay the membership dues in installments over the year, becoming a member supports our community. We are always asked by visitors, "How many members do you have?" because they know this is one measure of the strength of our group consciousness. This is one important way that you can help us continue to maintain the Synagogue, to continue our traditions which connect us to our forefathers, and help support our rare and precious Jewish community.</p>
            
            <p>Thank you to those of you who have already become members this year, and we invite everyone else to please join us in preserving what we enjoy here on all of these special occasions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
