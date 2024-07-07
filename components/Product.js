import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';

const Product = ({ product }) => {
  const { handleAddToCart, cartInitialized, refreshCart } = useShopContext();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!cartInitialized) {
      refreshCart(); // Ensure cart is refreshed on component mount
    }
  }, [cartInitialized, refreshCart]);

  const price = product.price;

  const formattedPrice = price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    : 'Price Not Available';

  const handleAddToCartClick = async () => {
    if (!cartInitialized) {
      console.error('Cart is still loading or not available. Please wait.');
      return;
    }

    setAddingToCart(true);
    try {
      await handleAddToCart({ variantId: product.variantId, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAddingToCart(false);
  };

  return (
    <div className="relative w-full h-96">
      <Link href={`/shop/${product.handle || 'default-slug'}`}>
        <div className="cursor-pointer">
          <Image
            src={product.imageSrc || '/fallback-image.jpg'}
            alt={product.imageAlt || 'Product Image'}
            width={400}
            height={400}
            unoptimized
          />
        </div>
      </Link>
      <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
      <p className="text-sm">{product.description}</p>
      <p className="font-bold mt-1">{formattedPrice}</p>
      <button
        onClick={handleAddToCartClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        disabled={addingToCart}
      >
        {addingToCart ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Product;

