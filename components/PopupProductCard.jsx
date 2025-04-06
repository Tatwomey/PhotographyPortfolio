import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';
import PopupProductQuickView from './PopupProductQuickView';

const PopupProductCard = ({ product }) => {
  const { handleAddToCart, loading } = useShopContext();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions?.[0]);

  const hasAltImage = !!product.altImageSrc;
  const isSoldOut = !product.availableForSale;

  const handleAdd = (e) => {
    e.preventDefault();
    if (selectedVariant?.id) {
      handleAddToCart(selectedVariant.id, 1);
    }
  };

  const handleVariantChange = (variantId) => {
    const variant = product.variantOptions.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  // Safely extract unique color values from selectedOptions
  const colorOptions = product.variantOptions
    .map((v) => {
      if (!v?.selectedOptions) return null;
      const match = v.selectedOptions.find((opt) => opt.name === "Color");
      return match?.value || null;
    })
    .filter(Boolean);

  const uniqueColors = [...new Set(colorOptions)];

  return (
    <>
      <div
        className="relative w-full bg-white group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
            Sold out
          </div>
        )}

        <Link
          href={`/popup/${product.handle}`}
          className="block aspect-[4/5] w-full overflow-hidden relative"
        >
          <Image
            src={hovered && hasAltImage ? product.altImageSrc : product.imageSrc}
            alt={product.imageAlt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-md transition duration-300 ease-in-out"
            unoptimized
          />
        </Link>

        {/* Title & Price */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>
        </div>

        {/* Swatch Selectors */}
        {uniqueColors.length > 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {product.variantOptions.map((variant) => {
              const colorObj = variant.selectedOptions?.find((opt) => opt.name === 'Color');
              if (!colorObj) return null;
              return (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleVariantChange(variant.id);
                  }}
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedVariant?.id === variant.id ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor:
                      colorObj.value === 'Monochrome' ? '#000' :
                      colorObj.value === 'Regular' ? '#ccc' :
                      '#eee',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Variant Selector + Add to Cart */}
        {!isSoldOut && hovered && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center space-x-2 z-10">
            <select
              onChange={(e) => handleVariantChange(e.target.value)}
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

            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-white text-black text-xs font-semibold px-4 py-1 rounded flex-1"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}

        {/* Quick View */}
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10"
          >
            Quick View
          </button>
        )}
      </div>

      {/* Modal */}
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
