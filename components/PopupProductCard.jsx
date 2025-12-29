// components/PopupProductCard.jsx
import { useMemo, useState } from "react";
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

  const hoverImage = product?.altImageSrc || product?.imageSrc;

  const displayPrice = useMemo(() => {
    const raw = product?.variantOptions?.[0]?.price?.amount ?? "0";
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
  }, [product]);

  const isSoldOut = !product?.availableForSale;

  const handleCardClick = () => {
    if (onProductClick) onProductClick(product);

    pushDataLayer({
      event: "product_click",
      portfolio_id: portfolioId,
      store_section: "popup",
      product_id: product?.handle,
      product_title: product?.title,
      sold_out: isSoldOut,
      click_source: "popup_grid",
    });
  };

  const handleQuickView = (e) => {
    // Critical: stop the link navigation
    e.preventDefault();
    e.stopPropagation();

    if (onQuickView) onQuickView(product);

    pushDataLayer({
      event: "quick_view_open",
      portfolio_id: portfolioId,
      store_section: "popup",
      product_id: product?.handle,
      product_title: product?.title,
      ui_action: "quick_view",
      view_context: "popup_grid",
    });
  };

  return (
    // ✅ Add `group` so group-hover works
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Card link */}
      <Link
        href={`/popup/${product.handle}`}
        onClick={handleCardClick}
        className="block cursor-pointer">
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg shadow">
          <Image
            src={isHovered ? hoverImage : product.imageSrc}
            alt={product.imageAlt || product.title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority
          />

          {isSoldOut && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
              Sold Out
            </div>
          )}

          {/* Hover wash that does NOT block clicks */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition z-10 pointer-events-none" />
        </div>

        <div className="mt-2 px-1">
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">${displayPrice}</p>
        </div>
      </Link>

      {/* ✅ Quick View overlay ABOVE the link, but only the button captures clicks */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          onClick={handleQuickView}
          // Desktop: appears on hover. Mobile: lightly visible by default.
          className="
pointer-events-auto
text-white text-xs font-medium
bg-black/80
px-4 py-2 rounded shadow
transition
opacity-90 md:opacity-0
md:group-hover:opacity-100
focus:opacity-100
focus:outline-none
"
          aria-label="Quick View">
          Quick View
        </button>
      </div>
    </div>
  );
}
