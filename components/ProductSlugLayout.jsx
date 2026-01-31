import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import TabSection from "@/components/TabSection";

/* ---------------- Swiper v9 ---------------- */
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

  if (!product || !product.images || !product.variants) {
    return <div className="text-center py-20">Loading product…</div>;
  }

  /* ---------------- Portfolio ID ---------------- */
  const computedPortfolioId = useMemo(() => {
    if (portfolioId) return portfolioId;
    return `${storeSection}_slug:${product.handle}`;
  }, [portfolioId, product.handle, storeSection]);

  /* ---------------- Default Variant ---------------- */
  const defaultVariant = product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  /* ---------------- Image State ---------------- */
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---------------- Price ---------------- */
  const price = Number(selectedVariant.priceV2?.amount || 0).toFixed(2);

  /* ---------------- Sold Out ---------------- */
  const isSoldOut = selectedVariant.availableForSale === false;

  /* =====================================================
A2-SOFT CREATIVE EFFECT (Option B – index-aware)
===================================================== */
  const creativeEffect = {
    prev: {
      translate: ["-12%", 0, -1],
      opacity: 0.85,
    },
    next: {
      translate: ["12%", 0, -1],
      opacity: 0.85,
    },
  };

  const isPopup = storeSection === "popup";

  /* ---------------- Slide Change ---------------- */
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  /* ---------------- Thumbnail Click ---------------- */
  const handleThumbnailClick = (idx) => {
    if (!swiperRef.current) return;
    swiperRef.current.slideToLoop(idx, 600);
  };

  /* ---------------- Buy Now ---------------- */
  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  /* =====================================================
RENDER
===================================================== */
  return (
    <main className="bg-white text-black px-4 py-12 container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* =================================================
IMAGE COLUMN
================================================= */}
        <div className="w-full lg:max-w-[550px] relative">
          {isPopup ? (
            <>
              {/* ---------- Swiper ---------- */}
              <Swiper
                modules={[EffectCreative]}
                effect="creative"
                creativeEffect={creativeEffect}
                speed={650}
                loop
                onSwiper={(s) => (swiperRef.current = s)}
                onSlideChange={handleSlideChange}
                className="rounded shadow overflow-hidden">
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="popup-zoom-wrapper">
                      <Image
                        src={img.src}
                        alt={product.title}
                        width={1600}
                        height={2000}
                        priority={idx === 0}
                        className="popup-zoom-image object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ---------- Arrows ---------- */}
              <button
                className="modal-arrow left"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>

              <button
                className="modal-arrow right"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next image">
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            /* ---------- Shop fallback ---------- */
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded shadow">
              <Image
                src={product.images[0].src}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* ---------- Thumbnails ---------- */}
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`border rounded-md overflow-hidden ${
                    idx === activeIndex ? "border-black" : "border-gray-300"
                  }`}>
                  <Image src={img.src} alt="" width={80} height={100} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =================================================
DETAILS COLUMN
================================================= */}
        <div className="w-full lg:max-w-md">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4">
            <Link href={breadcrumbHref}>{breadcrumbLabel}</Link> /{" "}
            <span className="text-black font-medium">{product.title}</span>
          </nav>

          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          {product.description && (
            <p className="text-sm italic text-gray-600 mb-4">
              {product.description}
            </p>
          )}

          <p className="text-xl font-semibold mb-4">${price}</p>

          {/* CTA */}
          <div className="space-y-3 mb-6">
            {!isSoldOut ? (
              <>
                <button
                  className="w-full bg-black text-white py-3 rounded font-medium"
                  onClick={() => handleAddToCart(selectedVariant.id, 1)}>
                  Add to Cart
                </button>

                <button
                  className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800"
                  onClick={handleBuyNow}>
                  Buy It Now
                </button>
              </>
            ) : (
              <button className="w-full border border-black py-3 rounded font-semibold">
                Notify Me When Back in Stock
              </button>
            )}
          </div>

          <TabSection details={product.description} />

          <div className="mt-6">
            <Link href={backHref} className="text-gray-600 hover:text-black">
              ← {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
