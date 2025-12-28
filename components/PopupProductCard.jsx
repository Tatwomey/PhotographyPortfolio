import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export default function PopupProductCard({
  product,
  portfolioId = "popup_index",
  onProductClick,
  onQuickView,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const hoverImage = product.altImageSrc || product.imageSrc;

  const displayPrice = useMemo(() => {
    const raw = product?.variantOptions?.[0]?.price?.amount ?? "0";
    return Number.parseFloat(raw).toFixed(2);
  }, [product]);

  const isSoldOut = !product?.availableForSale;

  const handleCardClick = () => {
    // external hook
    if (onProductClick) onProductClick();

    // internal safety event (in case you forget to pass handlers)
    pushDataLayer({
      event: "product_click",
      portfolio_id: portfolioId,
      product_id: product.handle,
      product_title: product.title,
      sold_out: isSoldOut,
      click_source: "popup_grid",
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onQuickView) onQuickView();

    pushDataLayer({
      event: "quick_view_open_intent",
      portfolio_id: portfolioId,
      product_id: product.handle,
      product_title: product.title,
    });
  };

  return (
    <div
      className="relative group w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={`/popup/${product.handle}`}
        onClick={handleCardClick}
        className="block">
        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden rounded-lg shadow">
          <Image
            src={isHovered ? hoverImage : product.imageSrc}
            alt={product.imageAlt || product.title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority
          />

          {isSoldOut && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Sold Out
            </div>
          )}

          {/* Quick View overlay button */}
          <button
            type="button"
            onClick={handleQuickView}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-200"
            aria-label="Quick View">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black px-4 py-2 rounded shadow transition">
              Quick View
            </span>
          </button>
        </div>

        <div className="mt-2 px-1">
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">${displayPrice}</p>
        </div>
      </Link>
    </div>
  );
}
