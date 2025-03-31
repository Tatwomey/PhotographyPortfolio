'use client';

import React from 'react';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';

const Product = ({ product, isSoldOut, onAddToCart }) => {
  const { cart, handleAddToCart, refreshCart } = useShopContext();
  const [addingToCart, setAddingToCart] = React.useState(false);

  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const handleAddToCartClick = async () => {
    if (!cart) {
      console.error('Cart is not ready');
      return;
    }

    setAddingToCart(true);
    try {
      await handleAddToCart(product.variantId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAddingToCart(false);
  };

  return (
    <div className="relative w-full bg-white group cursor-pointer">
      <Link href={`/shop/${product.handle}`} className="block aspect-[4/5] w-full relative overflow-hidden rounded">
        <img
          src={product.imageSrc || '/fallback-image.jpg'}
          alt={product.imageAlt || 'Product Image'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!product.availableForSale && (
          <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs font-semibold z-10">
            Sold Out
          </div>
        )}
      </Link>

      <div className="mt-2 text-center px-2">
        <h2 className="text-base font-semibold">{product.title}</h2>
        <p className="text-sm text-gray-600 mb-1">{formattedPrice}</p>

        <button
          onClick={handleAddToCartClick}
          className={`w-full py-2 mt-1 rounded text-sm font-semibold ${
            isSoldOut
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
          disabled={addingToCart || isSoldOut}
        >
          {addingToCart ? 'Adding...' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Product;
