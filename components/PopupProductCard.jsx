import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';
import PopupProductQuickView from './PopupProductQuickView';

const PopupProductCard = ({ product }) => {
  const { handleAddToCart, loading } = useShopContext();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variantOptions?.length ? product.variantOptions[0] : null
  );
  

  const hasAltImage = !!product.altImageSrc;

  return (
    <>
      <div
        className="group w-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={`/popup/${product.handle}`}
          className="block w-full aspect-[4/5] relative overflow-hidden bg-gray-100 rounded-md"
        >
          <Image
            src={hovered && hasAltImage ? product.altImageSrc : product.imageSrc}
            alt={product.imageAlt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition duration-300 ease-in-out"
            unoptimized
          />
        </Link>

        {/* Title and Price below image */}
        <div className="mt-2 text-left px-1">
          <h3 className="text-sm font-semibold text-black truncate">{product.title}</h3>
          <p className="text-xs text-gray-700">
            ${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}
          </p>
        </div>

        {/* Optional: Quick View */}
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10"
          >
            Quick View
          </button>
        )}
      </div>

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
