import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import TabSection from "@/components/TabSection";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export default function ProductSlugLayout({
  product,
  portfolioId,
  storeSection = "shop", // "shop" | "popup"
  backHref = "/shop",
  backLabel = "Back to Shop",
  breadcrumbLabel = "Shop",
  breadcrumbHref = "/shop",
}) {
  const { handleAddToCart } = useShopContext();
  const router = useRouter();

  if (!product || !product.variants || !product.images) {
    return <div className="text-center py-20 text-lg">Loading product...</div>;
  }

  // Build portfolioId if not passed
  const computedPortfolioId = useMemo(() => {
    if (portfolioId) return portfolioId;
    const handle = product?.handle || "unknown";
    return `${storeSection}_slug:${handle}`;
  }, [portfolioId, product?.handle, storeSection]);

  // --- Color options (if present)
  const colorOptions = useMemo(() => {
    const vals = product.variants
      .map(
        (v) =>
          v.selectedOptions?.find((opt) => opt.name?.toLowerCase() === "color")
            ?.value
      )
      .filter(Boolean);

    return Array.from(new Set(vals));
  }, [product.variants]);

  // --- Default Variant prefers "Regular"
  const defaultVariant = useMemo(() => {
    return (
      product.variants.find((v) =>
        v.selectedOptions?.some(
          (opt) =>
            opt.name?.toLowerCase() === "color" &&
            String(opt.value).toLowerCase() === "regular"
        )
      ) || product.variants[0]
    );
  }, [product.variants]);

  const defaultColor = useMemo(() => {
    return defaultVariant.selectedOptions?.find(
      (opt) => opt.name?.toLowerCase() === "color"
    )?.value;
  }, [defaultVariant]);

  const [selectedColor, setSelectedColor] = useState(defaultColor || "");
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [mainImage, setMainImage] = useState(
    defaultVariant.image?.src || product.images[0]?.src
  );

  // Variants for selected color (if color exists)
  const variantsForColor = useMemo(() => {
    if (!selectedColor) return product.variants;
    return product.variants.filter((v) =>
      v.selectedOptions?.some(
        (opt) =>
          opt.name?.toLowerCase() === "color" && opt.value === selectedColor
      )
    );
  }, [product.variants, selectedColor]);

  // When color changes, select first variant in that color
  useEffect(() => {
    const v = variantsForColor[0];
    if (!v) return;

    setSelectedVariant(v);
    setMainImage(v.image?.src || product.images[0]?.src);
    setCurrentImageIdx(0);
  }, [selectedColor]); // intentionally only color change

  const price = useMemo(() => {
    const raw = selectedVariant?.priceV2?.amount ?? "0";
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
  }, [selectedVariant]);

  const currency = useMemo(() => {
    // If your data includes currencyCode elsewhere, wire it here.
    return "USD";
  }, []);

  // Variant dropdown change
  const handleVariantChange = (e) => {
    const variant = product.variants.find((v) => v.id === e.target.value);
    if (!variant) return;

    setSelectedVariant(variant);
    setMainImage(variant.image?.src || product.images[0]?.src);

    const newColor = variant.selectedOptions?.find(
      (opt) => opt.name?.toLowerCase() === "color"
    );
    if (newColor?.value) setSelectedColor(newColor.value);

    pushDataLayer({
      event: "variant_change",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      product_title: product?.title,
      variant_id: variant.id,
      item_variant: variant.title,
      price,
      currency,
      ui_action: "variant_select",
      view_context: "slug",
    });
  };

  // Image nav
  const nextImage = () => {
    const newIdx = (currentImageIdx + 1) % product.images.length;
    setCurrentImageIdx(newIdx);
    setMainImage(product.images[newIdx].src);

    pushDataLayer({
      event: "product_image_nav",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      ui_action: "next_image",
      view_context: "slug",
      value: newIdx,
    });
  };

  const prevImage = () => {
    const newIdx =
      (currentImageIdx - 1 + product.images.length) % product.images.length;
    setCurrentImageIdx(newIdx);
    setMainImage(product.images[newIdx].src);

    pushDataLayer({
      event: "product_image_nav",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      ui_action: "prev_image",
      view_context: "slug",
      value: newIdx,
    });
  };

  const handleBuyNow = async () => {
    pushDataLayer({
      event: "begin_checkout",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      product_title: product?.title,
      variant_id: selectedVariant?.id,
      quantity: 1,
      price,
      currency,
      ui_action: "buy_now",
      view_context: "slug",
    });

    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  const handleNotifyClick = () => {
    pushDataLayer({
      event: "notify_me_click",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      product_title: product?.title,
      variant_id: selectedVariant?.id,
      ui_action: "notify_me",
      view_context: "slug",
    });

    if (window._klOnsite) window._klOnsite.push(["openForm", "RjNi3C"]);
  };

  const isSoldOut = selectedVariant?.availableForSale === false;

  // Fire product_view on slug render (once per product)
  useEffect(() => {
    if (!product?.handle) return;

    pushDataLayer({
      event: "product_view",
      portfolio_id: computedPortfolioId,
      store_section: storeSection,
      product_id: product?.handle,
      product_title: product?.title,
      view_context: "slug",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.handle]);

  return (
    <main className="bg-white text-black px-4 py-12 container mx-auto">
      <div
        id="product-details"
        className="flex flex-col lg:flex-row gap-10 scroll-mt-20 items-start">
        {/* Image Column */}
        <div className="w-full lg:max-w-[550px] relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded shadow group">
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="modal-arrow left"
                  aria-label="Prev Image">
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="modal-arrow right"
                  aria-label="Next Image">
                  <ChevronRight />
                </button>
              </>
            )}

            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />

            {isSoldOut && <div className="sold-out-badge">Sold Out</div>}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMainImage(img.src);
                    setCurrentImageIdx(idx);

                    pushDataLayer({
                      event: "product_thumbnail_click",
                      portfolio_id: computedPortfolioId,
                      store_section: storeSection,
                      product_id: product?.handle,
                      ui_action: "thumbnail_select",
                      view_context: "slug",
                      value: idx,
                    });
                  }}
                  className={`border rounded-md overflow-hidden ${
                    currentImageIdx === idx ? "border-black" : "border-gray-300"
                  }`}
                  aria-label={`Thumbnail ${idx + 1}`}>
                  <Image
                    src={img.src}
                    alt={`Thumbnail ${idx}`}
                    width={80}
                    height={100}
                    className="thumbnail-image"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="w-full lg:max-w-md">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex space-x-2">
              <li>
                <Link href={breadcrumbHref} className="hover:underline">
                  {breadcrumbLabel}
                </Link>
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

          {typeof selectedVariant?.quantityAvailable === "number" &&
            selectedVariant.quantityAvailable <= 3 &&
            selectedVariant.quantityAvailable > 0 && (
              <p className="text-sm text-red-600 font-semibold mt-1">
                Only {selectedVariant.quantityAvailable} left in stock!
              </p>
            )}

          {/* Color Swatches */}
          {colorOptions.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);

                      pushDataLayer({
                        event: "color_change",
                        portfolio_id: computedPortfolioId,
                        store_section: storeSection,
                        product_id: product?.handle,
                        product_title: product?.title,
                        ui_action: "color_select",
                        item_variant: color,
                        view_context: "slug",
                      });
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-black ring-2 ring-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === "monochrome"
                          ? "#000"
                          : "#e5e5e5",
                    }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variant dropdown (Edition/Size) */}
          {variantsForColor.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Edition / Size
              </label>
              <select
                value={selectedVariant.id}
                onChange={handleVariantChange}
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
                  type="button"
                  onClick={() => {
                    pushDataLayer({
                      event: "add_to_cart",
                      portfolio_id: computedPortfolioId,
                      store_section: storeSection,
                      product_id: product?.handle,
                      product_title: product?.title,
                      variant_id: selectedVariant?.id,
                      quantity: 1,
                      price,
                      currency,
                      ui_action: "slug_add_to_cart",
                      view_context: "slug",
                    });
                    handleAddToCart(selectedVariant.id, 1);
                  }}
                  className="w-full bg-black text-white py-3 rounded text-lg font-medium">
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-800">
                  Buy It Now
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNotifyClick}
                className="w-full border border-black py-3 rounded text-lg font-semibold hover:bg-gray-100">
                Notify Me When Back in Stock
              </button>
            )}
          </div>

          {/* Tabs */}
          <TabSection details={product.description} />

          {/* ✅ Back link sits directly under the tabs (your request) */}
          <div className="mt-6">
            <Link
              href={backHref}
              className="inline-flex items-center text-sm text-gray-600 hover:text-black transition"
              onClick={() =>
                pushDataLayer({
                  event: "back_nav",
                  portfolio_id: computedPortfolioId,
                  store_section: storeSection,
                  product_id: product?.handle,
                  ui_action: "back_link",
                  view_context: "slug",
                })
              }>
              ← {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
