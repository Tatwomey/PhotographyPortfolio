// components/PopupProductCard.jsx
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function formatMoney(amount, currencyCode = "USD") {
  const n = Number.parseFloat(amount ?? "0");
  const safe = Number.isFinite(n) ? n : 0;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `${currencyCode || "USD"} ${safe.toFixed(2)}`;
  }
}

function getProductVariants(product) {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return product.variants;
  }

  if (Array.isArray(product?.variantOptions) && product.variantOptions.length) {
    return product.variantOptions;
  }

  return [];
}

function getVariantAmount(variant) {
  return (
    variant?.price?.amount ?? variant?.priceV2?.amount ?? variant?.price ?? "0"
  );
}

function getVariantCurrencyCode(variant) {
  return (
    variant?.price?.currencyCode ?? variant?.priceV2?.currencyCode ?? "USD"
  );
}

function getVariantAvailable(variant) {
  if (typeof variant?.availableForSale === "boolean") {
    return variant.availableForSale;
  }

  if (typeof variant?.available === "boolean") {
    return variant.available;
  }

  return true;
}

export default function PopupProductCard({
  product,
  portfolioId = "popup_index",
  onProductClick,
  onQuickView,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = useMemo(() => getProductVariants(product), [product]);

  const hoverImage = product?.altImageSrc || product?.imageSrc;

  const firstVariant = variants?.[0] || null;

  const displayPrice = useMemo(() => {
    const amount = getVariantAmount(firstVariant);
    const currencyCode = getVariantCurrencyCode(firstVariant);

    return formatMoney(amount, currencyCode);
  }, [firstVariant]);

  const priceAmount = useMemo(() => {
    const n = Number.parseFloat(getVariantAmount(firstVariant));
    return Number.isFinite(n) ? n : 0;
  }, [firstVariant]);

  const currencyCode = useMemo(() => {
    return getVariantCurrencyCode(firstVariant);
  }, [firstVariant]);

  const isSoldOut = useMemo(() => {
    if (product?.availableForSale === false) return true;
    if (!variants.length) return false;

    return variants.every((variant) => getVariantAvailable(variant) === false);
  }, [product, variants]);

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
      currency: currencyCode,
      value: priceAmount,
    });
  };

  const handleQuickView = (e) => {
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
      currency: currencyCode,
      value: priceAmount,
    });
  };

  if (!product) return null;

  return (
    <div
      className="relative w-full group product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={`/popup/${product.handle}`}
        onClick={handleCardClick}
        className="block cursor-pointer">
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg shadow product-card-image">
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

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition z-10 pointer-events-none" />
        </div>

        <div className="mt-2 px-1">
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">{displayPrice}</p>
        </div>
      </Link>

      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          onClick={handleQuickView}
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
