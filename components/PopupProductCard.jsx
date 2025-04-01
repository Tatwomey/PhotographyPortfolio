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

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find(v => v.id === e.target.value);
    setSelectedVariant(variant);
  };

  const triggerKlaviyoForm = () => {
    if (window?._klOnsite) {
      window._klOnsite.push(['openForm', 'RjNi3C']);
    }
  };

  return (
    <>
      <div
        className="relative w-full bg-white group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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

        {isSoldOut && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
            Sold out
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
          <p className="text-sm font-semibold">{product.title}</p>
          <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>
        </div>

        {hovered && !isSoldOut && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center space-x-2 z-10">
            <select
              onChange={handleVariantChange}
              value={selectedVariant?.id}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black text-xs px-2 py-1 rounded flex-1"
            >
              {product.variantOptions.map((variant) => (
                <option key={variant.id} value={variant.id}>{variant.title}</option>
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

        {hovered && isSoldOut && (
          <button
            onClick={triggerKlaviyoForm}
            className="absolute bottom-2 left-2 right-2 text-xs px-4 py-1 rounded bg-gray-200 text-black font-semibold z-10"
          >
            Notify Me
          </button>
        )}

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
