'use client';

import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/app/utils/CartContext';
import { useToast } from '@/app/utils/ToastContext';
import { usePayPalConfig } from '@/app/utils/usePayPalConfig';

interface PayPalOrderDetails {
  id?: string;
  status?: string;
  payer?: { name?: { given_name?: string } };
  purchase_units?: Array<{ amount?: { value?: string } }>;
  [key: string]: unknown;
}

type CheckoutStatus = 'cart' | 'success' | 'error';

export default function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, removeItem, updateQuantity, clearCart, closeCart } = useCart();
  const { showSuccess, showError } = useToast();
  const { isConfigured: paypalIsConfigured } = usePayPalConfig();

  const [names, setNames] = useState('');
  const [status, setStatus] = useState<CheckoutStatus>('cart');
  const [orderDetails, setOrderDetails] = useState<PayPalOrderDetails | null>(null);

  const hasMembership = items.some(item => item.category === 'membership');
  const namesLabel = hasMembership ? 'Member Name(s)' : 'Name(s) for this Order';

  const handleClose = () => {
    closeCart();
  };

  const resetAfterSuccess = () => {
    clearCart();
    setNames('');
    setStatus('cart');
    setOrderDetails(null);
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" style={{ color: '#F58C28' }} />
            Shopping Cart
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {status === 'success' && orderDetails ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
              <p className="text-gray-600 mb-4">
                Thank you {orderDetails.payer?.name?.given_name || 'for your purchase'}!
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-green-800 mb-1"><strong>Transaction ID:</strong> {orderDetails.id}</p>
                <p className="text-sm text-green-800"><strong>Amount:</strong> ${orderDetails.purchase_units?.[0]?.amount?.value || 'N/A'}</p>
              </div>
              <p className="text-sm text-gray-600 mb-6">You&apos;ll receive a confirmation email shortly.</p>
              <button
                onClick={resetAfterSuccess}
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: '#F58C28' }}
              >
                Continue Browsing
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Failed</h3>
              <p className="text-sm text-gray-600 mb-6">
                No charges were made. You can try again or contact us for help.
              </p>
              <button
                onClick={() => setStatus('cart')}
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: '#F58C28' }}
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div className="flex-1 pr-3">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      <div className="flex items-center gap-2 mt-2">
                        <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity for {item.name}</label>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold text-gray-900 mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6 pt-2">
                <span className="text-base font-semibold text-gray-900">Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-xl font-bold" style={{ color: '#F58C28' }}>${subtotal.toFixed(2)}</span>
              </div>

              <div className="mb-6">
                <label htmlFor="cart-names" className="block text-sm font-medium text-gray-700 mb-2">
                  {namesLabel}
                </label>
                <textarea
                  id="cart-names"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  rows={2}
                  placeholder="Enter the name(s) for this order"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">These names will be included in the PayPal order details.</p>
              </div>

              <div className="paypal-buttons">
                {paypalIsConfigured ? (
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                    createOrder={(_data, actions) => {
                      const namesForPaypal = names.trim() ? ` | ${namesLabel}: ${names.trim()}` : '';
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: subtotal.toString(),
                            currency_code: 'USD',
                            breakdown: { item_total: { currency_code: 'USD', value: subtotal.toString() } }
                          },
                          items: items.map(item => ({
                            name: item.name,
                            unit_amount: { currency_code: 'USD', value: item.price.toString() },
                            quantity: item.quantity.toString(),
                            description: item.description || ''
                          })),
                          description: `Congregation Beth Shalom${namesForPaypal}`,
                          custom_id: names.trim() || undefined
                        }],
                        intent: 'CAPTURE'
                      });
                    }}
                    onApprove={async (_data, actions) => {
                      if (!actions.order) return;
                      try {
                        const details = await actions.order.capture();
                        setOrderDetails(details);
                        setStatus('success');
                        showSuccess(
                          'Purchase Successful!',
                          `Thank you ${details.payer?.name?.given_name || 'Anonymous'}! Transaction ID: ${details.id}.`,
                          8000
                        );
                      } catch (error) {
                        console.error('Error capturing order:', error);
                        setStatus('error');
                        showError('Payment Processing Error', 'There was an error processing your purchase. Please try again or contact us.');
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      setStatus('error');
                      showError('PayPal Error', 'There was an error with PayPal. Please try again or contact us directly.');
                    }}
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800">PayPal isn&apos;t configured yet. Please contact the administrator.</p>
                  </div>
                )}
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Empty cart
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout through PayPal. You do not need a PayPal account &mdash; you can pay with any major card.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
