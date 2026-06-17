import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import TabSection from "@/components/TabSection";

/* -----------------------------
Swiper v9
------------------------------ */
import { Swiper, SwiperSlide } from "swiper/react";

/* -----------------------------
Helpers
------------------------------ */

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  console.log(`[GTM] ${payload.event} pushed`, payload);
}

function normalizeAnalyticsPrice(value) {
  const num = Number(value || 0);

  if (!Number.isFinite(num)) return 0;

  // Guard against accidental micros/subunit prices appearing in analytics.
  // Example: 350000000 should normalize back to 350.
  if (num > 1000000) return num / 1000000;

  return num;
}

function formatPrice(amount, currencyCode = "USD") {
  const normalizedAmount = normalizeAnalyticsPrice(amount);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(normalizedAmount);
  } catch {
    return `$${normalizedAmount.toFixed(2)}`;
  }
}

function buildAnalyticsItem({
  product,
  selectedVariant,
  priceAmount,
  quantity = 1,
}) {
  const normalizedPrice = normalizeAnalyticsPrice(priceAmount);

  return {
    item_id: String(
      selectedVariant?.id ||
        product?.id ||
        product?.handle ||
        product?.title ||
        "",
    ),
    item_name: product?.title || "",
    item_brand: "Trevor Twomey Photo",
    item_category: "Fine Art Print",
    item_variant: selectedVariant?.title || "",
    price: normalizedPrice,
    quantity: Number(quantity || 1),
  };
}

function getImageAlt(img, productTitle, idx) {
  return (
    img?.altText || img?.alt || `${productTitle || "Product image"} ${idx + 1}`
  );
}

/* ============================================================
COMPONENT
============================================================ */

