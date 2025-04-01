'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';

const Product = ({ product, isSoldOut, onAddToCart }) => {
  const { cart, handleAddToCart, refreshCart } = useShopContext();
  const [addingToCart, setAddingToCart] = useState(false);

  const price = product.price;
  const formattedPrice = price
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)
    : 'Price Not Available';

  const handleAddToCartClick = async () => {
    if (!cart) return;

    setAddingToCart(true);
    try {
      await handleAddToCart(product.variantId, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAddingToCart(false);
  };

  const triggerKlaviyoForm = () => {
    if (window?._klOnsite) {
      window._klOnsite.push(['openForm', 'RjNi3C']);
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] mb-6 group">
      <Link href={`/shop/${product.handle || 'default-slug'}`} legacyBehavior>
        <a className="block relative w-full h-full bg-gray-100 overflow-hidden rounded-lg shadow hover:shadow-lg">
          <img
            src={product.imageSrc || '/fallback-image.jpg'}
            alt={product.imageAlt || 'Product Image'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isSoldOut && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Sold out
            </div>
          )}
        </a>
      </Link>

      <div className="mt-2 text-center">
        <h2 className="text-lg font-bold">{product.title}</h2>
        <p className="text-sm text-gray-700">{product.description}</p>
        <p className="text-md font-bold">{formattedPrice}</p>

        {isSoldOut ? (
          <button
            onClick={triggerKlaviyoForm}
            className="mt-2 px-4 py-2 text-sm font-bold rounded bg-gray-300 text-black hover:bg-gray-400"
          >
            Notify Me
          </button>
        ) : (
          <button
            onClick={handleAddToCartClick}
            className="mt-2 px-4 py-2 text-sm font-bold rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding…' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
