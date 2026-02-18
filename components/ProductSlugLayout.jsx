import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import TabSection from "@/components/TabSection";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export default function ProductSlugLayout({
  product,
  portfolioId,
  storeSection = "shop",
  backHref = "/shop",
  backLabel = "Back to Shop",
  breadcrumbLabel = "Popup",
  breadcrumbHref = "/popup",
}) {
  const { handleAddToCart } = useShopContext();
  const router = useRouter();
  const swiperRef = useRef(null);

  if (!product || !product.variants || !product.images) {
    return <div className="text-center py-20 text-lg">Loading product…</div>;
  }

  const isPopup = storeSection === "popup";

  /* ---------------- Variant logic ---------------- */

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

  const defaultVariant = product.variants[0];

  const defaultColor =
    defaultVariant.selectedOptions?.find(
      (o) => o.name.toLowerCase() === "color",
    )?.value || "";

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

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
    swiperRef.current?.slideToLoop?.(0);
  }, [selectedColor]);

  const price = Number(selectedVariant?.priceV2?.amount || 0).toFixed(2);

  const isSoldOut =
    selectedVariant?.availableForSale === false ||
    product?.availableForSale === false;

  /* ---------------- Swiper config ---------------- */

  const creativeEffect = {
    prev: { translate: ["-12%", 0, -1], scale: 0.95, opacity: 0.6 },
    next: { translate: ["12%", 0, -1], scale: 0.95, opacity: 0.6 },
  };

  const handleArrowNav = (dir) => {
    if (dir === "prev") swiperRef.current?.slidePrev();
    if (dir === "next") swiperRef.current?.slideNext();
  };

  const handleThumbnailClick = (idx) => {
    setCurrentImageIdx(idx);
    swiperRef.current?.slideToLoop?.(idx);
  };

  const handleSlideChange = (swiper) => {
    setCurrentImageIdx(swiper.realIndex);
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  /* ============================================================ */
  /* ========================== RENDER ========================== */
  /* ============================================================ */

  return (
    <main className="bg-white text-black">
      {/* ⭐ KITH-STYLE WRAPPER — CRITICAL */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* ================= IMAGE COLUMN ================= */}
          <div className="w-full lg:w-[55%] relative">
            <div className="relative">
              {/* ✅ ALWAYS show swiper (fixes missing arrows) */}
              <Swiper
                modules={[EffectCreative]}
                effect="creative"
                creativeEffect={creativeEffect}
                speed={700}
                loop
                onSwiper={(s) => (swiperRef.current = s)}
                onSlideChange={handleSlideChange}
                className="rounded shadow overflow-hidden">
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="aspect-[4/5] w-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={img.src}
                        alt={product.title}
                        width={1600}
                        height={2000}
                        priority={idx === 0}
                        className="object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ✅ ARROWS ALWAYS PRESENT */}
              <button
                className="modal-arrow left"
                onClick={() => handleArrowNav("prev")}>
                <ChevronLeft />
              </button>

              <button
                className="modal-arrow right"
                onClick={() => handleArrowNav("next")}>
                <ChevronRight />
              </button>
            </div>

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
          <div className="w-full lg:w-[45%] max-w-[520px]">
            {/* ✅ SINGLE breadcrumb line */}
            <nav className="text-sm text-gray-500 mb-4">
              <span className="text-gray-400">Popup</span>
              <span className="mx-2">/</span>
              <span className="text-black font-medium">{product.title}</span>
            </nav>

            {/* ✅ TITLE FIX */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              {product.title}
            </h1>

            {product.description && (
              <p className="text-sm italic text-gray-600 mb-5">
                {product.description}
              </p>
            )}

            <p className="text-xl font-semibold mb-6">${price}</p>

            {/* ================= CTA ================= */}
            <div className="space-y-4 mb-8">
              {!isSoldOut ? (
                <>
                  <button
                    className="w-full bg-black text-white py-3 rounded"
                    onClick={() => handleAddToCart(selectedVariant.id, 1)}>
                    Add to Cart
                  </button>

                  <button
                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
                    onClick={handleBuyNow}>
                    Buy It Now
                  </button>
                </>
              ) : (
                <button className="w-full border py-3 rounded">
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
