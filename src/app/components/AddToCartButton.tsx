'use client';

import { useCart, CartProduct } from '@/app/utils/CartContext';

interface AddToCartButtonProps {
  product: CartProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      className="text-white font-semibold py-2 px-5 rounded-full text-sm transition-colors duration-200"
      style={{ backgroundColor: '#F58C28' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E67C1F')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F58C28')}
    >
      Add to Cart
    </button>
  );
}
