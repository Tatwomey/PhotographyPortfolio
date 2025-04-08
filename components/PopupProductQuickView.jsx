import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';

const PopupProductQuickView = ({ product, selectedVariant: initialVariant, onClose }) => {
  const { handleAddToCart, loading } = useShopContext();

  const getDefaultVariant = () => {
    return (
      product.variantOptions.find((v) =>
        v.selectedOptions?.some(
          (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === 'regular'
        )
      ) || product.variantOptions[0]
    );
  };

  const [selectedVariant, setSelectedVariant] = useState(initialVariant || getDefaultVariant());
  const [mainImage, setMainImage] = useState(selectedVariant?.image?.src || product.imageSrc);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const colorOptions = Array.from(
    new Set(
      product.variantOptions
        .map((v) =>
          v.selectedOptions?.find((opt) => opt.name.toLowerCase() === 'color')?.value
        )
        .filter(Boolean)
    )
  );

  const [selectedColor, setSelectedColor] = useState(
    selectedVariant?.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color')?.value
  );

  const variantsForColor = product.variantOptions.filter((v) =>
    v.selectedOptions.some(
      (opt) => opt.name.toLowerCase() === 'color' && opt.value === selectedColor
    )
  );

  useEffect(() => {
    const variant = variantsForColor[0];
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.imageSrc);
    }
  }, [selectedColor]);

  useEffect(() => {
    const escape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [onClose]);

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find((v) => v.id === e.target.value);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.imageSrc);

      const colorOpt = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === 'color'
      );
      if (colorOpt?.value) {
        setSelectedColor(colorOpt.value);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    window.location.href = '/checkout';
  };

  const handleNotifyClick = () => {
    if (window._klOnsite) {
      window._klOnsite.push(['openForm', 'RjNi3C']);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 max-w-4xl w-full rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-xl font-bold"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Gallery */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] bg-gray-100 rounded overflow-hidden shadow">
              <Image
                src={mainImage}
                alt={selectedVariant?.title || product.title}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>

            {/* Thumbnails */}
            {product.allImages?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(img);
                      setCurrentImageIdx(idx);
                    }}
                    className={`w-[60px] h-[75px] border rounded-md overflow-hidden ${
                      currentImageIdx === idx ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} width={60} height={75} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold">{product.title}</h2>
            <p className="text-sm italic text-gray-600">{product.description}</p>
            <p className="text-xl font-bold">
              ${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}
            </p>

            {/* Color Swatches */}
            {colorOptions.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === color
                          ? 'border-black ring-2 ring-black'
                          : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor:
                          color.toLowerCase() === 'monochrome' ? '#000' : '#e5e5e5',
                      }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Edition / Size */}
            {variantsForColor.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">Edition / Size</label>
                <select
                  value={selectedVariant?.id}
                  onChange={handleVariantChange}
                  className="w-full border rounded p-2"
                >
                  {variantsForColor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {selectedVariant?.availableForSale ? (
                <>
                  <button
                    onClick={() => handleAddToCart(selectedVariant.id, 1)}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded text-lg font-medium"
                  >
                    {loading ? 'Adding…' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-yellow-400 text-black py-2 rounded text-lg font-semibold"
                  >
                    Buy It Now
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNotifyClick}
                  className="w-full border border-black py-2 rounded text-lg font-semibold hover:bg-gray-100"
                >
                  Notify Me When Back in Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupProductQuickView;
