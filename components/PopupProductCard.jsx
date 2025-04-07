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

  const isSoldOut = !product.availableForSale;

  const getVariantByColor = (color) => {
    return product.variantOptions.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value === color
      )
    );
  };

  const handleSwatchClick = (color) => {
    const variant = getVariantByColor(color);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const colorOptions = product.variantOptions
    .map((v) =>
      v.selectedOptions?.find((opt) => opt.name.toLowerCase() === 'color')?.value || null
    )
    .filter(Boolean);

  const uniqueColors = [...new Set(colorOptions)];

  const displayImage =
    hovered && product.altImageSrc
      ? product.altImageSrc
      : selectedVariant?.image?.src || product.imageSrc;

  return (
    <>
      <div
        className="relative w-full bg-white group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
            src={displayImage}
            alt={product.imageAlt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-md transition duration-300 ease-in-out"
            unoptimized
          />
        </Link>

        {/* Title, Price, and Swatches */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">
            ${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}
          </p>

          {uniqueColors.length > 1 && (
            <div className="flex justify-end gap-1 mt-1">
              {uniqueColors.map((color) => {
                const variant = getVariantByColor(color);
                return (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSwatchClick(color);
                    }}
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedVariant?.id === variant?.id
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

        {/* Variant Dropdown + Add to Cart */}
        {!isSoldOut && hovered && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center space-x-2 z-10">
            <select
              onChange={(e) =>
                setSelectedVariant(
                  product.variantOptions.find((v) => v.id === e.target.value)
                )
              }
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
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(selectedVariant.id, 1);
              }}
              disabled={loading}
              className="bg-white text-black text-xs font-semibold px-4 py-1 rounded flex-1"
            >
              {loading ? 'Adding…' : 'Add to Cart'}
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
