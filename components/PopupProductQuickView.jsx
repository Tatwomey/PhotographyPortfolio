// components/PopupProductQuickView.jsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import { useCurrency } from "@/contexts/CurrencyContext";

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
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `${currencyCode} ${safe.toFixed(2)}`;
  }
}

export default function PopupProductQuickView({ product, onClose }) {
  const { cart, loading, handleAddToCart, refreshCart, openCart } =
    useShopContext();

  const { currency } = useCurrency();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]?.id || "",
  );

  const images = product?.images || [];
  const variants = product?.variants || [];

  useEffect(() => {
    document.body.classList.add("modal-open");
    setSelectedImageIndex(0);
    setSelectedVariant(product?.variants?.[0]?.id || "");

    pushDataLayer({
      event: "quick_view_open",
      store_section: "popup",
      product_id: product?.handle,
      product_title: product?.title,
      view_context: "quick_view",
    });

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [product]);

  const selectedVariantObj = useMemo(() => {
    return (
      variants.find((v) => v.id === selectedVariant) || variants[0] || null
    );
  }, [variants, selectedVariant]);

  // ✅ FIX: your variant price is { amount, currencyCode }
  const priceDisplay = useMemo(() => {
    const raw =
      selectedVariantObj?.price?.amount ?? variants?.[0]?.price?.amount ?? "0";
    const code =
      currency ||
      selectedVariantObj?.price?.currencyCode ||
      variants?.[0]?.price?.currencyCode ||
      "USD";
    return formatMoney(raw, code);
  }, [selectedVariantObj, variants, currency]);

  const currencyCode =
    currency ||
    selectedVariantObj?.price?.currencyCode ||
    variants?.[0]?.price?.currencyCode ||
    "USD";

  const isSoldOut = selectedVariantObj?.availableForSale === false;

  if (!product || !images.length) return null;

  const closeWithEvent = useCallback(
    (ui_action) => {
      pushDataLayer({
        event: "quick_view_close",
        store_section: "popup",
        product_id: product?.handle,
        product_title: product?.title,
        ui_action,
        view_context: "quick_view",
      });
      onClose();
    },
    [onClose, product],
  );

  const closeIfOverlay = (e) => {
    if (e.target.id === "overlay") closeWithEvent("overlay_close");
  };

  const goPrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  const goNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAdd = async () => {
    if (!selectedVariant || isSoldOut || loading) return;

    pushDataLayer({
      event: "add_to_cart",
      store_section: "popup",
      product_id: product?.handle,
      product_title: product?.title,
      variant_id: selectedVariant,
      quantity: 1,
      currency: currencyCode,
      ui_action: "quick_view_add_to_cart",
      view_context: "quick_view",
    });

    await handleAddToCart(selectedVariant, 1);

    if (typeof refreshCart === "function") {
      await refreshCart();
    }

    if (typeof openCart === "function") openCart();

    closeWithEvent("post_add_close");
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || isSoldOut || loading) return;

    pushDataLayer({
      event: "begin_checkout",
      store_section: "popup",
      product_id: product?.handle,
      product_title: product?.title,
      variant_id: selectedVariant,
      quantity: 1,
      currency: currencyCode,
      ui_action: "quick_view_buy_now",
      view_context: "quick_view",
    });

    await handleAddToCart(selectedVariant, 1);

    let freshCart = null;
    if (typeof refreshCart === "function") {
      freshCart = await refreshCart();
    }

    const checkoutUrl = freshCart?.checkoutUrl || cart?.checkoutUrl;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    if (typeof openCart === "function") openCart();
    closeWithEvent("buy_now_fallback_open_cart");
  };

  return (
    <div
      id="overlay"
      onClick={closeIfOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-lg shadow-xl flex flex-col md:flex-row relative">
        {/* Close */}
        <button
          onClick={() => closeWithEvent("close_button")}
          className="absolute top-3 right-3 bg-white p-1 rounded-full shadow z-10"
          aria-label="Close Modal"
          type="button">
          <X className="w-6 h-6 text-black" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-4">
          <div className="relative w-full aspect-[4/5] max-w-[480px] bg-white flex items-center justify-center rounded">
            <Image
              src={images[selectedImageIndex]?.src}
              alt={product.title}
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    pushDataLayer({
                      event: "quick_view_image_nav",
                      store_section: "popup",
                      product_id: product?.handle,
                      ui_action: "prev_image",
                      view_context: "quick_view",
                    });
                    goPrev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
                  aria-label="Previous image">
                  <ArrowLeft className="w-5 h-5 text-black" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    pushDataLayer({
                      event: "quick_view_image_nav",
                      store_section: "popup",
                      product_id: product?.handle,
                      ui_action: "next_image",
                      view_context: "quick_view",
                    });
                    goNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
                  aria-label="Next image">
                  <ArrowRight className="w-5 h-5 text-black" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto px-2">
              {images.map((img, i) => (
                <Image
                  key={`${img.src}-${i}`}
                  src={img.src}
                  alt={`Thumbnail ${i + 1}`}
                  width={64}
                  height={80}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImageIndex(i);
                    pushDataLayer({
                      event: "quick_view_thumbnail_click",
                      store_section: "popup",
                      product_id: product?.handle,
                      ui_action: "thumbnail_select",
                      view_context: "quick_view",
                      value: i,
                    });
                  }}
                  className={`rounded-md cursor-pointer border object-cover ${
                    selectedImageIndex === i
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight mb-2 truncate max-w-full">
              {product.title}
            </h1>

            <p className="text-lg text-gray-700 mb-4">{priceDisplay}</p>

            {variants.length > 0 && (
              <>
                <label
                  htmlFor="variant"
                  className="block text-sm font-medium text-gray-600 mb-1">
                  Edition / Size
                </label>

                <select
                  id="variant"
                  value={selectedVariant}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value);
                    pushDataLayer({
                      event: "select_item",
                      store_section: "popup",
                      product_id: product?.handle,
                      product_title: product?.title,
                      variant_id: e.target.value,
                      ui_action: "variant_select",
                      view_context: "quick_view",
                    });
                  }}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-4">
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </>
            )}

            {isSoldOut && (
              <div className="mb-3 text-sm font-medium text-red-600">
                Sold Out
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={loading || isSoldOut}
              className={`w-full py-2 rounded mb-2 text-sm font-medium ${
                loading || isSoldOut
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              type="button">
              {loading ? "Adding…" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={loading || isSoldOut}
              className={`w-full py-2 rounded text-sm font-medium ${
                loading || isSoldOut
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              type="button">
              {loading ? "Processing…" : "Buy It Now"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Limited to 2 units per customer.
            </p>
          </div>

          {/* View Details */}
          <div className="mt-5 text-center">
            <Link
              href={`/popup/${product.handle}#product-details`}
              scroll={false}
              className="view-details-link text-sm inline-block"
              onClick={() =>
                pushDataLayer({
                  event: "view_item",
                  store_section: "popup",
                  product_id: product?.handle,
                  product_title: product?.title,
                  ui_action: "view_details",
                  view_context: "quick_view",
                })
              }>
              VIEW PRODUCT DETAILS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
