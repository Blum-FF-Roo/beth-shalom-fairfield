'use client';

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { useToast } from '@/app/utils/ToastContext';

interface PayPalDonationProps {
  defaultAmount?: string;
}

export default function PayPalDonation({ defaultAmount = "25.00" }: PayPalDonationProps) {
  const [donationAmount, setDonationAmount] = useState(defaultAmount);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const predefinedAmounts = ["18", "36", "50", "100", "180"];

  return (
    <>
      {/* Z-Index fix for PayPal buttons */}
      <style jsx global>{`
        .paypal-buttons {
          position: relative !important;
          z-index: 10 !important;
        }
        
        .paypal-buttons iframe {
          z-index: 10 !important;
        }
        
        /* Ensure header stays on top - preserve existing positioning */
        header, nav {
          z-index: 50 !important;
        }
      `}</style>
      
      <div className="w-full max-w-md mx-auto">
      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Donation Amount</h3>
        
        {/* Predefined Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setDonationAmount(amount);
                setIsCustomAmount(false);
              }}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
                donationAmount === amount && !isCustomAmount
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-orange-300'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-4">
          <button
            onClick={() => setIsCustomAmount(true)}
            className={`w-full px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${
              isCustomAmount
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-300 hover:border-orange-300'
            }`}
          >
            Custom Amount
          </button>
          
          {isCustomAmount && (
            <div className="mt-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected Amount Display */}
        <div className="text-center mb-4">
          <p className="text-gray-600">Donation Amount: <span className="font-semibold text-lg" style={{color: '#F58C28'}}>${donationAmount}</span></p>
        </div>
      </div>

      {/* Personal Message */}
      <div className="mb-6">
        <label htmlFor="personalMessage" className="block text-sm font-medium text-gray-700 mb-2">
          Personal Message (Optional)
        </label>
        <textarea
          id="personalMessage"
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          rows={3}
          placeholder="Add a personal message that will be visible to synagogue staff..."
          maxLength={200}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            This message will be included with your donation details
          </p>
          <p className="text-xs text-gray-400">
            {personalMessage.length}/200
          </p>
        </div>
      </div>

      {/* PayPal Buttons */}
      {isMounted && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "test-mock-client-id" ? (
        <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "donate"
        }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: donationAmount,
                currency_code: "USD"
              },
              description: personalMessage 
                ? `Donation to Congregation Beth Shalom - ${personalMessage}`
                : "Donation to Congregation Beth Shalom"
            }],
            intent: "CAPTURE"
          });
        }}
        onApprove={async (_data, actions) => {
          if (actions.order) {
            try {
              const details = await actions.order.capture();
              
              // Handle successful donation
              showSuccess(
                'Donation Successful!',
                `Thank you for your generous donation of $${donationAmount}, ${details.payer?.name?.given_name || 'Anonymous'}! Your support helps our congregation and community programs. Transaction ID: ${details.id}`,
                8000
              );
              
              // Here you could also:
              // - Send confirmation email
              // - Update database
              // - Redirect to thank you page
              // - Show success modal
              
            } catch (error) {
              console.error("Error capturing order:", error);
              showError(
                'Donation Processing Error',
                'There was an error processing your donation. Please try again or contact us for assistance.'
              );
            }
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          showError(
            'PayPal Error',
            'There was an error with PayPal. Please try again or contact us directly for assistance.'
          );
        }}
        onCancel={() => {
          console.log("Donation cancelled by user");
        }}
        />
      ) : (
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-800 mb-2">PayPal Configuration Needed</h4>
            <p className="text-yellow-700 text-sm">
              PayPal integration requires a valid Client ID. Please contact the administrator to complete the PayPal setup.
            </p>
          </div>
          <button
            className="w-full bg-gray-300 text-gray-600 font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
            disabled
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.159-.69c-.01-.04-.02-.08-.032-.12a5.1 5.1 0 0 0-.618-1.314c-1.45-2.143-4.24-2.143-7.582-2.143H9.677c-.524 0-.967.382-1.05.9L7.49 9.561c-.018.114-.006.229.033.334.04.104.113.192.21.252.097.06.212.09.329.084h2.19c4.298 0 7.664-1.747 8.647-6.798.03-.149.054-.294.077-.437a8.67 8.67 0 0 0 .246-1.039z"/>
            </svg>
            <span>PayPal Donation (Setup Required)</span>
          </button>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Secure donation processing through PayPal</p>
        <p className="mt-1">Congregation Beth Shalom is a registered 501(c)(3) organization</p>
      </div>
    </div>
    </>
  );
}