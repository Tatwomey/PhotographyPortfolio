import { useState, useEffect } from "react";
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

  return (
    <div className="fixed inset-0 z-50 bg-white text-black overflow-y-auto flex flex-col md:flex-row">
      {/* ❌ Close Button - Always Visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-black text-white p-2 rounded-full"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* 🖼️ Image Section */}
      <div className="w-full md:w-1/2 relative p-4 flex flex-col items-center justify-start">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow md:left-4"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow md:right-4"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="relative w-full h-[60vh] max-h-[70vh] bg-gray-100 rounded overflow-hidden">
          <Image
            src={images[selectedImageIndex]?.src}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full px-1">
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img.src}
                alt={`thumb-${idx}`}
                width={60}
                height={80}
                onClick={() => setSelectedImageIndex(idx)}
                className={`cursor-pointer border ${
                  selectedImageIndex === idx
                    ? "border-black"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 📋 Product Info Section */}
      <div className="w-full md:w-1/2 px-6 py-6 flex flex-col justify-start">
        <h2 className="text-2xl font-bold">{title}</h2>

        {description && (
          <p className="text-gray-600 italic mt-2">{description}</p>
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

        {/* 🔗 View Details */}
        <Link href={`/popup/${handle}#product-details`}>
          <span className="block text-center mt-5 text-black font-medium relative w-fit mx-auto cursor-pointer group">
            VIEW PRODUCT DETAILS
            <span className="absolute bottom-0 left-1/2 w-0 group-hover:w-full group-hover:left-0 h-[2px] bg-black transition-all duration-300 ease-out" />
          </span>
        </Link>
      </div>
    </div>
  );
}
