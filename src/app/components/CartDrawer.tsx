'use client';

import { useState } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/app/utils/CartContext';
import { usePayPalBusinessEmail } from '@/app/utils/usePayPalConfig';

export default function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, removeItem, updateQuantity, clearCart, closeCart } = useCart();
  const { businessEmail, checkoutUrl, isConfigured: paypalIsConfigured } = usePayPalBusinessEmail();

  const [names, setNames] = useState('');

  const hasMembership = items.some(item => item.category === 'membership');
  const namesLabel = hasMembership ? 'Member Name(s)' : 'Name(s) for this Order';

  const handleClose = () => {
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
          {items.length === 0 ? (
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

              {paypalIsConfigured ? (
                <form action={checkoutUrl} method="post" target="_blank">
                  <input type="hidden" name="cmd" value="_cart" />
                  <input type="hidden" name="upload" value="1" />
                  <input type="hidden" name="business" value={businessEmail} />
                  <input type="hidden" name="currency_code" value="USD" />
                  <input type="hidden" name="no_shipping" value="1" />
                  {names.trim() && (
                    <input type="hidden" name="custom" value={`${namesLabel}: ${names.trim()}`} />
                  )}
                  {items.flatMap((item, index) => [
                    <input key={`name-${item.id}`} type="hidden" name={`item_name_${index + 1}`} value={item.name} />,
                    <input key={`amount-${item.id}`} type="hidden" name={`amount_${index + 1}`} value={item.price.toFixed(2)} />,
                    <input key={`qty-${item.id}`} type="hidden" name={`quantity_${index + 1}`} value={item.quantity.toString()} />,
                  ])}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full text-white font-semibold transition-colors duration-200"
                    style={{ backgroundColor: '#F58C28' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E67C1F')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F58C28')}
                  >
                    Checkout with PayPal
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-800">PayPal isn&apos;t configured yet. Please contact the administrator.</p>
                </div>
              )}

              <button
                onClick={clearCart}
                className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Empty cart
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You&apos;ll be taken to PayPal in a new tab to complete your payment securely. No PayPal account is required &mdash; you can pay with any major card.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
