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
import { EffectCreative } from "swiper";

/* -----------------------------
Helpers
------------------------------ */

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function formatPrice(amount, currencyCode = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(Number(amount || 0));
  } catch {
    return `$${Number(amount || 0).toFixed(2)}`;
  }
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

  if (!product || !product.variants || !product.images) {
    return <div className="text-center py-20 text-lg">Loading product…</div>;
  }

  const isPopup = storeSection === "popup";

  /* -----------------------------
Portfolio ID
------------------------------ */
  const computedPortfolioId = useMemo(() => {
    if (portfolioId) return portfolioId;
    return `${storeSection}_slug:${product.handle}`;
  }, [portfolioId, product.handle, storeSection]);

  /* -----------------------------
Variant logic
------------------------------ */
  const colorOptions = useMemo(() => {
    const vals = product.variants
      .map(
        (v) =>
          v.selectedOptions?.find((o) => o.name.toLowerCase() === "color")
            ?.value,
      )
      .filter(Boolean);
    return Array.from(new Set(vals));
  }, [product.variants]);

  const defaultVariant = useMemo(() => {
    const handle = product.handle.toLowerCase();
    const wantsMono = handle.includes("mono") || handle.includes("bw");
    const targetColor = wantsMono ? "monochrome" : "regular";

    return (
      product.variants.find((v) =>
        v.selectedOptions?.some(
          (o) =>
            o.name.toLowerCase() === "color" &&
            o.value.toLowerCase() === targetColor,
        ),
      ) || product.variants[0]
    );
  }, [product]);

  const defaultColor =
    defaultVariant.selectedOptions?.find(
      (o) => o.name.toLowerCase() === "color",
    )?.value || "";

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [zoomPulse, setZoomPulse] = useState(false);

  const variantsForColor = useMemo(() => {
    if (!selectedColor) return product.variants;
    return product.variants.filter((v) =>
      v.selectedOptions?.some(
        (o) => o.name.toLowerCase() === "color" && o.value === selectedColor,
      ),
    );
  }, [product.variants, selectedColor]);

  useEffect(() => {
    const v = variantsForColor[0];
    if (!v) return;
    setSelectedVariant(v);
    setCurrentImageIdx(0);
    swiperRef.current?.slideToLoop(0);
  }, [selectedColor]);

  const priceAmount =
    selectedVariant?.priceV2?.amount || selectedVariant?.price?.amount || 0;

  const currencyCode =
    selectedVariant?.priceV2?.currencyCode ||
    selectedVariant?.price?.currencyCode ||
    "USD";

  const formattedPrice = formatPrice(priceAmount, currencyCode);

  const isSoldOut =
    selectedVariant?.availableForSale === false ||
    product?.availableForSale === false;

  /* -----------------------------
Swiper animation
------------------------------ */
  const creativeEffect = {
    prev: {
      translate: ["-12%", 0, -1],
      scale: 0.95,
      opacity: 0.6,
    },
    next: {
      translate: ["12%", 0, -1],
      scale: 0.95,
      opacity: 0.6,
    },
  };

  const triggerZoomPulse = () => {
    setZoomPulse(true);
    setTimeout(() => setZoomPulse(false), 450);
  };

  const handleArrowNav = (dir) => {
    triggerZoomPulse();
    if (dir === "prev") swiperRef.current?.slidePrev();
    if (dir === "next") swiperRef.current?.slideNext();
  };

  const handleThumbnailClick = (idx) => {
    triggerZoomPulse();
    setCurrentImageIdx(idx);
    swiperRef.current?.slideToLoop(idx);
  };

  const handleSlideChange = (swiper) => {
    setCurrentImageIdx(swiper.realIndex);
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  /* ============================================================
RENDER
============================================================ */

  return (
    <main className="bg-white text-black w-full overflow-x-hidden">
      {/* ELITE CONTAINER */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6 pt-8 lg:pt-12 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* ================= IMAGE COLUMN ================= */}
          <div className="w-full lg:w-[58%] relative">
            {isPopup ? (
              <div className="relative">
                <Swiper
                  modules={[EffectCreative]}
                  effect="creative"
                  creativeEffect={creativeEffect}
                  speed={700}
                  loop
                  onSwiper={(s) => (swiperRef.current = s)}
                  onSlideChange={handleSlideChange}
                  className={`rounded-md overflow-hidden ${
                    zoomPulse ? "zoom-pulse" : ""
                  }`}>
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="aspect-[4/5] w-full flex items-center justify-center overflow-hidden">
                        <Image
                          src={img.src}
                          alt={product.title}
                          width={1600}
                          height={2000}
                          priority={idx === 0}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* ARROWS — ALWAYS VISIBLE */}
                <button
                  className="modal-arrow left !flex"
                  onClick={() => handleArrowNav("prev")}>
                  <ChevronLeft />
                </button>
                <button
                  className="modal-arrow right !flex"
                  onClick={() => handleArrowNav("next")}>
                  <ChevronRight />
                </button>
              </div>
            ) : (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
                <Image
                  src={product.images[0].src}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`border rounded ${
                      currentImageIdx === idx
                        ? "border-black"
                        : "border-gray-300"
                    }`}>
                    <Image src={img.src} alt="" width={80} height={100} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS COLUMN ================= */}
          <div className="w-full lg:w-[42%] lg:pt-6">
            {/* Breadcrumb — popup focused */}
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

            {/* TITLE — NO AWKWARD BREAK */}
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight tracking-tight mb-3">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-sm italic text-gray-600 mb-5">
                {product.description}
              </p>
            )}

            <p className="text-xl font-semibold mb-6">{formattedPrice}</p>

            {/* Color Swatches */}
            {colorOptions.length > 1 && (
              <div className="mb-5">
                <label className="block mb-2 text-sm">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
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

            {/* Variant Dropdown */}
            {variantsForColor.length > 1 && (
              <div className="mb-6">
                <label className="block mb-2 text-sm">Edition / Size</label>
                <select
                  value={selectedVariant.id}
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

            {/* CTA — TIGHT SPACING */}
            <div className="space-y-2 mb-8">
              {!isSoldOut ? (
                <>
                  <button
                    className="w-full bg-black text-white py-3 rounded-md"
                    onClick={() => handleAddToCart(selectedVariant.id, 1)}>
                    Add to Cart
                  </button>

                  <button
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                    onClick={handleBuyNow}>
                    Buy It Now
                  </button>
                </>
              ) : (
                <button className="w-full border py-3 rounded-md">
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
