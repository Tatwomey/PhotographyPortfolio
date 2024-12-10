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

  const price = product.price;

  const formattedPrice = price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    : 'Price Not Available';

  const handleAddToCartClick = async () => {
    if (!cart) {
      console.error('Cart is still loading or not available. Please wait.');
      return;
    }

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
    <div className="relative w-full aspect-[4/5] mb-6">
      <Link href={`/popup/${product.handle || 'default-slug'}`} legacyBehavior>
        <a className="block relative w-full h-full bg-gray-100 overflow-hidden rounded-lg shadow hover:shadow-lg">
          <img
            src={product.imageSrc || '/fallback-image.jpg'}
            alt={product.imageAlt || 'Product Image'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isSoldOut && (
            <div className="absolute top-0 left-0 bg-red-500 text-white p-2 text-sm">
              Sold out
            </div>
          )}
        </a>
      </Link>
      <div className="mt-2 text-center">
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p className="text-sm text-gray-700">{product.description}</p>
        <p className="text-md font-bold">{formattedPrice}</p>
        <button
          onClick={handleAddToCartClick}
          className={`mt-2 px-4 py-2 text-sm font-bold rounded ${
            isSoldOut
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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
