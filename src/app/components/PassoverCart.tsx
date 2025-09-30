'use client';

import { useState, useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Plus, Minus, ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/app/utils/ToastContext';

interface PassoverTicket {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const passoverTickets: PassoverTicket[] = [
  {
    id: 'seder-ticket',
    name: 'Passover Seder Ticket',
    price: 20,
    description: 'Ticket for the Community Passover Seder'
  }
];

interface CartItem extends PassoverTicket {
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

export default function PassoverCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('cart');
  const [paymentDetails, setPaymentDetails] = useState<PayPalOrderDetails | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [customText, setCustomText] = useState('');
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

  const addToCart = (ticket: PassoverTicket) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === ticket.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === ticket.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...ticket, quantity: 1 }];
    });
    
    // Scroll to cart section after adding item
    setTimeout(() => {
      scrollToCart('passover-cart-section');
    }, 100); // Small delay to ensure cart state has updated
  };

  const removeFromCart = (ticketId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== ticketId));
  };

  const updateQuantity = (ticketId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(ticketId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === ticketId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
      
      {/* Payment Success State */}
      {paymentStatus === 'success' && paymentDetails && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
            <p className="text-lg text-gray-600 mb-4">
              Thank you {paymentDetails.payer?.name?.given_name || 'for your reservation'}!
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 mb-2">
                <strong>Transaction ID:</strong> {paymentDetails.id || 'N/A'}
              </p>
              <p className="text-sm text-green-800 mb-2">
                <strong>Amount:</strong> ${paymentDetails.purchase_units?.[0]?.amount?.value || 'N/A'}
              </p>
              <p className="text-sm text-green-800">
                <strong>Status:</strong> {paymentDetails.status || 'N/A'}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Your Passover Seder reservation has been confirmed! We look forward to celebrating with you. You will receive a confirmation email with event details and location information.
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Failed</h3>
            <p className="text-lg text-gray-600 mb-4">
              We encountered an issue processing your Seder reservation.
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reserve Your Seder Seats</h2>
        <p className="text-gray-600">Join us for our Community Passover Seder - $20 per person</p>
      </div>

      {/* Ticket Option */}
      <div className="max-w-md mx-auto mb-8">
        {passoverTickets.map((ticket) => (
          <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{color: '#F58C28'}}>${ticket.price}</p>
                <p className="text-xs text-gray-500">per person</p>
              </div>
            </div>
            <button
              onClick={() => addToCart(ticket)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
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
        <div id="passover-cart-section" className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Reservation ({cartItemCount} {cartItemCount === 1 ? 'person' : 'people'})</h3>
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
                    <p className="text-sm text-gray-600">${item.price} per person</p>
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
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
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
              Complete Your Seder Reservation
            </h3>
            
            {/* Custom Text Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please list the names of all the attendees included in this purchase:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Enter the names of all attendees..."
              />
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              Complete the form above and secure your seats for the Community Passover Seder with PayPal
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
                    const customTextForPaypal = customText.trim() 
                      ? ` | Attendees: ${customText.trim()}`
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
                        description: `Congregation Beth Shalom - Passover Seder Reservation${customTextForPaypal}`,
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
                        
                        showSuccess(
                          'Seder Reservation Confirmed!',
                          `Thank you ${details.payer?.name?.given_name || 'Anonymous'}! Your Passover Seder reservation for ${cartItemCount} ${cartItemCount === 1 ? 'person' : 'people'} has been confirmed. Transaction ID: ${details.id}. We look forward to celebrating with you!`,
                          8000
                        );
                        
                      } catch (error) {
                        console.error("Error capturing order:", error);
                        setPaymentStatus('error');
                        showError(
                          'Payment Processing Error',
                          'There was an error processing your seder reservation. Please try again or contact us for assistance.'
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
                    console.log("Seder reservation cancelled by user");
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
                <p>Secure seder reservation through PayPal</p>
                <p className="mt-1">You will receive confirmation and event details via email</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Click "Add to Cart" above to reserve your seats for the seder.</p>
        </div>
      )}
    </div>
    )}
    </>
  );
}