export default function ProductSlugLayout({
  product,
  portfolioId,
  storeSection = "shop",
  backHref = "/shop",
  backLabel = "Back to Shop",
  breadcrumbLabel = "Shop",
  breadcrumbHref = "/shop",
}) {
  const { handleAddToCart } = useShopContext();
  const router = useRouter();
  const swiperRef = useRef(null);
  const lastViewItemRef = useRef("");

  const isPopup = storeSection === "popup";

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants],
  );

  const images = useMemo(
    () => (Array.isArray(product?.images) ? product.images : []),
    [product?.images],
  );

  const hasRenderableProduct = Boolean(
    product && variants.length && images.length,
  );

  /* -----------------------------
  Portfolio ID
  ------------------------------ */
  const computedPortfolioId = useMemo(() => {
    if (portfolioId) return portfolioId;
    return `${storeSection}_slug:${product?.handle || "unknown"}`;
  }, [portfolioId, product?.handle, storeSection]);

  /* -----------------------------
  Variant logic
  ------------------------------ */
  const colorOptions = useMemo(() => {
    const vals = variants
      .map(
        (v) =>
          v.selectedOptions?.find((o) => o.name.toLowerCase() === "color")
            ?.value,
      )
      .filter(Boolean);

    return Array.from(new Set(vals));
  }, [variants]);

  const defaultVariant = useMemo(() => {
    const handle = product?.handle?.toLowerCase() || "";
    const wantsMono = handle.includes("mono") || handle.includes("bw");
    const targetColor = wantsMono ? "monochrome" : "regular";

    return (
      variants.find((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === "color" &&
            o.value.toLowerCase() === targetColor,
        ),
      ) ||
      variants[0] ||
      null
    );
  }, [product?.handle, variants]);

  const defaultColor =
    defaultVariant?.selectedOptions?.find(
      (o) => o.name.toLowerCase() === "color",
    )?.value || "";

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [zoomPulse, setZoomPulse] = useState(false);

  const variantsForColor = useMemo(() => {
    if (!selectedColor) return variants;

    return variants.filter((v) =>
      v.selectedOptions?.some(
        (o) => o.name.toLowerCase() === "color" && o.value === selectedColor,
      ),
    );
  }, [variants, selectedColor]);

  useEffect(() => {
    setSelectedColor(defaultColor);
    setSelectedVariant(defaultVariant);
    setCurrentImageIdx(0);
    swiperRef.current?.slideToLoop?.(0);
  }, [defaultColor, defaultVariant, product?.handle]);

  useEffect(() => {
    const v = variantsForColor[0];
    if (!v) return;

    setSelectedVariant(v);
    setCurrentImageIdx(0);
    swiperRef.current?.slideToLoop?.(0);
  }, [selectedColor, variantsForColor]);

  const rawPriceAmount =
    selectedVariant?.priceV2?.amount || selectedVariant?.price?.amount || 0;

  const priceAmount = normalizeAnalyticsPrice(rawPriceAmount);

  const currencyCode =
    selectedVariant?.priceV2?.currencyCode ||
    selectedVariant?.price?.currencyCode ||
    "USD";

  const formattedPrice = formatPrice(priceAmount, currencyCode);

  const isSoldOut =
    selectedVariant?.availableForSale === false ||
    product?.availableForSale === false;

  const currentImage = images[currentImageIdx] || images[0];

  /* -----------------------------
  Analytics: view_item
  ------------------------------ */
  useEffect(() => {
    if (!product || !selectedVariant) return;

    const dedupeKey = `${product.handle}:${selectedVariant.id}:${storeSection}`;
    if (lastViewItemRef.current === dedupeKey) return;

    const item = buildAnalyticsItem({
      product,
      selectedVariant,
      priceAmount,
      quantity: 1,
    });

    pushDataLayer({
      event: "view_item",
      currency: currencyCode,
      value: priceAmount,
      items: [item],
      item_id: item.item_id,
      item_name: item.item_name,
      item_variant: item.item_variant,
      page_type: `${storeSection}_product`,
      page_path: window.location.pathname,
      page_location: window.location.href,
      content_group: storeSection,
      portfolio_id: computedPortfolioId,
    });

    lastViewItemRef.current = dedupeKey;
  }, [
    product,
    selectedVariant,
    priceAmount,
    currencyCode,
    storeSection,
    computedPortfolioId,
  ]);

  const triggerZoomPulse = () => {
    setZoomPulse(true);
    setTimeout(() => setZoomPulse(false), 450);
  };

  const handleArrowNav = (dir) => {
    triggerZoomPulse();

    if (dir === "prev") swiperRef.current?.slidePrev?.();
    if (dir === "next") swiperRef.current?.slideNext?.();
  };

  const handleThumbnailClick = (idx) => {
    triggerZoomPulse();
    setCurrentImageIdx(idx);
    swiperRef.current?.slideToLoop?.(idx);
  };

  const handleSlideChange = (swiper) => {
    setCurrentImageIdx(swiper.realIndex);
  };

  const handleAddToCartClick = async () => {
    if (!selectedVariant?.id) return;

    await handleAddToCart(selectedVariant.id, 1);

    const item = buildAnalyticsItem({
      product,
      selectedVariant,
      priceAmount,
      quantity: 1,
    });

    pushDataLayer({
      event: "add_to_cart",
      currency: currencyCode,
      value: priceAmount,
      items: [item],
      item_id: item.item_id,
      item_name: item.item_name,
      item_variant: item.item_variant,
      quantity: 1,
      page_type: `${storeSection}_product`,
      page_path: window.location.pathname,
      page_location: window.location.href,
      content_group: storeSection,
      portfolio_id: computedPortfolioId,
    });
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return;

    await handleAddToCart(selectedVariant.id, 1);

    const item = buildAnalyticsItem({
      product,
      selectedVariant,
      priceAmount,
      quantity: 1,
    });

    pushDataLayer({
      event: "add_to_cart",
      currency: currencyCode,
      value: priceAmount,
      items: [item],
      item_id: item.item_id,
      item_name: item.item_name,
      item_variant: item.item_variant,
      quantity: 1,
      page_type: `${storeSection}_product`,
      page_path: window.location.pathname,
      page_location: window.location.href,
      content_group: storeSection,
      portfolio_id: computedPortfolioId,
    });

    pushDataLayer({
      event: "begin_checkout",
      currency: currencyCode,
      value: priceAmount,
      items: [item],
      page_type: "checkout",
      page_path: window.location.pathname,
      page_location: window.location.href,
      content_group: storeSection,
      portfolio_id: computedPortfolioId,
    });

    router.push("/checkout");
  };

  if (!hasRenderableProduct) {
    return <div className="text-center py-20 text-lg">Loading product…</div>;
  }

  /* ============================================================
  RENDER
  ============================================================ */

  return (
    <main className="bg-white text-black w-full overflow-x-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-5 lg:px-8 pt-8 lg:pt-12 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* ================= IMAGE COLUMN ================= */}
          <div className="w-full lg:w-[60%] relative">
            {isPopup ? (
              <div className="relative">
                <Swiper
                  speed={450}
                  loop
                  onSwiper={(s) => (swiperRef.current = s)}
                  onSlideChange={handleSlideChange}
                  className={`rounded-md overflow-hidden ${
                    zoomPulse ? "zoom-pulse" : ""
                  }`}>
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      {/* 
                        Premium flexible gallery stage:
                        - Not forced to 4:5
                        - Wide GFAP mockups can breathe
                        - Portrait print mockups still display cleanly
                      */}
                      <div className="relative w-full h-[62vh] min-h-[420px] max-h-[760px] bg-[#f7f7f4] flex items-center justify-center overflow-hidden rounded-md">
                        <Image
                          src={img.src}
                          alt={getImageAlt(img, product.title, idx)}
                          fill
                          priority={idx === 0}
                          sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
                          className="object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="modal-arrow left !flex"
                      onClick={() => handleArrowNav("prev")}
                      aria-label="Previous product image">
                      <ChevronLeft />
                    </button>

                    <button
                      type="button"
                      className="modal-arrow right !flex"
                      onClick={() => handleArrowNav("next")}
                      aria-label="Next product image">
                      <ChevronRight />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative w-full h-[62vh] min-h-[420px] max-h-[760px] bg-[#f7f7f4] flex items-center justify-center overflow-hidden rounded-md">
                <Image
                  key={currentImage.src}
                  src={currentImage.src}
                  alt={currentImage.altText || product.title}
                  fill
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleThumbnailClick(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border rounded overflow-hidden bg-[#f7f7f4] transition ${
                      currentImageIdx === idx
                        ? "border-black"
                        : "border-gray-300 hover:border-gray-500"
                    }`}>
                    <Image
                      src={img.src}
                      alt={getImageAlt(img, product.title, idx)}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS COLUMN ================= */}
          <div className="w-full lg:w-[40%] lg:pt-6 lg:sticky lg:top-24">
            <nav className="text-sm text-gray-500 mb-4">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href={breadcrumbHref}>{breadcrumbLabel}</Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-black font-medium truncate">
                  {product.title}
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight tracking-tight mb-3">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-sm italic text-gray-600 mb-5">
                {product.description}
              </p>
            )}

            <p className="text-xl font-semibold mb-6">{formattedPrice}</p>

            {colorOptions.length > 1 && (
              <div className="mb-5">
                <label className="block mb-2 text-sm">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color}`}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "monochrome"
                            ? "#000"
                            : "#e5e5e5",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {variantsForColor.length > 1 && (
              <div className="mb-6">
                <label className="block mb-2 text-sm">Edition / Size</label>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) =>
                    setSelectedVariant(
                      variantsForColor.find((v) => v.id === e.target.value),
                    )
                  }
                  className="w-full border rounded-md p-3">
                  {variantsForColor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2 mb-8">
              {!isSoldOut ? (
                <>
                  <button
                    type="button"
                    className="w-full bg-black text-white py-3 rounded-md"
                    onClick={handleAddToCartClick}>
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                    onClick={handleBuyNow}>
                    Buy It Now
                  </button>
                </>
              ) : (
                <button type="button" className="w-full border py-3 rounded-md">
                  Notify Me When Back in Stock
                </button>
              )}
            </div>

            <TabSection details={product.description} />

            <div className="mt-6">
              <Link href={backHref} className="text-gray-600">
                ← {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
