import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useShopContext } from "@/contexts/shopContext";

export default function PopupProductQuickView({ product, onClose }) {
  if (!product || !product.variants || product.variants.length === 0) return null;

  const { title, description, images, variants, handle } = product;
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [startY, setStartY] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const modalRef = useRef();
  const { handleAddToCart, toggleCart } = useShopContext();
  const router = useRouter();

  const handleVariantChange = (e) => {
    const variant = variants.find((v) => v.id === e.target.value);
    setSelectedVariant(variant);
    const index = images.findIndex((img) => img.src === variant.image?.src);
    if (index !== -1) setSelectedImageIndex(index);
  };

  const handleAddAndClose = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    onClose();
    toggleCart();
  };

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: selectedVariant.id, quantity: 1 }),
      });
      const { checkoutUrl } = await res.json();
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const nextImage = () =>
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // 👉 Swipe Down to Close on Mobile
  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (!startY) return;
    const currentY = e.touches[0].clientY;
    if (currentY - startY > 60) {
      setSwiping(true);
    }
  };
  const handleTouchEnd = () => {
    if (swiping) {
      onClose();
    }
    setStartY(null);
    setSwiping(false);
  };

  return (
    <div
      className="quickview-modal"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={modalRef}
        className={`quickview-modal-content ${swiping ? "swiping-down" : ""}`}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="quickview-close-btn"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* 🖼️ Image Section */}
        <div className="quickview-image-section">
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="modal-arrow left"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="modal-arrow right"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div
            className="quickview-main-image-wrapper zoom-wrapper"
            onClick={() => setZoomed((z) => !z)}
          >
            <Image
              src={images[selectedImageIndex]?.src}
              alt={title}
              fill
              className={zoomed ? "zoomed-in" : ""}
            />
          </div>

          <div className="quickview-thumbnails">
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img.src}
                alt={`thumb-${idx}`}
                width={70}
                height={90}
                onClick={() => setSelectedImageIndex(idx)}
                className={selectedImageIndex === idx ? "active" : ""}
              />
            ))}
          </div>
        </div>

        {/* 📋 Product Info Section */}
        <div className="quickview-details-section">
          <h2 className="text-xl font-semibold">{title}</h2>

          {description && (
            <p className="italic text-gray-600 mt-1">{description}</p>
          )}

          <p className="text-xl font-bold mt-4">
            ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
          </p>

          {/* 🔄 Variant Selector */}
          <div className="mt-4">
            <label htmlFor="variant" className="block mb-1 font-medium">
              Edition / Size
            </label>
            <select
              id="variant"
              value={selectedVariant.id}
              onChange={handleVariantChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>
          </div>

          {/* 🛒 Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleAddAndClose}
              className="bg-black text-white py-2 px-4 rounded-md hover:opacity-90 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:opacity-90 transition"
            >
              Buy It Now
            </button>
          </div>

          <p className="text-sm mt-3 text-gray-700">
            Limited to 2 units per customer.
          </p>

          <Link href={`/popup/${handle}#product-details`}>
            <span className="block text-center mt-5 text-black font-medium relative w-fit mx-auto cursor-pointer group">
              VIEW PRODUCT DETAILS
              <span className="absolute bottom-0 left-1/2 w-0 group-hover:w-full group-hover:left-0 h-[2px] bg-black transition-all duration-300 ease-out" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
