import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const ProductQuickView = ({ product, selectedVariant: initialVariant, onClose, onAddToCart }) => {
  const [mainImage, setMainImage] = useState(initialVariant?.image?.src || product.imageSrc);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || product.variantOptions[0]);

  useEffect(() => {
    if (initialVariant?.image?.src) {
      setMainImage(initialVariant.image.src);
    } else if (product.imageSrc) {
      setMainImage(product.imageSrc);
    }
  }, [initialVariant, product]);

  const isSoldOut = !selectedVariant?.availableForSale;

  const handleVariantChange = (e) => {
    const variant = product.variantOptions.find((v) => v.id === e.target.value);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.imageSrc);
    }
  };

  const handleNotifyClick = () => {
    if (typeof window !== 'undefined') {
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(['openForm', 'RjNi3C']);
      document.body.classList.add('form-open');
    }
  };

  const handleClose = () => {
    document.body.classList.remove('form-open');
    onClose();
  };

  return (
    <div className="quickview-modal" onClick={(e) => e.target.classList.contains('quickview-modal') && handleClose()}>
      <div className="quickview-modal-content">
        {/* Left - Image section */}
        <div className="quickview-image-section">
          <button onClick={handleClose} className="quickview-close-btn" aria-label="Close quick view">
            <X size={28} />
          </button>

          <div className="quickview-main-image-wrapper">
            <img src={mainImage} alt={product.title} />
          </div>

          {product.allImages?.length > 1 && (
            <div className="quickview-thumbnails">
              {product.allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={img === mainImage ? 'active' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="quickview-details-section">
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
          <p className="text-lg font-semibold mb-4">
            ${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}
          </p>

          {/* Variant selector */}
          {product.variantOptions.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Edition / Size</label>
              <select
                value={selectedVariant?.id}
                onChange={handleVariantChange}
                className="w-full border rounded p-2"
              >
                {product.variantOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-3">
            {isSoldOut ? (
              <button
                onClick={handleNotifyClick}
                className="w-full bg-black text-white py-3 rounded native-notify-button"
              >
                Notify Me When Available
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(selectedVariant)}
                className="w-full bg-black text-white py-3 rounded"
              >
                Add to Cart
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-full border border-black py-3 rounded text-black bg-white hover:bg-gray-100"
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
