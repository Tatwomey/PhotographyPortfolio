import React, { useState } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/contexts/ShopContext';

const ProductCard = ({ product, onQuickView }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.id || '');
  const { handleAddToCart, loading, cart } = useShopContext();

  const handleAdd = async () => {
    if (loading || !cart) return;
    try {
      await handleAddToCart(selectedSize, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <div
      className="relative group overflow-hidden border border-gray-800 bg-white text-black rounded-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full aspect-[4/5] relative">
        <Image
          src={hovered ? product.altImageSrc : product.imageSrc}
          alt={product.imageAlt}
          layout="fill"
          objectFit="cover"
          className="transition duration-300 ease-in-out"
          unoptimized
        />
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-2 right-2 bg-white text-black text-xs px-2 py-1 rounded shadow hover:bg-black hover:text-white transition"
        >
          Quick View
        </button>
      </div>

      <div className="p-4">
        {!hovered && (
          <>
            <h3 className="text-lg font-medium truncate">{product.title}</h3>
            <p className="text-sm">${parseFloat(product.price).toFixed(2)}</p>
          </>
        )}

        {hovered && (
          <div className="space-y-2">
            <select
              className="w-full border border-gray-300 rounded p-2 text-sm"
              onChange={(e) => setSelectedSize(e.target.value)}
              value={selectedSize}
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              className="w-full bg-black text-white text-sm py-2 px-4 rounded hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
