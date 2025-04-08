import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';
import PopupProductQuickView from './PopupProductQuickView';

const PopupProductCard = ({ product }) => {
  const { handleAddToCart, loading } = useShopContext();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Get default variant (prefer "Regular" color)
  const getDefaultVariant = () => {
    return (
      product.variantOptions.find((v) =>
        v.selectedOptions?.some(
          (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === 'regular'
        )
      ) || product.variantOptions[0]
    );
  };

  const [selectedVariant, setSelectedVariant] = useState(getDefaultVariant());

  const isSoldOut = !product.availableForSale;
  const hasAltImage = !!product.altImageSrc;

  const handleVariantChange = (variantId) => {
    const variant = product.variantOptions.find((v) => v.id === variantId);
    if (variant) setSelectedVariant(variant);
  };

  // Extract unique colors
  const colorOptions = product.variantOptions
    .map((v) => v.selectedOptions?.find((opt) => opt.name.toLowerCase() === 'color')?.value || null)
    .filter(Boolean);
  const uniqueColors = [...new Set(colorOptions)];

  const displayImage =
    hovered && hasAltImage
      ? product.altImageSrc
      : selectedVariant?.image?.src || product.imageSrc;

  return (
    <>
      <div
        className="relative w-full bg-white group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Sold Out badge */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
            Sold out
          </div>
        )}

        {/* Product image with link */}
        <Link
          href={`/popup/${product.handle}`}
          className="block aspect-[4/5] w-full overflow-hidden relative"
        >
          <Image
            src={displayImage}
            alt={product.imageAlt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-md transition duration-300 ease-in-out"
            unoptimized
          />
        </Link>

        {/* Title, price, color swatches */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>

          {uniqueColors.length > 1 && (
            <div className="flex justify-end gap-1 mt-1">
              {product.variantOptions.map((variant) => {
                const color = variant.selectedOptions?.find(
                  (opt) => opt.name.toLowerCase() === 'color'
                )?.value;
                if (!color) return null;

                return (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVariantChange(variant.id);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      selectedVariant?.id === variant.id
                        ? 'border-white ring-2 ring-white'
                        : 'border-gray-400'
                    }`}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === 'monochrome'
                          ? '#000'
                          : color.toLowerCase() === 'regular'
                          ? '#e5e5e5'
                          : '#ccc',
                    }}
                    aria-label={color}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Quick View */}
        {hovered && (
          <button
            onClick={(e) => {
              e.preventDefault();
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
