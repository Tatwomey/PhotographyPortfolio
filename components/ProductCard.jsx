import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product }) => {
  const { handleAddToCart, loading } = useShopContext();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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

  const getVariantByColor = (color) =>
    product.variantOptions.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === color.toLowerCase()
      )
    );

  const handleSwatchClick = (color) => {
    const variant = getVariantByColor(color);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const displayImage =
    hovered && product.altImageSrc
      ? product.altImageSrc
      : selectedVariant?.image?.src || product.imageSrc;

  const colorOptions = product.variantOptions
    .map((v) => v.selectedOptions?.find((opt) => opt.name.toLowerCase() === 'color')?.value || null)
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

        {/* Image */}
        <Link
          href={`/shop/${product.handle}`}
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

        {/* Color Swatches */}
        {uniqueColors.length > 1 && (
          <div className="absolute bottom-[54px] right-2 flex gap-1 z-10">
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
                    handleSwatchClick(color);
                  }}
                  className={`w-4 h-4 rounded-full border-2 shadow ${
                    selectedVariant?.id === variant.id
                      ? 'border-black ring-2 ring-black'
                      : 'border-gray-300'
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

        {/* Title + Price */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>
        </div>

        {/* Hover Add-to-Cart + Variant Selector */}
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
        <ProductQuickView
          product={product}
          selectedVariant={selectedVariant}
          onClose={() => setQuickViewOpen(false)}
          onAddToCart={(variant) => handleAddToCart(variant.id, 1)}
        />
      )}
    </>
  );
};

export default ProductCard;
