'use client';

import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Check } from 'lucide-react';

const membershipTiers = [
  {
    id: 'individual',
    name: 'Individual Membership',
    price: 100,
    description: 'Perfect for individuals looking to join our community',
    features: [
      'Access to all services and events',
      'High Holy Day seating',
      'Weekly newsletter',
      'Community directory access'
    ]
  },
  {
    id: 'family',
    name: 'Family Membership',
    price: 180,
    description: 'Ideal for families wanting to be part of our community',
    features: [
      'Access for entire family',
      'Priority High Holy Day seating',
      'Educational programs for children',
      'Weekly newsletter',
      'Community directory access',
      'Special family events'
    ],
    popular: true
  },
  {
    id: 'supporting',
    name: 'Supporting Membership',
    price: 300,
    description: 'For those who want to provide additional support',
    features: [
      'All family membership benefits',
      'Reserved seating for holidays',
      'Special recognition',
      'Quarterly community updates',
      'Priority event access'
    ]
  }
];

export default function MembershipPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [membershipData, setMembershipData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMembershipData({
      ...membershipData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectMembership = (tierId: string) => {
    setSelectedTier(tierId);
    setShowPayment(true);
  };

  const selectedMembership = membershipTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Become a Member
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Beth Shalom Fairfield and become part of our warm, welcoming Jewish community. 
            Your membership helps support our programs and services.
          </p>
        </div>

        {!showPayment ? (
          <>
            {/* Membership Tiers */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative bg-white rounded-lg shadow-lg p-8 ${
                    tier.popular ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      ${tier.price}
                      <span className="text-base font-normal text-gray-600">/year</span>
                    </div>
                    <p className="text-gray-600">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="text-green-500 mr-3" size={16} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectMembership(tier.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Select {tier.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Membership Benefits
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What's Included
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Full participation in all services and programs</li>
                    <li>• Access to High Holy Day services</li>
                    <li>• Weekly Parashah study materials</li>
                    <li>• Community events and social gatherings</li>
                    <li>• Educational programs and lectures</li>
                    <li>• Newsletter and community updates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Financial Assistance
                  </h3>
                  <p className="text-gray-700 mb-4">
                    We believe that financial circumstances should never prevent someone from 
                    joining our community. If you need assistance with membership dues, please 
                    contact us confidentially.
                  </p>
                  <p className="text-gray-700">
                    <strong>Contact:</strong> {' '}
                    <a href="mailto:bethshalomfairfield@gmail.com" className="text-blue-600 hover:text-blue-800">
                      bethshalomfairfield@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Payment Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-blue-600 hover:text-blue-800 mb-4"
                >
                  ← Back to membership options
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Your Membership
                </h2>
                <p className="text-gray-600">
                  {selectedMembership?.name} - ${selectedMembership?.price}/year
                </p>
              </div>

              {/* Member Information Form */}
              <form className="space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={membershipData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={membershipData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={membershipData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={membershipData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={membershipData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={membershipData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={membershipData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={membershipData.zip}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>

              {/* PayPal Payment */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment
                </h3>
                <PayPalScriptProvider 
                  options={{ 
                    "clientId": "test", // Replace with your PayPal client ID
                    currency: "USD"
                  }}
                >
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: {
                            value: selectedMembership?.price?.toString() || "0",
                            currency_code: "USD"
                          },
                          description: `${selectedMembership?.name} - Beth Shalom Fairfield`
                        }]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order?.capture().then((details) => {
                        alert(`Transaction completed by ${details.payer?.name?.given_name}`);
                        // Handle successful payment
                      }) || Promise.resolve();
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      alert('Payment failed. Please try again.');
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}