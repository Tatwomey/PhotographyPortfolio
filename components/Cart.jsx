// components/Cart.jsx
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import { useCurrency } from "@/contexts/CurrencyContext";

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

export default function Cart() {
  const { cart, isCartOpen, closeCart, handleRemoveFromCart, refreshCart } =
    useShopContext();

  const { currency } = useCurrency();

  const lines = cart?.lines?.edges || [];

  // ✅ Prevent body scroll when drawer is open
  useEffect(() => {
    if (!isCartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCartOpen]);

  // ✅ Compute subtotal safely
  const subtotal = useMemo(() => {
    let total = 0;
    let detectedCode = currency || "USD";

    for (const edge of lines) {
      const item = edge?.node;
      const amt = Number.parseFloat(item?.merchandise?.priceV2?.amount ?? "0");
      const qty = item?.quantity ?? 0;
      const code =
        currency ||
        item?.merchandise?.priceV2?.currencyCode ||
        detectedCode ||
        "USD";

      detectedCode = code;
      total += (Number.isFinite(amt) ? amt : 0) * qty;
    }

    return {
      amount: total.toFixed(2),
      currencyCode: detectedCode,
    };
  }, [lines, currency]);

  const drawerOpenClass = isCartOpen ? "translate-x-0" : "translate-x-full";

  const backdropClass = isCartOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-200 ${backdropClass}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-200 ${drawerOpenClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cart Drawer">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="text-lg font-semibold text-black">Cart</div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded hover:bg-black/5"
            aria-label="Close cart">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="h-[calc(100%-64px)] flex flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {lines.length === 0 ? (
              <div className="text-sm text-black/70">Your cart is empty.</div>
            ) : (
              <div className="space-y-5">
                {lines.map((edge) => {
                  const item = edge?.node;
                  const merchandise = item?.merchandise;
                  const product = merchandise?.product;

                  // ✅ Safe image extraction
                  const imageSrc =
                    product?.images?.edges?.[0]?.node?.src ||
                    product?.images?.edges?.[0]?.node?.url ||
                    "/fallback-image.jpg";

                  const title = product?.title || "Item";
                  const qty = item?.quantity ?? 0;

                  const unitAmount = merchandise?.priceV2?.amount ?? "0";
                  const unitCode =
                    currency || merchandise?.priceV2?.currencyCode || "USD";

                  const lineTotal = (
                    Number.parseFloat(unitAmount ?? "0") * qty
                  ).toFixed(2);

                  return (
                    <div
                      key={item?.id || `${title}-${imageSrc}`}
                      className="flex gap-4">
                      <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={imageSrc}
                          alt={title}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-black truncate">
                              {title}
                            </div>
                            <div className="text-xs text-black/60 mt-1">
                              Qty: {qty}
                            </div>
                            <div className="text-xs text-black/60 mt-1">
                              Unit: {formatMoney(unitAmount, unitCode)}
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-black whitespace-nowrap">
                            {formatMoney(lineTotal, unitCode)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            // Remove (your shopContext decrements qty or removes)
                            await handleRemoveFromCart(item);
                            if (typeof refreshCart === "function") {
                              await refreshCart();
                            }
                          }}
                          className="mt-2 text-xs text-red-600 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-black/70">Subtotal</div>
              <div className="text-base font-semibold text-black">
                {formatMoney(subtotal.amount, subtotal.currencyCode)}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={cart?.checkoutUrl || "#"}
                onClick={(e) => {
                  if (!cart?.checkoutUrl) e.preventDefault();
                }}
                className={`flex-1 text-center py-3 rounded text-sm font-medium ${
                  cart?.checkoutUrl
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}>
                Checkout
              </Link>

              <Link
                href="/popup"
                onClick={closeCart}
                className="flex-1 text-center py-3 rounded text-sm font-medium border border-black/20 text-black hover:bg-black/5">
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
