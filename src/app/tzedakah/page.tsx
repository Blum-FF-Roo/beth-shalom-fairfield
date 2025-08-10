'use client';

import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Heart, Users, BookOpen, Home } from 'lucide-react';

const donationCauses = [
  {
    id: 'general',
    name: 'General Operating Fund',
    description: 'Support our daily operations, services, and community programs',
    icon: Home,
    suggested: [18, 36, 72, 180]
  },
  {
    id: 'education',
    name: 'Educational Programs',
    description: 'Fund our educational initiatives, library, and learning materials',
    icon: BookOpen,
    suggested: [25, 50, 100, 250]
  },
  {
    id: 'community',
    name: 'Community Outreach',
    description: 'Support our efforts to help those in need in our community',
    icon: Users,
    suggested: [36, 72, 144, 360]
  },
  {
    id: 'special',
    name: 'Special Events & Holidays',
    description: 'Help us celebrate holidays and special occasions together',
    icon: Heart,
    suggested: [50, 100, 200, 500]
  }
];

export default function TzedakahPage() {
  const [selectedCause, setSelectedCause] = useState<string>('general');
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isAnonymous: false,
    dedication: ''
  });

  const selectedCauseData = donationCauses.find(cause => cause.id === selectedCause);
  const finalAmount = customAmount || donationAmount;

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleProceedToDonate = () => {
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      alert('Please select or enter a donation amount');
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tzedakah - Donations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tzedakah, often translated as charity, literally means "righteousness" or "justice." 
            Your generous donations help sustain our community and support those in need.
          </p>
        </div>

        {!showPayment ? (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Selection */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Cause
                </h2>
                
                <div className="space-y-4">
                  {donationCauses.map((cause) => {
                    const IconComponent = cause.icon;
                    return (
                      <label
                        key={cause.id}
                        className={`block p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedCause === cause.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cause"
                          value={cause.id}
                          checked={selectedCause === cause.id}
                          onChange={(e) => setSelectedCause(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                          <IconComponent 
                            className={`mt-1 ${
                              selectedCause === cause.id ? 'text-blue-600' : 'text-gray-400'
                            }`} 
                            size={20} 
                          />
                          <div>
                            <h3 className={`font-semibold ${
                              selectedCause === cause.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {cause.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {cause.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Select Amount
                </h2>
                
                {/* Suggested Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {selectedCauseData?.suggested.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setDonationAmount(amount.toString());
                        setCustomAmount('');
                      }}
                      className={`p-3 border rounded-lg font-semibold transition-colors duration-200 ${
                        donationAmount === amount.toString() && !customAmount
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationAmount('');
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Donor Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={donorInfo.firstName}
                        onChange={handleDonorInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={donorInfo.lastName}
                        onChange={handleDonorInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (for receipt)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={donorInfo.email}
                      onChange={handleDonorInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={donorInfo.isAnonymous}
                        onChange={handleDonorInfoChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Make this donation anonymous
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dedication (Optional)
                    </label>
                    <textarea
                      name="dedication"
                      placeholder="In memory of... In honor of..."
                      value={donorInfo.dedication}
                      onChange={handleDonorInfoChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Summary & Proceed */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Donation Summary
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Cause:</strong> {selectedCauseData?.name}<br />
                  <strong>Amount:</strong> ${finalAmount || '0.00'}
                </p>
                <button
                  onClick={handleProceedToDonate}
                  disabled={!finalAmount || parseFloat(finalAmount) <= 0}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Proceed to Donate
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Section */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <button
                onClick={() => setShowPayment(false)}
                className="text-blue-600 hover:text-blue-800 mb-4"
              >
                ← Back to donation details
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Your Donation
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900">Donation Details</h3>
                <p className="text-gray-700">
                  <strong>Cause:</strong> {selectedCauseData?.name}<br />
                  <strong>Amount:</strong> ${finalAmount}<br />
                  {donorInfo.dedication && (
                    <>
                      <strong>Dedication:</strong> {donorInfo.dedication}
                    </>
                  )}
                </p>
              </div>

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
                          value: finalAmount,
                          currency_code: "USD"
                        },
                        description: `Donation to ${selectedCauseData?.name} - Beth Shalom Fairfield`
                      }]
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order?.capture().then((details) => {
                      alert(`Thank you for your donation, ${details.payer?.name?.given_name}!`);
                      // Handle successful donation
                    }) || Promise.resolve();
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    alert('Donation failed. Please try again.');
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}

        {/* Information About Tzedakah */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Tzedakah
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            <div>
              <p className="mb-4">
                Tzedakah is a Hebrew word that is often translated as "charity," but its true meaning 
                is closer to "righteousness" or "justice." In Jewish tradition, tzedakah is not just 
                about giving money to those in need—it's about doing what is right and just.
              </p>
              <p>
                The act of giving tzedakah is considered one of the most important mitzvot (commandments) 
                in Judaism, and it is seen as a way to repair the world (tikkun olam) and bring about justice.
              </p>
            </div>
            <div>
              <p className="mb-4">
                At Beth Shalom Fairfield, your donations support our community's activities, help maintain 
                our facilities, fund educational programs, and allow us to extend a helping hand to those 
                in our community who need assistance.
              </p>
              <p>
                Every contribution, no matter the size, makes a meaningful difference in the life of our 
                community. Thank you for your generosity and commitment to tzedakah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}