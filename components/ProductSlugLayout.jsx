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

/* Swiper CSS is loaded globally */

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

  const price = Number(selectedVariant?.priceV2?.amount || 0).toFixed(2);

  const isSoldOut =
    selectedVariant?.availableForSale === false ||
    product?.availableForSale === false;

  /* -----------------------------
Swiper animation config
A1 / A2 Soft (Best practice)
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

  /* -----------------------------
Handlers
------------------------------ */
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
    <main className="bg-white text-black px-4 py-12 container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* ================= IMAGE COLUMN ================= */}
        <div className="w-full lg:max-w-[550px] relative">
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
                className={`rounded shadow overflow-hidden ${
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
                        className="object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Arrows */}
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
          ) : (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded shadow">
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
                    currentImageIdx === idx ? "border-black" : "border-gray-300"
                  }`}>
                  <Image src={img.src} alt="" width={80} height={100} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= DETAILS COLUMN ================= */}
        <div className="w-full lg:max-w-md">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex space-x-2">
              <li>
                <Link href={breadcrumbHref}>{breadcrumbLabel}</Link>
                <span className="mx-1">/</span>
              </li>
              <li className="text-black font-medium truncate">
                {product.title}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          {product.description && (
            <p className="text-sm italic text-gray-600 mb-4">
              {product.description}
            </p>
          )}

          <p className="text-xl font-semibold mb-4">${price}</p>

          {/* Color Swatches */}
          {colorOptions.length > 1 && (
            <div className="mb-4">
              <label className="block mb-1">Color</label>
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
            <div className="mb-4">
              <label className="block mb-1">Edition / Size</label>
              <select
                value={selectedVariant.id}
                onChange={(e) =>
                  setSelectedVariant(
                    variantsForColor.find((v) => v.id === e.target.value),
                  )
                }
                className="w-full border rounded p-2">
                {variantsForColor.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-3 mb-6">
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
    </main>
  );
}
