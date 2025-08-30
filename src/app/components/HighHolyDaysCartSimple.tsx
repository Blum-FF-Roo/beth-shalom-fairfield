'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Plus, Minus, ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/app/utils/ToastContext';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: 'membership' | 'ticket';
}

const membershipOptions: ProductOption[] = [
  {
    id: 'sustaining',
    name: 'Sustaining Membership',
    price: 1000,
    description: 'Full support membership with all benefits',
    category: 'membership'
  },
  {
    id: 'sponsoring',
    name: 'Sponsoring Membership',
    price: 500,
    description: 'Supporting membership with all benefits',
    category: 'membership'
  },
  {
    id: 'family',
    name: 'Family Membership',
    price: 295,
    description: 'Full family membership',
    category: 'membership'
  },
  {
    id: 'single',
    name: 'Single Membership',
    price: 165,
    description: 'Individual membership',
    category: 'membership'
  },
  {
    id: 'faculty-family',
    name: 'College Faculty, Staff Family',
    price: 145,
    description: 'Family membership for college staff',
    category: 'membership'
  },
  {
    id: 'faculty-single',
    name: 'College Faculty, Staff Single',
    price: 95,
    description: 'Individual membership for college staff',
    category: 'membership'
  }
];

const ticketOptions: ProductOption[] = [
  {
    id: 'both-holidays',
    name: 'Rosh Hashanah and Yom Kippur',
    price: 72,
    description: 'Tickets for both High Holy Days',
    category: 'ticket'
  },
  {
    id: 'rosh-hashanah',
    name: 'Rosh Hashanah',
    price: 36,
    description: 'Rosh Hashanah service ticket',
    category: 'ticket'
  },
  {
    id: 'yom-kippur',
    name: 'Yom Kippur',
    price: 42,
    description: 'Yom Kippur service ticket',
    category: 'ticket'
  },
  {
    id: 'college-both',
    name: 'College/IA-Rosh Hashanah and Yom Kippur',
    price: 42,
    description: 'Student/Iowa resident rate for both holidays',
    category: 'ticket'
  },
  {
    id: 'college-rosh',
    name: 'College/IA-Rosh Hashanah',
    price: 19,
    description: 'Student/Iowa resident rate for Rosh Hashanah',
    category: 'ticket'
  },
  {
    id: 'college-yom',
    name: 'College/IA-Yom Kippur',
    price: 25,
    description: 'Student/Iowa resident rate for Yom Kippur',
    category: 'ticket'
  }
];

interface CartItem extends ProductOption {
  quantity: number;
}

interface HighHolyDaysCartSimpleProps {
  onAddToCart?: (productId: string) => void;
}

type PaymentStatus = 'cart' | 'success' | 'error';

interface PayPalOrderDetails {
  id?: string;
  status?: string;
  payer?: {
    name?: {
      given_name?: string;
    };
  };
  purchase_units?: Array<{
    amount?: {
      value?: string;
    };
  }>;
  [key: string]: unknown; // Allow other PayPal properties
}

