import { useState, useEffect } from "react";
import Image from "next/image";
import { useShopContext } from "@/contexts/shopContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PopupProductQuickView({ product, onClose }) {
  const {
    addItemToCart,
    openCart,
    checkoutUrl,
    cart,
  } = useShopContext();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] || null
  );

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleArrowClick = (direction) => {
    const total = product.images.length;
    if (direction === "left") {
      setSelectedImageIndex((prev) => (prev - 1 + total) % total);
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % total);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItemToCart(selectedVariant.id, 1);
      openCart();
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant) {
      addItemToCart(selectedVariant.id, 1);
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 300);
    }
  };

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  return (
    <div className="quickview-modal">
      <div className="quickview-modal-content grid md:grid-cols-2 gap-8 px-4 md:px-8 py-6 max-w-7xl mx-auto justify-center">
        {/* Left Column: Image Section */}
        <div>
          <div className="quickview-main-image-wrapper relative">
            <Image
              src={product.images[selectedImageIndex]?.src || "/placeholder.jpg"}
              alt={product.title}
              width={600}
              height={750}
              className="object-contain rounded-lg"
              priority
            />
            {product.images.length > 1 && (
              <>
                <div
                  className="modal-arrow left"
                  onClick={() => handleArrowClick("left")}
                >
                  <ChevronLeft />
                </div>
                <div
                  className="modal-arrow right"
                  onClick={() => handleArrowClick("right")}
                >
                  <ChevronRight />
                </div>
              </>
            )}
          </div>

          <div className="quickview-thumbnails mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={`${product.title} thumbnail ${index}`}
                className={`thumbnail-image ${selectedImageIndex === index ? "active" : ""}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="relative w-full flex flex-col justify-center">
          <button className="quickview-close-btn" onClick={onClose}>
            <X />
          </button>

          <div className="max-w-sm w-full mx-auto space-y-4">
            <h2 className="text-xl font-semibold">{product.title}</h2>
            {product.subtitle && (
              <p className="italic text-sm text-gray-600">{product.subtitle}</p>
            )}

            <p className="text-lg font-medium text-gray-900">
              {selectedVariant?.price
                ? `$${Number(selectedVariant.price).toFixed(2)}`
                : "$0.00"}
            </p>

            {product.variants.length > 1 && (
              <div>
                <label htmlFor="variant-select" className="block mb-1 font-medium">
                  Edition / Size
                </label>
                <select
                  id="variant-select"
                  className="w-full p-2 border rounded"
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const variant = product.variants.find(
                      (v) => v.id === e.target.value
                    );
                    if (variant) setSelectedVariant(variant);
                  }}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                className="add-to-cart-btn w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                Add to Cart
              </button>

              <button
                className="checkout-button w-full"
                onClick={handleBuyNow}
                disabled={!selectedVariant}
              >
                Buy It Now
              </button>
            </div>

            <p className="text-xs text-center text-gray-600">
              Limited to 2 units per customer.
            </p>

            <p className="text-center text-sm underline cursor-pointer">
              VIEW PRODUCT DETAILS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
