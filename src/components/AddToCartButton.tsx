'use client';

import { useEffect, useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  onAddToCart?: (productId: string) => void;
}

export default function AddToCartButton({ productId, onAddToCart }: AddToCartButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addToHHCart) {
      ((window as unknown as Record<string, unknown>).addToHHCart as (id: string) => void)(productId);
    }
    onAddToCart?.(productId);
  };

  if (!isClient) {
    return <span>Loading...</span>;
  }

  return (
    <button
      onClick={handleClick}
      className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
      style={{backgroundColor: '#F58C28'}}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E67C1F'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F58C28'}
    >
      Add to Cart
    </button>
  );
}