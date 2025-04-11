import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useShopContext } from "@/contexts/shopContext";

export default function PopupProductQuickView({ product, onClose }) {
  if (!product || !product.variants || product.variants.length === 0) return null;

  const {
    title,
    description,
    images,
    variants,
    handle,
  } = product;

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useShopContext();

  const handleVariantChange = (e) => {
    const variant = variants.find((v) => v.id === e.target.value);
    setSelectedVariant(variant);
    const imageIndex = images.findIndex(
      (img) => img.src === variant.image?.src
    );
    if (imageIndex !== -1) setSelectedImageIndex(imageIndex);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-95 overflow-y-auto flex justify-center items-center px-4 py-8">
      <div className="relative w-full max-w-5xl bg-white shadow-lg rounded-lg grid md:grid-cols-2 gap-6 p-4 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:scale-110 transition"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="relative">
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full shadow-md hover:scale-105"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full shadow-md hover:scale-105"
              >
                <ChevronRight />
              </button>
            </>
          )}
          <Image
            src={images[selectedImageIndex].src}
            alt={title}
            width={800}
            height={1000}
            className="w-full h-auto object-contain rounded-md"
          />
          <div className="flex mt-4 gap-2 justify-center">
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img.src}
                alt={`thumb-${idx}`}
                width={80}
                height={100}
                onClick={() => setSelectedImageIndex(idx)}
                className={`cursor-pointer border rounded-md ${idx === selectedImageIndex ? "border-black" : "border-transparent"}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="italic text-gray-600 mt-1">{description}</p>
            <p className="text-xl font-bold mt-4">
              ${parseFloat(selectedVariant.price).toFixed(2)}
            </p>

            {/* Variant Dropdown */}
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

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => addToCart(selectedVariant.id, 1)}
                className="bg-black text-white py-2 px-4 rounded-md hover:opacity-90 transition"
              >
                Add to Cart
              </button>
              <button className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:opacity-90 transition">
                Buy It Now
              </button>
            </div>

            <p className="text-sm mt-2 text-gray-700">
              Limited to 2 units per customer.
            </p>

            {/* View Product Details Only */}
            <Link href={`/popup/${handle}`}>
              <span className="block text-center mt-4 text-black font-medium relative w-fit mx-auto cursor-pointer group">
                VIEW PRODUCT DETAILS
                <span className="absolute bottom-0 left-1/2 w-0 group-hover:w-full group-hover:left-0 h-[2px] bg-black transition-all duration-300 ease-out"></span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
