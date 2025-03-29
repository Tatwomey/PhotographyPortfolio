import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ProductQuickView = ({ product, onClose, onAddToCart }) => {
  const [mainImage, setMainImage] = useState(product.imageSrc);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  useEffect(() => {
    if (product.imageSrc) {
      setMainImage(product.imageSrc);
    }
  }, [product]);

  const handleBackgroundClick = (e) => {
    if (e.target.id === 'quick-view-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="quick-view-backdrop"
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white text-black max-w-4xl w-full rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-96 md:h-auto">
          <Image
            src={mainImage}
            alt="Quick view product"
            layout="fill"
            objectFit="contain"
            className="rounded-l-lg"
            unoptimized
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-lg font-semibold mb-4">
              {selectedVariant.priceV2.amount} {selectedVariant.priceV2.currencyCode}
            </p>
            <div className="mb-4">
              <label htmlFor="variant-select" className="block text-sm font-medium mb-1">
                Select Size
              </label>
              <select
                id="variant-select"
                value={selectedVariant.id}
                onChange={(e) => {
                  const variant = product.variants.find((v) => v.id === e.target.value);
                  setSelectedVariant(variant);
                }}
                className="w-full border border-gray-300 rounded p-2"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {(variant.selectedOptions?.find((o) => o.name === 'Size')?.value) || variant.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(selectedVariant)}
              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="w-full border border-black px-4 py-2 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
