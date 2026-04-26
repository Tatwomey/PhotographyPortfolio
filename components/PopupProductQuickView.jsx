import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  console.log(`[GTM] ${payload.event} pushed`, payload);
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

function normalizeImage(image) {
  if (!image) return null;

  if (typeof image === "string") {
    return { src: image };
  }

  if (image.src) {
    return {
      ...image,
      src: image.src,
    };
  }

  if (image.url) {
    return {
      ...image,
      src: image.url,
    };
  }

  return null;
}

function normalizeImages(product) {
  const productImages = Array.isArray(product?.images)
    ? product.images.map(normalizeImage).filter(Boolean)
    : [];

  const allImages = Array.isArray(product?.allImages)
    ? product.allImages.map(normalizeImage).filter(Boolean)
    : [];

  const fallbackImages = [product?.imageSrc, product?.altImageSrc]
    .map(normalizeImage)
    .filter(Boolean);

  const merged = [...productImages, ...allImages, ...fallbackImages];

  const seen = new Set();

  return merged.filter((image) => {
    if (!image?.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
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

function getVariantTitle(variant) {
  if (!variant) return "";

  if (variant.title && variant.title !== "Default Title") {
    return variant.title;
  }

  if (Array.isArray(variant.options) && variant.options.length) {
    return variant.options
      .map((option) => option?.value)
      .filter(Boolean)
      .join(" / ");
  }

  if (
    Array.isArray(variant.selectedOptions) &&
    variant.selectedOptions.length
  ) {
    return variant.selectedOptions
      .map((option) => option?.value)
      .filter(Boolean)
      .join(" / ");
  }

  return variant.title || "Default";
}

function buildAnalyticsItem({ product, selectedVariantObj, quantity = 1 }) {
  const rawPrice = getVariantAmount(selectedVariantObj);

  return {
    item_id: String(
      selectedVariantObj?.id ||
        product?.id ||
        product?.handle ||
        product?.title ||
        "",
    ),
    item_name: product?.title || "",
    item_brand: "Trevor Twomey Photo",
    item_category: "Fine Art Print",
    item_variant: getVariantTitle(selectedVariantObj),
    price: Number(rawPrice || 0),
    quantity: Number(quantity || 1),
  };
}

export default function PopupProductQuickView({ product, onClose }) {
  const { cart, loading, handleAddToCart, refreshCart, openCart } =
    useShopContext();

  const safeProduct = product || {};
  const images = useMemo(() => normalizeImages(safeProduct), [safeProduct]);
  const variants = useMemo(
    () => getProductVariants(safeProduct),
    [safeProduct],
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    variants?.[0]?.id || "",
  );

  useEffect(() => {
    document.body.classList.add("modal-open");
    setSelectedImageIndex(0);
    setSelectedVariant(variants?.[0]?.id || "");

    pushDataLayer({
      event: "quick_view_open",
      store_section: "popup",
      product_id: safeProduct?.handle,
      product_title: safeProduct?.title,
      view_context: "quick_view",
    });

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [safeProduct?.handle, safeProduct?.title, variants]);

  const selectedVariantObj = useMemo(() => {
    return (
      variants.find((variant) => variant.id === selectedVariant) ||
      variants[0] ||
      null
    );
  }, [variants, selectedVariant]);

  const priceAmount = useMemo(() => {
    return getVariantAmount(selectedVariantObj);
  }, [selectedVariantObj]);

  const currencyCode = useMemo(() => {
    return getVariantCurrencyCode(selectedVariantObj);
  }, [selectedVariantObj]);

  const priceDisplay = useMemo(() => {
    return formatMoney(priceAmount, currencyCode);
  }, [priceAmount, currencyCode]);

  const isSoldOut = useMemo(() => {
    if (safeProduct?.availableForSale === false) return true;
    if (!selectedVariantObj) return false;

    return getVariantAvailable(selectedVariantObj) === false;
  }, [safeProduct?.availableForSale, selectedVariantObj]);

  const closeWithEvent = useCallback(
    (ui_action) => {
      pushDataLayer({
        event: "quick_view_close",
        store_section: "popup",
        product_id: safeProduct?.handle,
        product_title: safeProduct?.title,
        ui_action,
        view_context: "quick_view",
      });

      if (typeof onClose === "function") onClose();
    },
    [onClose, safeProduct?.handle, safeProduct?.title],
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
    if (!selectedVariant || isSoldOut || loading || !selectedVariantObj) return;

    const item = buildAnalyticsItem({
      product: safeProduct,
      selectedVariantObj,
      quantity: 1,
    });

    await handleAddToCart(selectedVariant, 1);

    pushDataLayer({
      event: "add_to_cart",
      currency: currencyCode,
      value: Number(priceAmount || 0),
      items: [item],
      page_type: "popup_quick_view",
      page_path: window.location.pathname,
      page_location: window.location.href,
    });

    if (typeof refreshCart === "function") {
      await refreshCart();
    }

    if (typeof openCart === "function") openCart();

    closeWithEvent("post_add_close");
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || isSoldOut || loading || !selectedVariantObj) return;

    const item = buildAnalyticsItem({
      product: safeProduct,
      selectedVariantObj,
      quantity: 1,
    });

    await handleAddToCart(selectedVariant, 1);

    pushDataLayer({
      event: "add_to_cart",
      currency: currencyCode,
      value: Number(priceAmount || 0),
      items: [item],
      page_type: "popup_quick_view",
      page_path: window.location.pathname,
      page_location: window.location.href,
    });

    let freshCart = null;

    if (typeof refreshCart === "function") {
      freshCart = await refreshCart();
    }

    pushDataLayer({
      event: "begin_checkout",
      currency: currencyCode,
      value: Number(priceAmount || 0),
      items: [item],
      page_type: "checkout",
      page_path: window.location.pathname,
      page_location: window.location.href,
    });

    const checkoutUrl = freshCart?.checkoutUrl || cart?.checkoutUrl;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      return;
    }

    if (typeof openCart === "function") openCart();
    closeWithEvent("buy_now_fallback_open_cart");
  };

  if (!safeProduct || !images.length) return null;

  return (
    <div
      id="overlay"
      onClick={closeIfOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-lg shadow-xl flex flex-col md:flex-row relative">
        <button
          onClick={() => closeWithEvent("close_button")}
          className="absolute top-3 right-3 bg-white p-1 rounded-full shadow z-10"
          aria-label="Close Modal"
          type="button">
          <X className="w-6 h-6 text-black" />
        </button>

        <div className="w-full md:w-1/2 flex flex-col items-center p-4">
          <div className="relative w-full aspect-[4/5] max-w-[480px] bg-white flex items-center justify-center rounded">
            <Image
              src={images[selectedImageIndex]?.src}
              alt={safeProduct.title}
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
                      product_id: safeProduct?.handle,
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
                      product_id: safeProduct?.handle,
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
                      product_id: safeProduct?.handle,
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

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight mb-2 truncate max-w-full">
              {safeProduct.title}
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
                      product_id: safeProduct?.handle,
                      product_title: safeProduct?.title,
                      variant_id: e.target.value,
                      ui_action: "variant_select",
                      view_context: "quick_view",
                    });
                  }}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-4">
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {getVariantTitle(variant)}
                      {getVariantAvailable(variant) ? "" : " — Sold Out"}
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

          <div className="mt-5 text-center">
            <Link
              href={`/popup/${safeProduct.handle}#product-details`}
              scroll={false}
              className="view-details-link text-sm inline-block"
              onClick={() =>
                pushDataLayer({
                  event: "view_details_click",
                  store_section: "popup",
                  product_id: safeProduct?.handle,
                  product_title: safeProduct?.title,
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