export default function HighHolyDaysCartSimple({ onAddToCart }: HighHolyDaysCartSimpleProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [customText, setCustomText] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('cart');
  const [paymentDetails, setPaymentDetails] = useState<PayPalOrderDetails | null>(null);
  const { showSuccess, showError } = useToast();

  const allProducts = useMemo(() => [...membershipOptions, ...ticketOptions], []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToCart = useCallback((elementId: string) => {
    const cartElement = document.getElementById(elementId);
    if (cartElement) {
      const headerHeight = 120; // Approximate header height including padding
      const elementTop = cartElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }, []);

  const addToCart = useCallback((productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    onAddToCart?.(productId);
    
    // Scroll to cart section after adding item
    setTimeout(() => {
      scrollToCart('high-holy-days-simple-cart-section');
    }, 100); // Small delay to ensure cart state has updated
  }, [allProducts, onAddToCart, scrollToCart]);

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Function to create "Add to Cart" button for embedding in tables
  const CreateAddToCartButton = useCallback(({ productId }: { productId: string }) => {
    return (
      <button
        onClick={() => addToCart(productId)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
        style={{backgroundColor: '#F58C28'}}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
      >
        Add to Cart
      </button>
    );
  }, [addToCart]);

  // Expose the button creator function globally for use in page
  useEffect(() => {
    (window as unknown as Record<string, unknown>).createAddToCartButton = CreateAddToCartButton;
    (window as unknown as Record<string, unknown>).addToHHCart = addToCart;
  }, [CreateAddToCartButton, addToCart]);

  return (
    <>
      {/* Payment Success State */}
      {paymentStatus === 'success' && paymentDetails && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
            <p className="text-lg text-gray-600 mb-4">
              Thank you {paymentDetails.payer?.name?.given_name || 'for your purchase'}!
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 mb-2">
                <strong>Transaction ID:</strong> {paymentDetails.id}
              </p>
              <p className="text-sm text-green-800 mb-2">
                <strong>Amount:</strong> ${paymentDetails.purchase_units?.[0]?.amount?.value || 'N/A'}
              </p>
              <p className="text-sm text-green-800">
                <strong>Status:</strong> {paymentDetails.status}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Your High Holy Days purchase has been processed successfully! You will receive confirmation emails with event details, membership information, and ticket information as applicable.
            </p>
            <button
              onClick={() => {
                setPaymentStatus('cart');
                setPaymentDetails(null);
                setCart([]);
                setShowCart(false);
                setCustomText('');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Payment Error State */}
      {paymentStatus === 'error' && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase Failed</h3>
            <p className="text-lg text-gray-600 mb-4">
              We encountered an issue processing your High Holy Days purchase.
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-2">
                Don't worry - no charges have been made to your account.
              </p>
              <p className="text-sm text-red-800">
                You can try again or contact us directly for assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setPaymentStatus('cart');
                  setPaymentDetails(null);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <a
                href="/contact"
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Regular Cart State */}
      {paymentStatus === 'cart' && (
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

      {/* Cart Summary - Only show if items in cart */}
      {cart.length > 0 && (
        <div id="high-holy-days-simple-cart-section" className="bg-white rounded-lg shadow-lg p-8 mb-8" style={{position: 'relative', zIndex: 10}}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Your Cart ({cartItemCount} items)</h4>
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
                    <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                    <p className="text-xs text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                    >
                      <X className="w-3 h-3" />
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
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 text-center mb-4">
              Ready to Complete Your Purchase?
            </h4>
            
            {/* Custom Text Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {cart.some(item => item.category === 'membership') 
                  ? 'Please list the members included in this purchase:'
                  : 'Please list the names of all the attendees included in this purchase:'
                }
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder={cart.some(item => item.category === 'membership') 
                  ? 'Enter the names of all members...'
                  : 'Enter the names of all attendees...'
                }
              />
            </div>
            
            <p className="text-gray-600 text-center mb-6 text-sm">
              Complete the form above and click the PayPal button below to securely complete your purchase
            </p>
            
            {/* PayPal Checkout */}
            <div className="max-w-md mx-auto paypal-buttons">
              {isMounted && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "test-mock-client-id" ? (
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "pay"
                  }}
                  createOrder={(_data, actions) => {
                    const hasMemebership = cart.some(item => item.category === 'membership');
                    const customTextForPaypal = customText.trim() 
                      ? ` | ${hasMemebership ? 'Members' : 'Attendees'}: ${customText.trim()}`
                      : '';
                    
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
                        description: `Congregation Beth Shalom - High Holy Days ${hasMemebership ? 'Membership' : 'Tickets'}${customTextForPaypal}`,
                        custom_id: customText.trim() || undefined
                      }],
                      intent: "CAPTURE"
                    });
                  }}
                  onApprove={async (_data, actions) => {
                    if (actions.order) {
                      try {
                        const details = await actions.order.capture();
                        
                        // Set success state and store payment details
                        setPaymentStatus('success');
                        setPaymentDetails(details);
                        
                        const hasMemebership = cart.some(item => item.category === 'membership');
                        const successMessage = hasMemebership 
                          ? `Thank you ${details.payer?.name?.given_name || 'Anonymous'}! Your membership has been processed. Transaction ID: ${details.id}. Welcome to Congregation Beth Shalom!`
                          : `Thank you ${details.payer?.name?.given_name || 'Anonymous'}! Your High Holy Days tickets have been processed. Transaction ID: ${details.id}. We look forward to seeing you!`;

                        showSuccess(
                          'Purchase Successful!',
                          successMessage,
                          8000
                        );
                        
                      } catch (error) {
                        console.error("Error capturing order:", error);
                        setPaymentStatus('error');
                        showError(
                          'Payment Processing Error',
                          'There was an error processing your purchase. Please try again or contact us for assistance.'
                        );
                      }
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setPaymentStatus('error');
                    showError(
                      'PayPal Error',
                      'There was an error with PayPal. Please try again or contact us directly for assistance.'
                    );
                  }}
                  onCancel={() => {
                    console.log("Purchase cancelled by user");
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-yellow-800 mb-2">PayPal Configuration Needed</h5>
                    <p className="text-yellow-700 text-sm">
                      PayPal integration requires a valid Client ID. Please contact the administrator to complete the PayPal setup.
                    </p>
                  </div>
                  <button
                    className="w-full bg-gray-300 text-gray-600 font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                    disabled
                  >
                    <span>PayPal Checkout (Setup Required)</span>
                  </button>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Secure processing through PayPal</p>
                <p className="mt-1">You will receive confirmation via email</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Select membership or tickets from the tables above to get started.</p>
        </div>
      )}
    </>
    )}
    </>
  );
}