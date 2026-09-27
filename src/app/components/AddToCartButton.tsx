'use client';

import { useCart, CartProduct } from '@/app/utils/CartContext';

interface AddToCartButtonProps {
  product: CartProduct;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function AddToCartButton({ product, disabled = false, fullWidth = false }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      disabled={disabled}
      className={`text-white font-semibold py-2 px-5 rounded-full text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''}`}
      style={{ backgroundColor: '#F58C28' }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = '#E67C1F')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.backgroundColor = '#F58C28')}
    >
      Add to Cart
    </button>
  );
}
