import { useState } from "react";
import Image from "next/image";
import PopupProductQuickView from "./PopupProductQuickView";

export default function PopupProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize product for modal
  const normalizedProduct = {
    title: product.title,
    handle: product.handle,
    description: product.description,
    images: product.allImages?.map((src) => ({ src })) || [],
    variants: product.variantOptions?.map((variant) => ({
      id: variant.id,
      title: variant.title,
      price: variant.price.amount,
      image: variant.image,
      availableForSale: variant.availableForSale,
      selectedOptions: variant.selectedOptions,
    })) || [],
  };

  const defaultVariant = normalizedProduct.variants[0];
  const isSoldOut = !defaultVariant?.availableForSale;
  const displayPrice = parseFloat(defaultVariant?.price || "0.00").toFixed(2);

  const hoverImage = product.altImageSrc || product.imageSrc;

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden rounded-lg shadow">
          <Image
            src={isHovered ? hoverImage : product.imageSrc}
            alt={product.imageAlt}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />

          {/* Sold Out Badge */}
          {isSoldOut && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Sold Out
            </div>
          )}

          {/* Quick View Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black px-4 py-2 rounded shadow transition">
              Quick View
            </span>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">${displayPrice}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PopupProductQuickView
          product={normalizedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
