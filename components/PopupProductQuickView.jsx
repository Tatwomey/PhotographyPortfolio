import React, { useState } from "react";
import Image from "next/image";

const PopupProductQuickView = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedVariantId, setSelectedVariantId] = useState(product.variantId);

  const selectedVariant =
    product.variantOptions.find((v) => v.id === selectedVariantId) || product.variantOptions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4 py-10 overflow-y-auto">
      <div className="bg-white text-black rounded-lg max-w-4xl w-full relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="relative w-full md:w-1/2 aspect-[4/5] rounded overflow-hidden">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              layout="fill"
              objectFit="cover"
              className="rounded"
              unoptimized
            />
          </div>

          <div className="flex flex-col md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-sm text-gray-700">{product.description}</p>
            <p className="text-xl font-bold">
              {parseFloat(selectedVariant.price.amount).toFixed(2)} {selectedVariant.price.currencyCode}
            </p>

            <select
              className="p-2 border border-gray-300 rounded"
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
            >
              {product.variantOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.options[0]?.value || "One Size"}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                onAddToCart({
                  ...product,
                  variantId: selectedVariantId,
                })
              }
              className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-all"
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
