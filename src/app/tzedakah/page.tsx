'use client';

import PayPalDonation from '@/app/components/PayPalDonation';

export default function TzedakahPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            TZEDAKAH/DONATIONS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Temple Beth Shalom values your contribution to any of its funds
          </p>
        </div>

        {/* Tzedakah Fund Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tzedakah Fund</h2>
          <p className="text-gray-700 italic mb-4">"Whosoever practices Tzedakah finds life, prosperity, and honor." Talmud</p>
          <p className="text-gray-700 mb-4">Tzedakah is a central mitzvah of Judaism that uplifts both giver and recipient.</p>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your gift of Tzedakah:</h3>
          <ul className="text-gray-700 space-y-2 list-disc pl-6 mb-6">
            <li>Helps support the wonderful programs here at our synagogue and ensure the vitality of our congregation.</li>
            <li>Focuses support on specific activities and causes favored by congregants.</li>
            <li>Provides a convenient and meaningful way to fulfill the traditional obligation of Tzedakah, and to honor, commemorate or express gratitude.</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Occasions for Tzedakah:</h3>
          <p className="text-gray-700">Holidays and festivals, births, namings, first school days, Bar/Bat Mitzvahs, graduations, weddings, funerals, yahrtzeits, wedding anniversaries (one's own or friends'), birthdays, housewarmings, congratulations on job promotions, achievements, good wishes on undertaking new ventures, get well wishes, and so on.</p>
        </div>

        {/* PayPal Donation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Donate Now</h2>
            <p className="text-gray-600">Support our congregation with a secure online donation through PayPal</p>
          </div>
          <PayPalDonation defaultAmount="18" />
        </div>

        {/* Donation Funds */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Funds</h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>General Fund:</strong> for all the multifaceted activities of our congregation. Undesignated donations go into this fund.</p>
            <p><strong>Yahrzeit Contributions:</strong> in the tradition of memory, marks the anniversary of the death of loved ones of blessed memory, allowing them to live on through our charitable acts.</p>
            <p><strong>Tzedakah/Tikkun Olam Fund:</strong> to help provide funds to Jewish community members in need.</p>
            <p><strong>Building Fund:</strong> to help with maintenance and renovation projects.</p>
            <p><strong>Library Fund:</strong> helps purchase new library books and prayer books when needed.</p>
          </div>
        </div>

        {/* Honor a Third Party */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Honor a Third Party</h2>
          <p className="text-gray-700 mb-4">Tzedakah honors giver and recipient; you can use it to honor or thank someone important to you. When you do this, we send a card to whomever you designate, indicating that you've made a contribution. A minimum gift of chai ($18 or a multiple of it) is suggested when you request a Tzedakah card sent to someone in your name.</p>
          <p className="text-gray-700">Your contribution will be listed in the synagogue's weekly bulletin with your Name(s) but not with the donation amount. If you do not want to be listed YOU must let us know.</p>
        </div>

        {/* Alternative Donation Method */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mail Your Donation</h2>
          <p className="text-gray-700 mb-4">or please send your donation to:</p>
          <div className="text-gray-700 space-y-1 mb-6">
            <p><strong>Congregation Beth Shalom</strong></p>
            <p>Location: 308 South B Street</p>
            <p>Mailing address: c/o 200 West Washington</p>
            <p>Fairfield, Iowa 52556</p>
          </div>
          
          <p className="text-gray-700 mb-4">To insure that recipient(s) are notified of your donation and it is properly listed in the newsletter, and are used for the fund of your choice, please email the following information to bethshalomsynagogue@gmail.com.</p>
          
          <div className="space-y-2 text-gray-700">
            <p>Your Name</p>
            <p>Donation Amount</p>
            <p>In honor of</p>
            <p>Honoree's email address or mailing address</p>
            <p>Specific fund (Un-designated donations go into General Fund)</p>
            <p>List donation in newsletter? Yes or No</p>
          </div>
          
          <p className="text-gray-700 mt-4 font-semibold">Thank you.</p>
        </div>

        {/* Biblical Quote */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-700 italic">
            "In Tzedakah's way is Life; on its path is immortality." — Proverbs 12:28
          </p>
        </div>
      </div>
    </div>
  );
}
