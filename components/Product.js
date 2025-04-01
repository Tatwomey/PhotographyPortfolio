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
    currency: 'USD'
  }).format(product.price);

  const handleAddToCartClick = async () => {
    if (!cart) return console.error('Cart unavailable');

    setAddingToCart(true);
    try {
      await handleAddToCart(product.variantId, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAddingToCart(false);
  };

  return (
    <div className="relative w-full aspect-[4/5] bg-white rounded overflow-hidden shadow group">
      <Link href={`/shop/${product.handle || 'default-slug'}`} className="block w-full h-full relative">
        <img
          src={product.imageSrc || '/fallback-image.jpg'}
          alt={product.imageAlt || 'Product Image'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
            Sold out
          </div>
        )}
      </Link>

      <div className="p-4 text-center">
        <h2 className="text-md font-semibold">{product.title}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-base font-bold mt-1">{formattedPrice}</p>
        <button
          onClick={handleAddToCartClick}
          className={`mt-2 px-4 py-2 text-sm font-bold rounded ${
            isSoldOut
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
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
