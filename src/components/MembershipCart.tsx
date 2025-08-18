'use client';

import { useState, useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Plus, Minus, ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface MembershipOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const membershipOptions: MembershipOption[] = [
  {
    id: 'sustaining',
    name: 'Sustaining Membership',
    price: 1000,
    description: 'Full support membership with all benefits'
  },
  {
    id: 'sponsoring',
    name: 'Sponsoring Membership',
    price: 500,
    description: 'Supporting membership with all benefits'
  },
  {
    id: 'family',
    name: 'Family Membership',
    price: 295,
    description: 'Full family membership'
  },
  {
    id: 'single',
    name: 'Single Membership',
    price: 165,
    description: 'Individual membership'
  },
  {
    id: 'faculty-family',
    name: 'College Faculty, Staff Family',
    price: 145,
    description: 'Family membership for college staff'
  },
  {
    id: 'faculty-single',
    name: 'College Faculty, Staff Single',
    price: 95,
    description: 'Individual membership for college staff'
  }
];

interface CartItem extends MembershipOption {
  quantity: number;
}

export default function MembershipCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToCart = (membership: MembershipOption) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === membership.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === membership.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...membership, quantity: 1 }];
    });
  };

  const removeFromCart = (membershipId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== membershipId));
  };

  const updateQuantity = (membershipId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(membershipId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === membershipId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Membership</h2>
        <p className="text-gray-600">Choose your membership level and proceed to secure PayPal checkout</p>
      </div>

      {/* Membership Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {membershipOptions.map((membership) => (
          <div key={membership.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{membership.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{membership.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{color: '#F58C28'}}>${membership.price}</p>
              </div>
            </div>
            <button
              onClick={() => addToCart(membership)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              style={{backgroundColor: '#F58C28'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Cart ({cartItemCount} items)</h3>
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {showCart ? 'Hide' : 'Show'} Details
              {showCart ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>

          {showCart && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      data-testid="plus-button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                      data-testid="remove-button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold" style={{color: '#F58C28'}}>${cartTotal}</span>
          </div>

          {/* Checkout Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
              Ready to Complete Your Membership?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Click the PayPal button below to securely complete your membership purchase
            </p>
            
            {/* PayPal Checkout */}
            <div className="max-w-md mx-auto">
              {isMounted && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "test-mock-client-id" ? (
                <PayPalButtons
                  style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "pay"
              }}
              createOrder={(_data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: cartTotal.toString(),
                      currency_code: "USD",
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: cartTotal.toString()
                        }
                      }
                    },
                    items: cart.map(item => ({
                      name: item.name,
                      unit_amount: {
                        currency_code: "USD",
                        value: item.price.toString()
                      },
                      quantity: item.quantity.toString(),
                      description: item.description || ''
                    })),
                    description: "Congregation Beth Shalom Membership"
                  }],
                  intent: "CAPTURE"
                });
              }}
              onApprove={async (_data, actions) => {
                if (actions.order) {
                  try {
                    const details = await actions.order.capture();
                    
                    // Handle successful membership purchase

                    showSuccess(
                      'Membership Purchase Successful!',
                      `Thank you ${details.payer?.name?.given_name || 'Anonymous'}! Your membership has been processed. Transaction ID: ${details.id}. Welcome to Congregation Beth Shalom!`,
                      8000
                    );
                    
                    // Clear cart after successful purchase
                    setCart([]);
                    setShowCart(false);
                    
                  } catch (error) {
                    console.error("Error capturing order:", error);
                    showError(
                      'Payment Processing Error',
                      'There was an error processing your membership purchase. Please try again or contact us for assistance.'
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
                console.log("Membership purchase cancelled by user");
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
                  <span>PayPal Checkout (Setup Required)</span>
                </button>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Secure membership processing through PayPal</p>
              <p className="mt-1">You will receive membership confirmation and benefits information via email</p>
            </div>
            </div>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your cart is empty. Select a membership level above to get started.</p>
        </div>
      )}
    </div>
  );
}