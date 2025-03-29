import { useState } from 'react';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';
import { IoChevronForward, IoChevronBack, IoClose } from 'react-icons/io5';
import { useRouter } from 'next/router';

export default function PopupProductQuickView({ product, onClose }) {
  const { handleAddToCart } = useShopContext();
  const router = useRouter();

  const images = product.allImages?.length ? product.allImages : [product.imageSrc];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);

  const prevImage = () => {
    setCurrentImageIdx((idx) => (idx > 0 ? idx - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentImageIdx((idx) => (idx < images.length - 1 ? idx + 1 : 0));
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push('/checkout');
  };

  return (
    <div className="quickview-modal">
      <div className="quickview-modal-content">
        <button className="quickview-close-btn" onClick={onClose}>
          <IoClose />
        </button>

        {/* Image Section */}
        <div className="quickview-image-section">
          {images.length > 1 && (
            <button className="modal-arrow left" onClick={prevImage}>
              <IoChevronBack size={24} />
            </button>
          )}

          <Image
            src={images[currentImageIdx]}
            alt={product.title}
            width={700}
            height={875}
            className="object-contain rounded-lg"
          />

          {images.length > 1 && (
            <button className="modal-arrow right" onClick={nextImage}>
              <IoChevronForward size={24} />
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="quickview-details-section">
          <h2 className="text-2xl font-bold text-black mb-2">{product.title}</h2>
          <p className="text-xl text-gray-700 font-semibold mb-4">
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}
          </p>

          <label className="block font-semibold mb-1 text-black">Edition / Size</label>
          <select
            className="w-full border rounded p-3 mb-4"
            value={selectedVariant.id}
            onChange={(e) =>
              setSelectedVariant(
                product.variantOptions.find((v) => v.id === e.target.value)
              )
            }
          >
            {product.variantOptions.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title} - ${parseFloat(variant.price.amount).toFixed(2)}
              </option>
            ))}
          </select>

          <button
            className="w-full bg-black text-white py-3 rounded mb-2"
            onClick={() => handleAddToCart(selectedVariant.id, 1)}
          >
            Add to Cart
          </button>

          <button
            className="w-full bg-yellow-400 text-black py-3 rounded font-semibold"
            onClick={handleBuyNow}
          >
            Buy It Now
          </button>

          {product.description && (
            <div className="mt-6 border-t pt-4 text-black">
              <h3 className="font-semibold">Description</h3>
              <p className="mt-2">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
