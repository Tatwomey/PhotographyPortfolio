import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopContext } from '@/contexts/ShopContext';
import PopupProductQuickView from './PopupProductQuickView';

const PopupProductCard = ({ product }) => {
  const { handleAddToCart, loading } = useShopContext();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);

  const hasAltImage = !!product.altImageSrc;

  const handleAdd = (e) => {
    e.preventDefault();
    if (selectedVariant?.id) {
      handleAddToCart(selectedVariant.id, 1);
    }
  };

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find(v => v.id === e.target.value);
    setSelectedVariant(variant);
  };

  return (
    <>
      <div
        className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product Image and Link */}
        <Link href={`/popup/${product.handle}`} passHref>
          <div className="relative w-full h-full cursor-pointer">
            <Image
              src={hovered && hasAltImage ? product.altImageSrc : product.imageSrc}
              alt={product.imageAlt}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300"
            />
          </div>
        </Link>

        {/* Title and Price - always visible, bottom right */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>
        </div>

        {/* Hover Overlay */}
        {hovered && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center space-x-2">
            {/* Size Selector */}
            <select
              onChange={handleVariantChange}
              value={selectedVariant?.id}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black text-xs px-2 py-1 rounded flex-1"
            >
              {product.variantOptions.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-white text-black text-xs font-semibold px-4 py-1 rounded flex-1"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}

        {/* Quick View Button */}
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
          >
            Quick View
          </button>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <PopupProductQuickView
          product={product}
          selectedVariant={selectedVariant}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};

export default PopupProductCard;