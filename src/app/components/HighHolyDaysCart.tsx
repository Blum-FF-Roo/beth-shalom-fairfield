'use client';

import { useState, useEffect } from 'react';
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

export default function HighHolyDaysCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeSection, setActiveSection] = useState<'membership' | 'tickets'>('membership');
  const [isMounted, setIsMounted] = useState(false);
  const [customText, setCustomText] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('cart');
  const [paymentDetails, setPaymentDetails] = useState<PayPalOrderDetails | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToCart = (elementId: string) => {
    const cartElement = document.getElementById(elementId);
    if (cartElement) {
      const headerHeight = 120; // Approximate header height including padding
      const elementTop = cartElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  const addToCart = (product: ProductOption) => {
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
    
    // Scroll to cart section after adding item
    setTimeout(() => {
      scrollToCart('high-holy-days-cart-section');
    }, 100); // Small delay to ensure cart state has updated
  };

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

  const renderProductGrid = (products: ProductOption[]) => (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {products.map((product) => (
        <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
              {product.description && (
                <p className="text-xs text-gray-600 mt-1">{product.description}</p>
              )}
            </div>
            <div className="text-right ml-3">
              <p className="text-lg font-bold" style={{color: '#F58C28'}}>${product.price}</p>
            </div>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded text-sm transition-colors duration-200"
            style={{backgroundColor: '#F58C28'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );

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
        <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Section Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setActiveSection('membership')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'membership'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeSection === 'membership' ? {backgroundColor: '#F58C28'} : {}}
          >
            Membership
          </button>
          <button
            onClick={() => setActiveSection('tickets')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'tickets'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeSection === 'tickets' ? {backgroundColor: '#F58C28'} : {}}
          >
            Non-Member Tickets
          </button>
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === 'membership' && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Membership Options</h3>
            <p className="text-gray-600 text-sm">Choose your membership level for the High Holy Days and full year</p>
          </div>
          {renderProductGrid(membershipOptions)}
        </div>
      )}

      {activeSection === 'tickets' && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">High Holy Days Tickets</h3>
            <p className="text-gray-600 text-sm">Purchase tickets for individual services or both holidays</p>
          </div>
          {renderProductGrid(ticketOptions)}
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div id="high-holy-days-cart-section" className="border-t pt-6 mt-6">
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.159-.69c-.01-.04-.02-.08-.032-.12a5.1 5.1 0 0 0-.618-1.314c-1.45-2.143-4.24-2.143-7.582-2.143H9.677c-.524 0-.967.382-1.05.9L7.49 9.561c-.018.114-.006.229.033.334.04.104.113.192.21.252.097.06.212.09.329.084h2.19c4.298 0 7.664-1.747 8.647-6.798.03-.149.054-.294.077-.437a8.67 8.67 0 0 0 .246-1.039z"/>
                    </svg>
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
          <p className="text-gray-500 text-sm">Your cart is empty. Select membership or tickets above to get started.</p>
        </div>
      )}
    </div>
    )}
    </>
  );
}