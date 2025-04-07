import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';

const PopupProductQuickView = ({ product, selectedVariant, onClose }) => {
  const { handleAddToCart } = useShopContext();
  const [mainImage, setMainImage] = useState(selectedVariant?.image?.src || product.imageSrc);
  const [variant, setVariant] = useState(selectedVariant || product.variantOptions[0]);

  useEffect(() => {
    if (selectedVariant?.image?.src) {
      setMainImage(selectedVariant.image.src);
      setVariant(selectedVariant);
    }
  }, [selectedVariant]);

  const handleVariantChange = (variantId) => {
    const newVariant = product.variantOptions.find((v) => v.id === variantId);
    if (newVariant) {
      setVariant(newVariant);
      setMainImage(newVariant.image?.src || product.imageSrc);
    }
  };

  const getColorSwatches = () => {
    const seen = new Set();
    return product.variantOptions.filter((v) => {
      const color = v.selectedOptions?.find((opt) => opt.name === 'Color')?.value;
      if (!color || seen.has(color)) return false;
      seen.add(color);
      return true;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg relative p-6 text-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] bg-gray-100 rounded overflow-hidden">
              <Image
                src={mainImage}
                alt={product.imageAlt || product.title}
                layout="fill"
                objectFit="cover"
                className="rounded"
                unoptimized
              />
            </div>

            {/* Thumbnails */}
            {product.allImages?.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.allImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(src)}
                    className={`w-16 h-20 border rounded overflow-hidden ${
                      mainImage === src ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thumb ${idx}`}
                      width={64}
                      height={80}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-1">{product.title}</h2>
            <p className="text-gray-700 mb-3 text-sm">{product.description}</p>

            <p className="text-lg font-semibold mb-3">
              ${parseFloat(variant?.price?.amount || 0).toFixed(2)}
            </p>

            {/* Color Swatches */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex gap-2">
                {getColorSwatches().map((v) => {
                  const color = v.selectedOptions?.find((opt) => opt.name === 'Color')?.value;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(v.id)}
                      className={`w-5 h-5 rounded-full border-2 ${
                        variant?.id === v.id
                          ? 'border-black ring-2 ring-black'
                          : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor:
                          color === 'Monochrome' ? '#000' : color === 'Regular' ? '#e5e5e5' : '#ccc',
                      }}
                      aria-label={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Variant Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Edition / Size</label>
              <select
                value={variant?.id}
                onChange={(e) => handleVariantChange(e.target.value)}
                className="w-full border rounded p-2"
              >
                {product.variantOptions
                  .filter((v) => {
                    const selectedColor = variant.selectedOptions?.find(
                      (opt) => opt.name === 'Color'
                    )?.value;
                    const thisColor = v.selectedOptions?.find((opt) => opt.name === 'Color')?.value;
                    return selectedColor === thisColor;
                  })
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Buttons */}
            <button
              onClick={() => handleAddToCart(variant.id, 1)}
              className="w-full bg-black text-white py-3 rounded text-lg font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupProductQuickView;
