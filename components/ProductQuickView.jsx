import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ProductQuickView = ({ product, selectedVariant: initialVariant, onClose, onAddToCart }) => {
  const [mainImage, setMainImage] = useState(
    initialVariant?.image?.src || product.imageSrc
  );
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || product.variantOptions[0]);

  useEffect(() => {
    if (initialVariant?.image?.src) {
      setMainImage(initialVariant.image.src);
    } else if (product.imageSrc) {
      setMainImage(product.imageSrc);
    }
  }, [initialVariant, product]);

  const isSoldOut = !selectedVariant?.availableForSale;

  const handleBackgroundClick = (e) => {
    if (e.target.id === 'quick-view-backdrop') {
      closeQuickView();
    }
  };

  const closeQuickView = () => {
    document.body.classList.remove('form-open');
    onClose();
  };

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find((v) => v.id === e.target.value);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.imageSrc);
    }
  };

  const handleNotifyMeClick = () => {
    if (typeof window !== 'undefined') {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(['openForm', 'RjNi3C']);
      document.body.classList.add('form-open');
    }
  };

  const price = selectedVariant?.price?.amount;
  const currency = selectedVariant?.price?.currencyCode || 'USD';
  const formattedPrice = price ? `$${parseFloat(price).toFixed(2)} ${currency}` : 'Unavailable';

  return (
    <div
      id="quick-view-backdrop"
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white text-black max-w-4xl w-full rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* LEFT: Image */}
        <div className="md:w-1/2 relative h-96 md:h-auto">
          <Image
            src={mainImage}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
            unoptimized
          />
        </div>

        {/* RIGHT: Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-lg font-semibold mb-4">{formattedPrice}</p>

            {/* Edition / Size Dropdown */}
            {product.variantOptions.length > 1 && (
              <div className="mb-4">
                <label htmlFor="variant-select" className="block text-sm font-medium mb-1">
                  Edition / Size
                </label>
                <select
                  id="variant-select"
                  value={selectedVariant?.id}
                  onChange={handleVariantChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {product.variantOptions.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {isSoldOut ? (
              <button
                onClick={handleNotifyMeClick}
                className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 native-notify-button"
              >
                Notify Me When Available
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(selectedVariant)}
                className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={closeQuickView}
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
