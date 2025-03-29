import React, { useState } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';

const PopupProductQuickView = ({ product, onClose }) => {
  const { handleAddToCart, cart } = useShopContext();
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);
  const [loading, setLoading] = useState(false);

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find(v => v.id === e.target.value);
    setSelectedVariant(variant);
  };

  const handleAddToCartClick = async () => {
    if (!selectedVariant?.id) return;
    setLoading(true);
    await handleAddToCart(selectedVariant.id, 1);
    setLoading(false);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id || !cart?.checkoutUrl) return;
    setLoading(true);
    await handleAddToCart(selectedVariant.id, 1);
    window.location.href = cart.checkoutUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-xl mx-auto rounded-lg shadow-xl overflow-y-auto relative max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-3xl sm:text-4xl text-black"
        >
          &times;
        </button>

        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-black">
            {product.title}
          </h2>

          <div className="relative w-full h-[350px] sm:h-[500px] mb-4">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>

          {product.altImageSrc && (
            <div className="flex justify-center space-x-2 mb-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src={product.altImageSrc}
                  alt={`${product.title} alternate`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          <select
            value={selectedVariant.id}
            onChange={handleVariantChange}
            className="border border-gray-300 rounded-md py-2 px-3 mb-3 sm:mb-4 w-full text-sm sm:text-base"
          >
            {product.variantOptions.map(variant => (
              <option key={variant.id} value={variant.id}>
                {variant.title} — ${parseFloat(variant.price.amount).toFixed(2)}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <button
              onClick={handleAddToCartClick}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md text-sm sm:text-base mb-2 sm:mb-0 transition hover:bg-gray-800"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-2 rounded-md text-sm sm:text-base transition hover:bg-yellow-300"
            >
              {loading ? 'Processing...' : 'Buy It Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupProductQuickView;
