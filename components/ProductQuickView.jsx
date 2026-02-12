import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import { useCurrency } from "@/contexts/CurrencyContext";

/* -----------------------------------------
   Helpers
------------------------------------------ */

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

/* -----------------------------------------
   Component
------------------------------------------ */

export default function PopupProductQuickView({ product, onClose }) {
  const { cart, loading, handleAddToCart, refreshCart, openCart } =
    useShopContext();
  const { currency } =
    useCurrency(); /* -----------------------------------------
     Safe Normalization
  ------------------------------------------ */

  const safeProduct = product || {};
  const safeImages = Array.isArray(safeProduct.images)
    ? safeProduct.images
    : [];
  const safeVariants = Array.isArray(safeProduct.variants)
    ? safeProduct.variants
    : []; /* -----------------------------------------
     State
  ------------------------------------------ */

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    safeVariants[0] || null,
  ); /* -----------------------------------------
     Reinitialize when product changes
  ------------------------------------------ */

  useEffect(() => {
    if (!safeVariants.length) return;

    document.body.classList.add("modal-open");

    setSelectedImageIndex(0);
    setSelectedVariant(safeVariants[0] || null);

    pushDataLayer({
      event: "quick_view_open",
      store_section: "popup",
      product_id: safeProduct.handle,
      product_title: safeProduct.title,
      view_context: "quick_view",
    });

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [safeProduct.handle]); // only when product actually changes
  /* -----------------------------------------
     Variant + Price Logic (Fully Hardened)
  ------------------------------------------ */

  const priceData = useMemo(() => {
    if (!selectedVariant) {
      return { amount: "0.00", currencyCode: "USD" };
    } // Support BOTH shapes:
    // 1) { price: { amount, currencyCode } }
    // 2) { priceV2: { amount, currencyCode } }

    const fromPrice = selectedVariant.price;
    const fromPriceV2 = selectedVariant.priceV2;

    if (fromPrice?.amount) return fromPrice;
    if (fromPriceV2?.amount) return fromPriceV2;

    return { amount: "0.00", currencyCode: "USD" };
  }, [selectedVariant]);

  const formattedPrice = useMemo(() => {
    return formatMoney(
      priceData.amount,
      currency || priceData.currencyCode || "USD",
    );
  }, [priceData, currency]);

  const isSoldOut =
    selectedVariant?.availableForSale ===
    false; /* -----------------------------------------
     Close Handler
  ------------------------------------------ */

  const closeWithEvent = useCallback(
    (ui_action) => {
      pushDataLayer({
        event: "quick_view_close",
        store_section: "popup",
        product_id: safeProduct.handle,
        product_title: safeProduct.title,
        ui_action,
        view_context: "quick_view",
      });
      if (typeof onClose === "function") onClose();
    },
    [onClose, safeProduct],
  ); /* -----------------------------------------
     Image Navigation
  ------------------------------------------ */

  const goPrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1,
    );
  };

  const goNext = () => {
    setSelectedImageIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1,
    );
  }; /* -----------------------------------------
     Cart Actions
  ------------------------------------------ */

  const handleAdd = async () => {
    if (!selectedVariant?.id || isSoldOut || loading) return;

    pushDataLayer({
      event: "add_to_cart",
      store_section: "popup",
      product_id: safeProduct.handle,
      product_title: safeProduct.title,
      variant_id: selectedVariant.id,
      quantity: 1,
      price: priceData.amount,
      currency: priceData.currencyCode,
      ui_action: "quick_view_add_to_cart",
      view_context: "quick_view",
    });

    await handleAddToCart(selectedVariant.id, 1);

    if (typeof refreshCart === "function") {
      await refreshCart();
    }

    if (typeof openCart === "function") openCart();

    closeWithEvent("post_add_close");
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id || isSoldOut || loading) return;

    await handleAddToCart(selectedVariant.id, 1);

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
  }; /* -----------------------------------------
     Safety Exit
  ------------------------------------------ */

  if (!safeProduct || !safeImages.length)
    return null; /* -----------------------------------------
     Render
  ------------------------------------------ */

  return (
    <div
      id="overlay"
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
              src={safeImages[selectedImageIndex]?.src}
              alt={safeProduct.title || "Product image"}
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
                        
            {safeImages.length > 1 && (
              <>
                                
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10">
                                    
                  <ArrowLeft className="w-5 h-5 text-black" />
                                  
                </button>
                                
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10">
                                    
                  <ArrowRight className="w-5 h-5 text-black" />
                                  
                </button>
                              
              </>
            )}
                      
          </div>
                  
        </div>
                {/* Info Section */}
                
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                    
          <div>
                        
            <h1 className="text-lg sm:text-xl font-semibold mb-2">
                            {safeProduct.title}
                          
            </h1>
                        
            <p className="text-lg text-gray-700 mb-4">
                            {formattedPrice}
                          
            </p>
                        
            {safeVariants.length > 0 && (
              <>
                                
                <label className="block text-sm font-medium mb-1">
                                    Edition / Size                 
                </label>
                                
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) =>
                    setSelectedVariant(
                      safeVariants.find((v) => v.id === e.target.value) ||
                        safeVariants[0],
                    )
                  }
                  className="w-full border border-gray-300 rounded-md p-2 mb-4">
                                    
                  {safeVariants.map((variant) => (
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
              className="w-full py-2 rounded mb-2 text-sm font-medium bg-black text-white hover:bg-gray-800">
                            Add to Cart             
            </button>
                        
            <button
              onClick={handleBuyNow}
              disabled={loading || isSoldOut}
              className="w-full py-2 rounded text-sm font-medium bg-black text-white hover:bg-gray-800">
                            Buy It Now             
            </button>
                        
            <p className="text-xs text-center text-gray-500 mt-2">
                            Limited to 2 units per customer.             
            </p>
                      
          </div>
                    
          <div className="mt-5 text-center">
                        
            <Link
              href={`/popup/${safeProduct.handle}`}
              className="text-sm inline-block underline">
                            VIEW PRODUCT DETAILS             
            </Link>
                      
          </div>
                  
        </div>
              
      </div>
          
    </div>
  );
}
